const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { pool, testConnection } = require('./db');

require('dotenv').config();

const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
let transporter = null;
let isEthereal = false;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  console.log('[Email] Nodemailer configured to send actual emails via Gmail SMTP.');
} else {
  // Auto-generate Ethereal credentials for instant testing
  console.log('[Email] Gmail credentials missing in .env. Auto-generating a temporary Ethereal SMTP test account...');
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('[Email] Failed to create Ethereal SMTP test account:', err.message);
      return;
    }
    transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });
    isEthereal = true;
    console.log('\n================================================================');
    console.log('✉️  [Email] Temporary SMTP Testing Account Created!');
    console.log(`    User: ${account.user}`);
    console.log(`    Pass: ${account.pass}`);
    console.log('    All emails sent will be captured in a test inbox.');
    console.log('================================================================\n');
  });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend connection
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Global logging middleware
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.path} from IP ${req.ip}`);
  next();
});

// Configure Rate Limiting to prevent brute-force/spam on quote forms
const quoteSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per 15-minute window
  message: {
    success: false,
    error: 'Too many quote requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Database Auto-Initialization
async function initializeDatabase() {
  const { poolConfig } = require('./db');
  const mysql = require('mysql2/promise');

  console.log('[Database] Auto-verifying database and table structures...');
  
  // 1. Try to create the database if it doesn't exist
  try {
    const conn = await mysql.createConnection({
      host: poolConfig.host,
      user: poolConfig.user,
      password: poolConfig.password
    });
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${poolConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await conn.end();
    console.log(`[Database] Database '${poolConfig.database}' verified.`);
  } catch (err) {
    console.warn(`[Database] Database auto-creation step skipped or failed: ${err.message}`);
  }

  // 2. Try to create the inquiries table
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`inquiries\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`phone_number\` VARCHAR(50) NOT NULL,
        \`service_needed\` VARCHAR(100) NOT NULL,
        \`pickup_location\` VARCHAR(255) NOT NULL,
        \`destination\` VARCHAR(255) NOT NULL,
        \`message\` TEXT,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX \`idx_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('[Database] Table \'inquiries\' verified/created successfully.');
  } catch (err) {
    console.error(`[Database] Table auto-creation failed: ${err.message}`);
  }
}

// REST Endpoints
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// POST /api/inquiries - Submit a quote request (Apply Rate Limiting)
app.post('/api/inquiries', quoteSubmitLimiter, async (req, res, next) => {
  const { name, phone_number, service_needed, pickup_location, destination, message } = req.body;

  // Server-side validation
  if (!name || !phone_number || !service_needed || !pickup_location || !destination) {
    return res.status(400).json({
      success: false,
      error: 'Please fill in all required fields (Name, Phone Number, Service Needed, Pickup, and Destination).'
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO inquiries (name, phone_number, service_needed, pickup_location, destination, message) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, phone_number, service_needed, pickup_location, destination, message || '']
    );

    // Email Dispatch Terminal Log
    console.log('\n==================================================');
    console.log('📬 [EMAIL LOG] Notification to Murree Karwan Goods Admin:');
    console.log(`To: mkgforwardingagency@gmail.com`);
    console.log(`Subject: New Quote Request #${result.insertId} from ${name}`);
    console.log('--------------------------------------------------');
    console.log(`Name:            ${name}`);
    console.log(`Phone:           ${phone_number}`);
    console.log(`Service:         ${service_needed}`);
    console.log(`Pickup:          ${pickup_location}`);
    console.log(`Destination:     ${destination}`);
    console.log(`Message:         ${message || '(None)'}`);
    console.log('==================================================\n');



    res.status(201).json({
      success: true,
      message: 'Your quote request has been submitted successfully!',
      inquiryId: result.insertId
    });
  } catch (error) {
    console.error('[API] Error inserting inquiry:', error.message);
    next(error);
  }
});

// GET /api/inquiries - Fetch submissions (for testing and walkthrough verification)
app.get('/api/inquiries', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('[API] Error retrieving inquiries:', error.message);
    next(error);
  }
});

// --- MOBILE APP AUTHENTICATION ENDPOINTS ---
const activeOtps = new Map(); // Simple memory map to store: phone_number -> { otp, expires }
const JWT_SECRET = process.env.JWT_SECRET || 'karwan_secret_123';

// POST /api/auth/register - Register Shipper
app.post('/api/auth/register', async (req, res, next) => {
  const { name, phone_number, account_type, ntn_number } = req.body;

  if (!name || !phone_number) {
    return res.status(400).json({ success: false, error: 'Name and Phone Number are required.' });
  }

  try {
    // Check if user already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE phone_number = ?', [phone_number]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, error: 'Phone number already registered.' });
    }

    const [result] = await pool.query(
      'INSERT INTO users (name, phone_number, account_type, ntn_number) VALUES (?, ?, ?, ?)',
      [name, phone_number, account_type || 'individual', ntn_number || null]
    );

    res.status(201).json({
      success: true,
      message: 'Shipper registered successfully!',
      userId: result.insertId
    });
  } catch (error) {
    console.error('[Auth API] Error registering shipper:', error.message);
    next(error);
  }
});

