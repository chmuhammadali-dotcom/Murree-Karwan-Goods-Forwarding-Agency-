const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
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

    // Send actual email if SMTP transporter is configured
    if (transporter) {
      const mailOptions = {
        from: process.env.EMAIL_USER || transporter.options.auth.user,
        to: 'mkgforwardingagency@gmail.com',
        subject: `New Quote Request #${result.insertId} from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #1a3357; border-radius: 8px; max-width: 600px; color: #0e2038;">
            <h2 style="color: #c1602e; border-bottom: 2px solid #c1602e; padding-bottom: 8px;">New Quote Request #${result.insertId}</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone (WhatsApp):</strong> ${phone_number}</p>
            <p><strong>Service Needed:</strong> ${service_needed}</p>
            <p><strong>Pickup Location:</strong> ${pickup_location}</p>
            <p><strong>Destination:</strong> ${destination}</p>
            <div style="background-color: #f6efe4; padding: 15px; border-radius: 6px; margin-top: 15px;">
              <p><strong>Message / Cargo Details:</strong></p>
              <p>${message || '(No detailed message provided)'}</p>
            </div>
            <p style="font-size: 0.8rem; color: #b9c4d4; margin-top: 20px; text-align: center;">Submitted via Murree Karwan Goods Forwarding Agency Portal</p>
          </div>
        `
      };
      
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('[Email] Actual email delivery failed:', err.message);
        } else {
          console.log('[Email] Actual email sent successfully:', info.response);
          if (isEthereal) {
            const testUrl = nodemailer.getTestMessageUrl(info);
            console.log('\n================================================================');
            console.log('📬 [Email] View your formatted email at this link:');
            console.log(`    👉 ${testUrl}`);
            console.log('================================================================\n');
          }
        }
      });
    }

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