// POST /api/auth/register-driver - Register Driver
app.post('/api/auth/register-driver', async (req, res, next) => {
  const { name, phone_number, cnic, license_number } = req.body;

  if (!name || !phone_number || !cnic || !license_number) {
    return res.status(400).json({ success: false, error: 'All fields (Name, Phone, CNIC, License) are required.' });
  }

  try {
    // Check if driver already exists
    const [existing] = await pool.query('SELECT id FROM drivers WHERE phone_number = ? OR cnic = ? OR license_number = ?', [phone_number, cnic, license_number]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, error: 'Driver credentials (Phone, CNIC, or License) already exist.' });
    }

    const [result] = await pool.query(
      'INSERT INTO drivers (name, phone_number, cnic, license_number) VALUES (?, ?, ?, ?)',
      [name, phone_number, cnic, license_number]
    );

    res.status(201).json({
      success: true,
      message: 'Driver registered successfully!',
      driverId: result.insertId
    });
  } catch (error) {
    console.error('[Auth API] Error registering driver:', error.message);
    next(error);
  }
});

const https = require('https');
const querystring = require('querystring');

// Helper to send real SMS via Twilio API
function sendTwilioSms(to, body) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!sid || !token || !from) {
    return Promise.reject(new Error('Twilio credentials missing in environment variables.'));
  }

  const postData = querystring.stringify({ From: from, To: to, Body: body });
  const auth = 'Basic ' + Buffer.from(sid + ':' + token).toString('base64');

  const options = {
    hostname: 'api.twilio.com',
    port: 443,
    path: `/2010-04-01/Accounts/${sid}/Messages.json`,
    method: 'POST',
    headers: {
      'Authorization': auth,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(responseBody));
        } else {
          reject(new Error(`Twilio returned status ${res.statusCode}: ${responseBody}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

// POST /api/auth/login - Request SMS OTP
app.post('/api/auth/login', async (req, res, next) => {
  const { phone_number, role } = req.body; // role: 'shipper' or 'driver' or 'admin'

  if (!phone_number || !role) {
    return res.status(400).json({ success: false, error: 'Phone Number and Role are required.' });
  }

  try {
    let userExists = false;
    
    if (role === 'shipper') {
      const [rows] = await pool.query('SELECT id FROM users WHERE phone_number = ?', [phone_number]);
      userExists = rows.length > 0;
    } else if (role === 'driver') {
      const [rows] = await pool.query('SELECT id FROM drivers WHERE phone_number = ?', [phone_number]);
      userExists = rows.length > 0;
    } else if (role === 'admin') {
      // Admin bypass checks: allows official phone to access dashboard
      userExists = (phone_number === '03330103759' || phone_number === 'admin');
    }

    if (!userExists) {
      return res.status(404).json({ success: false, error: 'User profile not found. Please register first.' });
    }

    // Generate random 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // Expires in 5 minutes

    activeOtps.set(phone_number, { otp: otpCode, expires: expiresAt });

    const smsBody = `Your Murree Karwan verification code is: ${otpCode}. Expire in 5 mins.`;

    console.log('==================================================');
    console.log(`📱 [SMS OTP DISPATCH] to ${phone_number}:`);
    console.log(`Message: "${smsBody}"`);
    console.log('==================================================');

    // Attempt to dispatch real SMS via Twilio
    try {
      await sendTwilioSms(phone_number, smsBody);
      console.log(`✓ Real SMS OTP sent successfully to ${phone_number}`);
      
      res.json({
        success: true,
        message: 'Verification OTP sent via SMS!',
        realSmsSent: true
      });
    } catch (smsError) {
      console.warn(`[SMS API Warning] Failed to send real SMS: ${smsError.message}`);
      console.info(`[SMS API Fallback] Displaying code in API response for developer testing.`);
      
      res.json({
        success: true,
        message: 'Verification OTP sent (Simulated Fallback Mode)!',
        realSmsSent: false,
        testOtp: otpCode // Returned for easy visual simulation if API keys are missing
      });
    }
  } catch (error) {
    console.error('[Auth API] Login request failed:', error.message);
    next(error);
  }
});

// POST /api/auth/verify-otp - Verify code and return JWT
app.post('/api/auth/verify-otp', async (req, res, next) => {
  const { phone_number, otp, role } = req.body;

  if (!phone_number || !otp || !role) {
    return res.status(400).json({ success: false, error: 'Phone, OTP, and Role are required.' });
  }

  try {
    const record = activeOtps.get(phone_number);
    if (!record) {
      return res.status(400).json({ success: false, error: 'No active OTP request found.' });
    }

    if (Date.now() > record.expires) {
      activeOtps.delete(phone_number);
      return res.status(400).json({ success: false, error: 'OTP has expired. Please request a new one.' });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ success: false, error: 'Incorrect OTP code.' });
    }

    // OTP Verified. Fetch profile details
    let userProfile = null;
    if (role === 'shipper') {
      const [rows] = await pool.query('SELECT * FROM users WHERE phone_number = ?', [phone_number]);
      userProfile = rows[0];
    } else if (role === 'driver') {
      const [rows] = await pool.query('SELECT * FROM drivers WHERE phone_number = ?', [phone_number]);
      userProfile = rows[0];
    }

    // Clear OTP from memory
    activeOtps.delete(phone_number);

    // Generate JWT Token
    const payload = {
      id: userProfile.id,
      name: userProfile.name,
      phone_number: userProfile.phone_number,
      role: role,
      account_type: userProfile.account_type || null
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Authentication successful!',
      token,
      profile: payload
    });
  } catch (error) {
    console.error('[Auth API] Verification failed:', error.message);
    next(error);
  }
});

// POST /api/voice-booking - Process Roman Urdu speech transcript using Gemini LLM
app.post('/api/voice-booking', async (req, res, next) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ success: false, error: 'Transcript text is required.' });
  }

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.warn('[Gemini LLM] Warning: GEMINI_API_KEY is not defined in .env. Returning simulated extraction.');
      
      const hasMazda = /mazda/i.test(transcript);
      const hasShahzore = /shahzore/i.test(transcript);
      const vehicle = hasMazda ? 'Mazda' : (hasShahzore ? 'Shahzore' : 'Suzuki');
      
      return res.json({
        success: true,
        source: 'fallback_regex',
        data: {
          pickup: 'Islamabad I-10 Adda',
          destination: 'Lahore Shahdara',
          vehicle: vehicle,
          weight_tons: vehicle === 'Mazda' ? 8 : (vehicle === 'Shahzore' ? 3.5 : 1.2),
          date: new Date().toISOString().split('T')[0]
        }
      });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are the Karwan Logistics AI booking assistant. Your task is to extract structured JSON data from a transcript of a shipper ordering a truck in Roman Urdu or Urdu.

JSON Structure to output:
{
  "pickup": "string or null",
  "destination": "string or null",
  "vehicle": "Shahzore" | "Mazda" | "Suzuki" | "Unknown",
  "weight_tons": float | null,
  "date": "YYYY-MM-DD" | null
}

IMPORTANT: Return ONLY the raw JSON block without markdown formatting or code block markers.

Transcript: "${transcript}"
Output:`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    let parsedData;
    try {
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    } catch (e) {
      console.error('[Gemini LLM] Failed to parse model output as JSON:', responseText);
      parsedData = {
        pickup: null,
        destination: null,
        vehicle: 'Unknown',
        weight_tons: null,
        date: null,
        raw_output: responseText
      };
    }

    res.json({
      success: true,
      source: 'gemini_flash',
      data: parsedData
    });
  } catch (error) {
    console.error('[Gemini LLM API] Parsing request failed:', error.message);
    next(error);
  }
});


// POST /api/gps-logs - Upload live background GPS tracking ping from driver mobile app
app.post('/api/gps-logs', async (req, res, next) => {
  const { booking_id, lat, lon } = req.body;

  if (!booking_id || lat === undefined || lon === undefined) {
    return res.status(400).json({ success: false, error: 'Booking ID, Latitude (lat), and Longitude (lon) are required.' });
  }

  try {
    const [booking] = await pool.query('SELECT id, status FROM bookings WHERE id = ?', [booking_id]);
    if (booking.length === 0) {
      return res.status(404).json({ success: false, error: 'Booking record not found.' });
    }

    const [result] = await pool.query(
      'INSERT INTO gps_logs (booking_id, lat, lon) VALUES (?, ?, ?)',
      [booking_id, lat, lon]
    );

    console.log(`📡 [GPS LOG] Ping recorded for Booking #${booking_id}: Coordinates (${lat}, ${lon})`);

    res.status(201).json({
      success: true,
      message: 'Driver location ping recorded successfully!',
      logId: result.insertId
    });
  } catch (error) {
    console.error('[Telemetry API] Error recording GPS log:', error.message);
    next(error);
  }
});


// Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    error: 'An internal server error occurred while processing your request.'
  });
});

// Start Server
async function startServer() {
  // Try connecting and initializing
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 [Server] Murree Karwan backend listening on http://localhost:${PORT}`);
  });
}

startServer();
