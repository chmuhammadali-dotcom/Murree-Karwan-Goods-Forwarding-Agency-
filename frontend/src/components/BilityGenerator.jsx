import React, { useState, useEffect } from 'react';
import './BilityGenerator.css';

// Branch Offices Details
const BRANCHES = {
  islamabad_main: {
    id: 'islamabad_main',
    name: 'Islamabad Head Office (I-10/1)',
    nameUrdu: 'مرکزی اسلام آباد برانچ (آئی-10/1)',
    address: 'Plot No. 3-A, Street 59, Al-Yasir Market, I-10/1, Islamabad',
    addressUrdu: 'پلاٹ نمبر 3-A، گلی نمبر 59، الیاسر مارکیٹ، I-10/1، اسلام آباد',
    phones: ['051-4446767', '0321-5436767', '0321-5658986'],
    email: 'mkgforwardingagency@gmail.com',
    website: 'murreekarwan.com'
  },
  yamaha_chowk: {
    id: 'yamaha_chowk',
    name: 'Yamaha Chowk Branch (Kahuta Road)',
    nameUrdu: 'یاہما چوک برانچ (کہوٹہ روڈ)',
    address: 'Yamaha Chowk, Industrial Triangle, Kahuta Road, Islamabad',
    addressUrdu: 'یاہما چوک، انڈسٹریل ٹرائینگل، کہوٹہ روڈ، اسلام آباد',
    phones: ['051-4493767', '0300-5426767', '0333-5426767', '0333-0103755'],
    email: 'mkgforwardingagency@gmail.com',
    website: 'murreekarwan.com'
  },
  rawat: {
    id: 'rawat',
    name: 'Rawat Branch (G.T. Road)',
    nameUrdu: 'روات برانچ (جی ٹی روڈ)',
    address: 'G.T. Road Rawat near Chaudhry Hotel, Chak Beli Khan More',
    addressUrdu: 'جی ٹی روڈ روات نزد چوہدری ہوٹل، چلی بیلی موڑ',
    phones: ['051-4262267', '0345-5436767', '0333-0103759'],
    email: 'mkgforwardingagency@gmail.com',
    website: 'murreekarwan.com'
  }
};

// Branch network directory printed on the back (11 locations) - Urdu
const DIRECTORY_UR = [
  { srv: 'سپر اشیخ گڈز سکھر', city: 'سکھر (Sukkur)', phone: '0306-3100709' },
  { srv: 'بابا معراج گڈز حیدرآباد', city: 'حیدرآباد (Hyderabad)', phone: '0301-2387845' },
  { srv: 'صاحب کارگو سیالکوٹ', city: 'سیالکوٹ (Sialkot)', phone: '0321-7114412' },
  { srv: 'عادل کارگو کھاریاں', city: 'کھاریاں (Kharian)', phone: '0300-5438001' },
  { srv: 'جیوے طفیل گڈز لاہور', city: 'لاہور (Lahore)', phone: '0300-8027984' },
  { srv: 'جھولے لال گڈز قصور', city: 'قصور (Kasur)', phone: '0300-6587150' },
  { srv: 'پارس گڈز جہلم', city: 'جہلم (Jhelum)', phone: '0322-5469587' },
  { srv: 'عوامی گڈز منڈی بہاؤالدین', city: 'منڈی بہاؤالدین (M.B. Din)', phone: '0546-504166' },
  { srv: 'جیوے شاہ دولہ گڈز گجرات', city: 'گجرات (Gujrat)', phone: '0333-8464815' },
  { srv: 'مغل گڈز پھالیہ', city: 'پھالیہ (Phalia)', phone: '0345-8204198' },
  { srv: 'لکی کراچی گڈز سرگودھا', city: 'سرگودھا (Sargodha)', phone: '0300-4478399' }
];

// Branch network directory in English
const DIRECTORY_EN = [
  { srv: 'Super Ashikh Goods Sukkur', city: 'Sukkur', phone: '0306-3100709' },
  { srv: 'Baba Meharaj Goods Hyderabad', city: 'Hyderabad', phone: '0301-2387845' },
  { srv: 'Sahib Cargo Sialkot', city: 'Sialkot', phone: '0321-7114412' },
  { srv: 'Adil Cargo Kharian', city: 'Kharian', phone: '0300-5438001' },
  { srv: 'Jeevay Tufail Goods Lahore', city: 'Lahore', phone: '0300-8027984' },
  { srv: 'Jhulay Lal Goods Kasur', city: 'Kasur', phone: '0300-6587150' },
  { srv: 'Paras Goods Jhelum', city: 'Jhelum', phone: '0322-5469587' },
  { srv: 'Awami Goods Mandi Bahauddin', city: 'Mandi Bahauddin', phone: '0546-504166' },
  { srv: 'Jeevay Shah Doula Goods Gujrat', city: 'Gujrat', phone: '0333-8464815' },
  { srv: 'Mughal Goods Phalia', city: 'Phalia', phone: '0345-8204198' },
  { srv: 'Lucky Karachi Goods Sargodha', city: 'Sargodha', phone: '0300-4478399' }
];

// Terms and Conditions in Urdu
const TERMS_UR = [
  "جس مال میں بیوپاری ہمراہ ہوگا ایجنسی یا کمپنی کسی قسم کے ہرجانے یا نقصان کی ذمہ دار نہ ہو گی۔",
  "تیل، گھی، مربع جات، اور دیگر رسم یا ضائع (Leakage) ہونے کی ایجنسی یا کمپنی ذمہ دار نہ ہو گی۔",
  "بغیر بلٹی پیش کیے بیوپاری کو مال نہیں ملے گا۔",
  "خلاف قانون مال بک کروانے یا بل کی نوعیت کے متعلق کسی قسم کا غلط اندراج یا غلط بیانی کرنے کی تمام تر ذمہ داری بیوپاری پر ہو گی۔",
  "جہاں سے بلٹی جاری ہوئی ہے وہاں کی عدالتوں میں حق سماعت حاصل ہو گا۔",
  "سینٹری پائپ یا پی وی سی پائپ کے ٹوٹ پھوٹ کی ذمہ داری کمپنی پہ نہ ہو گی۔",
  "بلٹی جاری ہونے کے 15 دن کے اندر کمپنی مال نہ پہنچنے کی یا اور مسئلے کی ذمہ دار ہو گی۔",
  "بیوپاری اپنے مال کی انشورنس کے خود ذمہ دار ہیں۔"
];

// Terms and Conditions in English
const TERMS_EN = [
  "If the merchant or sender travels with the cargo, the agency or company shall not be held liable for any damages or transit losses.",
  "The agency or company is not responsible for any leakage, wastage, or damage of oil, ghee, liquid items, or edible preserves.",
  "Cargo will not be delivered to the consignee/receiver without presenting the original printed Bility copy.",
  "Booking illegal goods or providing incorrect declarations on this consignment note is strictly prohibited; the merchant/sender shall bear full liability.",
  "All legal proceedings and disputes shall be subject to the exclusive jurisdiction of the courts at the station where the Bility was issued.",
  "The company does not accept liability for the breakage or cracking of sanitary pipes, clay products, or PVC items.",
  "The company is liable for non-delivery or shipping delays only if a formal claim is registered within 15 days of Bility issuance.",
  "The merchants or cargo owners are solely responsible for obtaining insurance coverage for their own transported goods."
];

const DEFAULT_ITEMS = [
  { qty: '50 Box', desc: 'Industrial Stock / finished packaging', weight: '850 Kg', rate: '12', total: 10200 },
  { qty: '20 Cartons', desc: 'Sanitary fittings and accessories', weight: '300 Kg', rate: '15', total: 4500 }
];

export default function BilityGenerator() {
  const [bilityNo, setBilityNo] = useState(() => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  });
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [selectedBranch, setSelectedBranch] = useState('islamabad_main');
  const [blankTemplate, setBlankTemplate] = useState(false);
  const [copyType, setCopyType] = useState('Office Copy');
  const [previewTab, setPreviewTab] = useState('front'); // front, back, both
  const [language, setLanguage] = useState('english'); // english, bilingual
  
  // Consignor / Consignee details
  const [consignorName, setConsignorName] = useState('Al-Siddique Industries');
  const [consignorPhone, setConsignorPhone] = useState('0300-1234567');
  const [consigneeName, setConsigneeName] = useState('Lahore Distribution Hub');
  const [consigneePhone, setConsigneePhone] = useState('0321-7654321');
  const [destination, setDestination] = useState('Sector C, Thokar Niaz Baig, Lahore');

  // Fleet/Transit Details
  const [driverName, setDriverName] = useState('Muhammad Akram');
  const [vehicleNo, setVehicleNo] = useState('LES-2680');
  const [driverMobile, setDriverMobile] = useState('0345-1122334');

  // Items State
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [advancePaid, setAdvancePaid] = useState(5000);
  
  // History State
  const [history, setHistory] = useState([]);

  // Load History from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mkg_bility_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  // Update item totals when weight or rate changes
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === 'weight' || field === 'rate') {
      const numericWeight = parseFloat(updated[index].weight.replace(/[^0-9.]/g, ''));
      const numericRate = parseFloat(updated[index].rate.replace(/[^0-9.]/g, ''));
      
      if (!isNaN(numericWeight) && !isNaN(numericRate)) {
        updated[index].total = Math.round(numericWeight * numericRate);
      }
    }
    setItems(updated);
  };

  const handleItemTotalChange = (index, value) => {
    const updated = [...items];
    updated[index].total = parseFloat(value) || 0;
    setItems(updated);
  };

  const addRow = () => {
    setItems([...items, { qty: '', desc: '', weight: '', rate: '', total: 0 }]);
  };

  const removeRow = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Mathematical sums
  const totalFreight = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
  const balanceFreight = totalFreight - (parseFloat(advancePaid) || 0);

  // Save waybill to localStorage
  const saveToHistory = () => {
    const newEntry = {
      id: Date.now().toString(),
      bilityNo,
      date,
      selectedBranch,
      consignorName,
      consignorPhone,
      consigneeName,
      consigneePhone,
      destination,
      driverName,
      vehicleNo,
      driverMobile,
      items,
      advancePaid,
      totalFreight,
      balanceFreight,
      language
    };

    const updatedHistory = [newEntry, ...history.slice(0, 49)];
    setHistory(updatedHistory);
    localStorage.setItem('mkg_bility_history', JSON.stringify(updatedHistory));
    alert(`Bility #${bilityNo} saved successfully!`);
  };

  const loadFromHistory = (entry) => {
    if (window.confirm(`Load Bility #${entry.bilityNo} and replace current form values?`)) {
      setBilityNo(entry.bilityNo);
      setDate(entry.date);
      setSelectedBranch(entry.selectedBranch || 'islamabad_main');
      setConsignorName(entry.consignorName);
      setConsignorPhone(entry.consignorPhone);
      setConsigneeName(entry.consigneeName);
      setConsigneePhone(entry.consigneePhone);
      setDestination(entry.destination);
      setDriverName(entry.driverName);
      setVehicleNo(entry.vehicleNo);
      setDriverMobile(entry.driverMobile);
      setItems(entry.items);
      setAdvancePaid(entry.advancePaid);
      if (entry.language) setLanguage(entry.language);
    }
  };

  const deleteFromHistory = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this saved Bility from log?')) {
      const updated = history.filter(item => item.id !== id);
      setHistory(updated);
      localStorage.setItem('mkg_bility_history', JSON.stringify(updated));
    }
  };

  const resetForm = () => {
    if (window.confirm('Are you sure you want to clear current form values?')) {
      setBilityNo(Math.floor(1000 + Math.random() * 9000).toString());
      setConsignorName('');
      setConsignorPhone('');
      setConsigneeName('');
      setConsigneePhone('');
      setDestination('');
      setDriverName('');
      setVehicleNo('');
      setDriverMobile('');
      setItems([{ qty: '', desc: '', weight: '', rate: '', total: 0 }]);
      setAdvancePaid(0);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const activeBranch = BRANCHES[selectedBranch] || BRANCHES.islamabad_main;
  const activeTerms = language === 'english' ? TERMS_EN : TERMS_UR;
  const activeDirectory = language === 'english' ? DIRECTORY_EN : DIRECTORY_UR;

  return (
    <div className="fade-in">
      <div style={{ textAlign: 'center', padding: '3rem 1.5rem 1rem 1.5rem' }}>
        <span className="badge">Operations Console</span>
        <h2 className="section-title">Bility Desk & Waybill Designer</h2>
        <p className="section-subtitle">
          Generate, verify, and print digital consignment notes in English or Bilingual layouts.
        </p>
      </div>

      <div className="bility-workspace">
        {/* LEFT COLUMN: EDITOR FORM PANEL */}
        <div className="editor-panel">
          
          {/* Section 1: Header / Branch / Config */}
          <div className="editor-section">
            <h3 className="editor-section-title">
              <span>1. Waybill Settings</span>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={resetForm}
                style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}
              >
                Clear Form
              </button>
            </h3>
            
            <div className="editor-row">
              <div className="editor-group">
                <label className="editor-label">Bility Number (بلٹی نمبر)</label>
                <input 
                  type="text" 
                  className="editor-input" 
                  value={bilityNo} 
                  onChange={(e) => setBilityNo(e.target.value)} 
                />
              </div>
              <div className="editor-group">
                <label className="editor-label">Date (تاریخ)</label>
                <input 
                  type="date" 
                  className="editor-input" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                />
              </div>
            </div>

            <div className="editor-row">
              <div className="editor-group">
                <label className="editor-label">Booking Branch Office</label>
                <select 
                  className="editor-input" 
                  value={selectedBranch} 
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  style={{ background: 'var(--color-deep-navy)' }}
                >
                  <option value="islamabad_main">{BRANCHES.islamabad_main.name}</option>
                  <option value="yamaha_chowk">{BRANCHES.yamaha_chowk.name}</option>
                  <option value="rawat">{BRANCHES.rawat.name}</option>
                </select>
              </div>
              <div className="editor-group">
                <label className="editor-label">Bility Design Language</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="langMode" 
                      checked={language === 'english'} 
                      onChange={() => setLanguage('english')} 
                    />
                    English Design
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="langMode" 
                      checked={language === 'bilingual'} 
                      onChange={() => setLanguage('bilingual')} 
                    />
                    Bilingual (Urdu / En)
                  </label>
                </div>
              </div>
            </div>

            <div className="editor-row" style={{ marginTop: '0.5rem' }}>
              <div className="editor-group">
                <label className="editor-label">Template Mode</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="templateMode" 
                      checked={!blankTemplate} 
                      onChange={() => setBlankTemplate(false)} 
                    />
                    Pre-filled (Digital)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="templateMode" 
                      checked={blankTemplate} 
                      onChange={() => setBlankTemplate(true)} 
                    />
                    Blank Form (Manual Write)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Consignor & Consignee */}
          <div className="editor-section">
            <h3 className="editor-section-title">2. Shipping Parties (Sender & Receiver)</h3>
            
            <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gold-accent)', margin: '0.5rem 0' }}>Consignor / Sender</h4>
            <div className="editor-row">
              <div className="editor-group">
                <label className="editor-label">Sender Company Name</label>
                <input 
                  type="text" 
                  className="editor-input" 
                  placeholder="e.g. Al-Siddique Industries"
                  value={consignorName} 
                  onChange={(e) => setConsignorName(e.target.value)} 
                  disabled={blankTemplate}
                />
              </div>
              <div className="editor-group">
                <label className="editor-label">Sender Phone Number</label>
                <input 
                  type="text" 
                  className="editor-input" 
                  placeholder="e.g. 0300-1234567"
                  value={consignorPhone} 
                  onChange={(e) => setConsignorPhone(e.target.value)} 
                  disabled={blankTemplate}
                />
              </div>
            </div>

            <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gold-accent)', margin: '1rem 0 0.5rem 0' }}>Consignee / Receiver</h4>
            <div className="editor-row">
              <div className="editor-group">
                <label className="editor-label">Receiver Name</label>
                <input 
                  type="text" 
                  className="editor-input" 
                  placeholder="e.g. Lahore Distribution Hub"
                  value={consigneeName} 
                  onChange={(e) => setConsigneeName(e.target.value)} 
                  disabled={blankTemplate}
                />
              </div>
              <div className="editor-group">
                <label className="editor-label">Receiver Contact Phone</label>
                <input 
                  type="text" 
                  className="editor-input" 
                  placeholder="e.g. 0321-7654321"
                  value={consigneePhone} 
                  onChange={(e) => setConsigneePhone(e.target.value)} 
                  disabled={blankTemplate}
                />
              </div>
            </div>
            <div className="editor-row" style={{ marginTop: '0.5rem' }}>
              <div className="editor-group" style={{ gridColumn: '1 / -1' }}>
                <label className="editor-label">Destination Address / Area</label>
                <input 
                  type="text" 
                  className="editor-input" 
                  placeholder="e.g. Sector C, Thokar Niaz Baig, Lahore"
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)} 
                  disabled={blankTemplate}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Transit Logistics (Vehicle & Driver) */}
          <div className="editor-section">
            <h3 className="editor-section-title">3. Transit Fleet Details (Driver & Vehicle)</h3>
            <div className="editor-row">
              <div className="editor-group">
                <label className="editor-label">Vehicle Number</label>
                <input 
                  type="text" 
                  className="editor-input" 
                  placeholder="e.g. LES-2680"
                  value={vehicleNo} 
                  onChange={(e) => setVehicleNo(e.target.value)} 
                  disabled={blankTemplate}
                />
              </div>
              <div className="editor-group">
                <label className="editor-label">Driver Name</label>
                <input 
                  type="text" 
                  className="editor-input" 
                  placeholder="e.g. Muhammad Akram"
                  value={driverName} 
                  onChange={(e) => setDriverName(e.target.value)} 
                  disabled={blankTemplate}
                />
              </div>
              <div className="editor-group">
                <label className="editor-label">Driver Mobile Number</label>
                <input 
                  type="text" 
                  className="editor-input" 
                  placeholder="e.g. 0345-1122334"
                  value={driverMobile} 
                  onChange={(e) => setDriverMobile(e.target.value)} 
                  disabled={blankTemplate}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Cargo Items Manifest */}
          <div className="editor-section">
            <h3 className="editor-section-title">4. Cargo Items Table</h3>
            {blankTemplate ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-grey-blue)', fontStyle: 'italic', marginBottom: '1rem' }}>
                Note: In Blank Template mode, grid item lines will print empty to allow manual handwriting.
              </p>
            ) : (
              <>
                <table className="items-editor-table">
                  <thead>
                    <tr>
                      <th style={{ width: '15%' }}>Qty</th>
                      <th style={{ width: '45%' }}>Description</th>
                      <th style={{ width: '15%' }}>Weight</th>
                      <th style={{ width: '12%' }}>Rate</th>
                      <th style={{ width: '13%' }}>Total</th>
                      <th style={{ width: '5%' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <input 
                            type="text" 
                            placeholder="50 Box" 
                            value={item.qty} 
                            onChange={(e) => handleItemChange(index, 'qty', e.target.value)} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            placeholder="Cargo items name" 
                            value={item.desc} 
                            onChange={(e) => handleItemChange(index, 'desc', e.target.value)} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            placeholder="e.g. 850 Kg" 
                            value={item.weight} 
                            onChange={(e) => handleItemChange(index, 'weight', e.target.value)} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            placeholder="e.g. 12" 
                            value={item.rate} 
                            onChange={(e) => handleItemChange(index, 'rate', e.target.value)} 
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            value={item.total} 
                            onChange={(e) => handleItemTotalChange(index, e.target.value)} 
                          />
                        </td>
                        <td>
                          <button 
                            type="button" 
                            className="btn-remove-row" 
                            onClick={() => removeRow(index)}
                            title="Remove row"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" className="btn-add-row" onClick={addRow}>
                  + Add Cargo Row
                </button>

                <div className="totals-summary">
                  <div className="totals-row">
                    <span>Gross Freight:</span>
                    <span>Rs. {totalFreight.toLocaleString()}</span>
                  </div>
                  <div className="totals-row" style={{ alignItems: 'center' }}>
                    <span className="editor-label">Advance Paid:</span>
                    <input 
                      type="number" 
                      className="editor-input" 
                      style={{ width: '120px', padding: '0.3rem 0.5rem', textAlign: 'right' }} 
                      value={advancePaid} 
                      onChange={(e) => setAdvancePaid(parseFloat(e.target.value) || 0)} 
                    />
                  </div>
                  <div className="totals-row">
                    <span>Balance Due:</span>
                    <span>Rs. {balanceFreight.toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Section 5: Save & Drafts log */}
          <div className="editor-section" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <h3 className="editor-section-title">5. Saved Database Logs (Local Archive)</h3>
            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ width: '100%', marginBottom: '1rem', padding: '0.8rem' }}
              onClick={saveToHistory}
            >
              💾 Save Current Waybill to Log
            </button>

            {history.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-muted-grey-blue)', textAlign: 'center', fontStyle: 'italic' }}>
                No saved waybills found in browser database.
              </p>
            ) : (
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--color-gold-accent)', marginBottom: '0.5rem' }}>Recent Saved Bills:</h4>
                <div className="history-list">
                  {history.map(entry => (
                    <div key={entry.id} className="history-item">
                      <div className="history-item-info">
                        <strong>Bill #{entry.bilityNo} ({entry.date})</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-grey-blue)' }}>
                          {entry.consignorName || 'Blank'} ➔ {entry.consigneeName || 'Blank'} (Rs. {entry.totalFreight.toLocaleString()})
                        </span>
                      </div>
                      <div className="history-item-actions">
                        <button className="btn-history-load" onClick={() => loadFromHistory(entry)}>Load</button>
                        <button className="btn-history-delete" onClick={(e) => deleteFromHistory(entry.id, e)}>×</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW PANEL */}
        <div className="preview-panel">
          
          {/* Controls Bar for Preview */}
          <div className="preview-controls">
            <div className="editor-group">
              <label className="editor-label">Print Layout Pages</label>
              <div className="preview-btn-group">
                <button 
                  className={`preview-tab-btn ${previewTab === 'front' ? 'active' : ''}`}
                  onClick={() => setPreviewTab('front')}
                >
                  Front Page
                </button>
                <button 
                  className={`preview-tab-btn ${previewTab === 'back' ? 'active' : ''}`}
                  onClick={() => setPreviewTab('back')}
                >
                  Back Page
                </button>
                <button 
                  className={`preview-tab-btn ${previewTab === 'both' ? 'active' : ''}`}
                  onClick={() => setPreviewTab('both')}
                >
                  Print Layout (Both)
                </button>
              </div>
            </div>

            <div className="editor-group">
              <label className="editor-label">Copy Type Stamp</label>
              <select 
                className="editor-input" 
                value={copyType} 
                onChange={(e) => setCopyType(e.target.value)}
                style={{ background: 'var(--color-deep-navy)', fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
              >
                <option>Office Copy</option>
                <option>Consignor Copy</option>
                <option>Consignee Copy</option>
                <option>Driver Copy</option>
                <option>Duplicate Copy</option>
                <option>Blank / No Stamp</option>
              </select>
            </div>

            <button className="btn-print" onClick={handlePrint}>
              🖨️ Print Waybill Book
            </button>
          </div>

          {/* Realistic A4 Render Workspace */}
          <div className="paper-container-scroll">
            <div className="preview-scaled-wrapper" style={{ overflow: 'hidden', padding: '5px' }}>
              <div className="preview-scaled">
                
                {/* 1. FRONT SIDE OF BILITY */}
                {(previewTab === 'front' || previewTab === 'both') && (
                  <div className="bility-paper" style={{ marginBottom: previewTab === 'both' ? '20px' : '0' }}>
                    {/* Copy type badge */}
                    {copyType !== 'Blank / No Stamp' && (
                      <div className="paper-copy-badge">{copyType}</div>
                    )}
                    
                    <div className="paper-bilinguality-indicator">
                      {language === 'english' ? 'Official Consignment Note' : 'Urdu / English Official Waybill'}
                    </div>

                    {/* Header Block */}
                    <div className="front-header">
                      <div className="front-header-top">
                        {/* Logo Left */}
                        <div className="front-header-logo-container">
                          <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="42" stroke="#0E2038" strokeWidth="2.5" />
                            <circle cx="50" cy="50" r="38" fill="#f0f4f8" />
                            <path d="M25 50 C25 36.2 36.2 25 50 25 C63.8 25 75 36.2 75 50 C75 63.8 63.8 75 50 75" stroke="#D9A441" strokeWidth="1.5" strokeDasharray="3 2" />
                            <text x="50" y="46" fill="#0E2038" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">MKG</text>
                            <text x="50" y="62" fill="#C1602E" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.5">GOODS</text>
                          </svg>
                          <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#0E2038', marginTop: '2px' }}>REGD. NO: 15467</span>
                        </div>

                        {/* Middle Text Branding */}
                        <div className="front-header-title-box">
                          {language === 'english' ? (
                            <>
                              <h1 className="main-title" style={{ fontFamily: 'var(--font-heading)' }}>Murree Karwan Goods Forwarding Agency</h1>
                              <h2 className="english-title-sub" style={{ marginTop: '5px' }}>Logistics Transportation & Relocation Grid</h2>
                            </>
                          ) : (
                            <>
                              <h1 className="main-urdu-title">مرکزی کاروان گڈز فارورڈنگ ایجنسی</h1>
                              <h2 className="english-title-sub">Murree Karwan Goods Forwarding Agency</h2>
                            </>
                          )}
                          <div style={{ fontSize: '0.72rem', color: '#444', fontWeight: 'bold', marginTop: '5px' }}>
                            HOUSE & OFFICE RELOCATION • INDENTING • TRANSPORTATION LOGISTICS GRID
                          </div>
                        </div>

                        {/* Right Details (Bility No, Date) */}
                        <div className="front-header-numbering">
                          <div className="bility-meta-badge">
                            <span>{language === 'english' ? 'Waybill No.' : 'Bility No. (بلٹی نمبر)'}</span>
                            <strong>#{bilityNo}</strong>
                          </div>
                          <div style={{ marginTop: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                            Date: <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Header Addresses list */}
                      <div className="front-header-details">
                        <div className="branch-info-list">
                          <div><strong>Booking Origin Hub:</strong> {activeBranch.name}</div>
                          <div><strong>Address:</strong> {activeBranch.address}</div>
                        </div>
                        <div className="branch-info-list" style={{ textAlign: 'right' }}>
                          <div><strong>Operator Contact Nos:</strong></div>
                          <div style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.85rem' }}>
                            {activeBranch.phones.join(' / ')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Parties Section */}
                    <div className="paper-fields-grid">
                      {/* Consignor (Sender) Block */}
                      <div className="paper-field-block">
                        <div className={`field-block-title ${language === 'bilingual' ? 'rtl' : ''}`}>
                          {language === 'english' ? (
                            <span>Consignor / Sender Details</span>
                          ) : (
                            <>
                              <span className="urdu">تفصیل بھیجنے والا (مرسل)</span>
                              <span>Consignor / Sender Details</span>
                            </>
                          )}
                        </div>
                        <div className="field-content">
                          <div className="line-field">
                            <span className="label">{language === 'english' ? 'Company Name:' : 'Name / کمپنی:'}</span>
                            <span className="value">{blankTemplate ? '' : consignorName}</span>
                          </div>
                          <div className="line-field">
                            <span className="label">{language === 'english' ? 'Phone / Mob:' : 'Phone / فون:'}</span>
                            <span className="value">{blankTemplate ? '' : consignorPhone}</span>
                          </div>
                          <div className="line-field">
                            <span className="label">{language === 'english' ? 'Booking Origin:' : 'Booking area:'}</span>
                            <span className="value">
                              {blankTemplate ? '' : (language === 'english' ? activeBranch.name : activeBranch.nameUrdu)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Consignee (Receiver) Block */}
                      <div className="paper-field-block">
                        <div className={`field-block-title ${language === 'bilingual' ? 'rtl' : ''}`}>
                          {language === 'english' ? (
                            <span>Consignee / Receiver Details</span>
                          ) : (
                            <>
                              <span className="urdu">تفصیل پانے والا (مرسل الیہ)</span>
                              <span>Consignee / Receiver Details</span>
                            </>
                          )}
                        </div>
                        <div className="field-content">
                          <div className="line-field">
                            <span className="label">{language === 'english' ? 'Receiver Name:' : 'Receiver / نام:'}</span>
                            <span className="value">{blankTemplate ? '' : consigneeName}</span>
                          </div>
                          <div className="line-field">
                            <span className="label">{language === 'english' ? 'Phone / Mob:' : 'Phone / فون:'}</span>
                            <span className="value">{blankTemplate ? '' : consigneePhone}</span>
                          </div>
                          <div className="line-field">
                            <span className="label">{language === 'english' ? 'Destination:' : 'Dest / پتا:'}</span>
                            <span className="value">{blankTemplate ? '' : destination}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transit Fleet Details Panel */}
                    <div className="paper-field-block" style={{ marginBottom: '15px' }}>
                      <div className={`field-block-title ${language === 'bilingual' ? 'rtl' : ''}`} style={{ background: '#1A3357' }}>
                        {language === 'english' ? (
                          <span>Transit Logistics Info (Driver & Vehicle Registry)</span>
                        ) : (
                          <>
                            <span className="urdu">ٹرانسپورٹ اور ڈرائیور کی تفصیل</span>
                            <span>Logistics Transit Grid</span>
                          </>
                        )}
                      </div>
                      <div className="transit-content">
                        <div className="line-field">
                          <span className="label">{language === 'english' ? 'Vehicle No:' : 'Vehicle No / گاڑی:'}</span>
                          <span className="value">{blankTemplate ? '' : vehicleNo}</span>
                        </div>
                        <div className="line-field">
                          <span className="label">{language === 'english' ? 'Driver Name:' : 'Driver / ڈرائیور:'}</span>
                          <span className="value">{blankTemplate ? '' : driverName}</span>
                        </div>
                        <div className="line-field">
                          <span className="label">{language === 'english' ? 'Driver Mobile:' : 'Driver Mob / موبائل:'}</span>
                          <span className="value" style={{ fontFamily: 'monospace' }}>{blankTemplate ? '' : driverMobile}</span>
                        </div>
                      </div>
                    </div>

                    {/* Table of items */}
                    <div className="paper-items-table-container">
                      <table className="paper-items-table">
                        <thead>
                          <tr>
                            <th className="cell-qty">
                              {language === 'english' ? 'Qty / Pkgs' : 'Quantity'}
                              {language === 'bilingual' && <span className="urdu-label">تعداد</span>}
                            </th>
                            <th className="cell-desc">
                              {language === 'english' ? 'Description of Consigned Goods' : 'Description of Consigned Goods'}
                              {language === 'bilingual' && <span className="urdu-label">تفصیل مال</span>}
                            </th>
                            <th className="cell-weight">
                              {language === 'english' ? 'Cargo Weight' : 'Weight'}
                              {language === 'bilingual' && <span className="urdu-label">وزن</span>}
                            </th>
                            <th className="cell-rate">
                              {language === 'english' ? 'Freight Rate' : 'Rate'}
                              {language === 'bilingual' && <span className="urdu-label">شرح</span>}
                            </th>
                            <th className="cell-total">
                              {language === 'english' ? 'Total Amount' : 'Total Freight'}
                              {language === 'bilingual' && <span className="urdu-label">کل کرایہ</span>}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {blankTemplate ? (
                            Array.from({ length: 6 }).map((_, i) => (
                              <tr key={i} className="empty-row">
                                <td className="cell-qty"></td>
                                <td className="cell-desc"></td>
                                <td className="cell-weight"></td>
                                <td className="cell-rate"></td>
                                <td className="cell-total"></td>
                              </tr>
                            ))
                          ) : (
                            <>
                              {items.map((item, index) => (
                                <tr key={index}>
                                  <td className="cell-qty" style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.qty}</td>
                                  <td className="cell-desc" style={{ paddingLeft: '15px' }}>{item.desc}</td>
                                  <td className="cell-weight" style={{ textAlign: 'center' }}>{item.weight}</td>
                                  <td className="cell-rate" style={{ textAlign: 'center' }}>{item.rate}</td>
                                  <td className="cell-total" style={{ fontWeight: 'bold', paddingRight: '12px' }}>
                                    Rs. {(parseFloat(item.total) || 0).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                              {items.length < 5 && Array.from({ length: 5 - items.length }).map((_, i) => (
                                <tr key={`pad-${i}`} className="empty-row">
                                  <td className="cell-qty"></td>
                                  <td className="cell-desc"></td>
                                  <td className="cell-weight"></td>
                                  <td className="cell-rate"></td>
                                  <td className="cell-total"></td>
                                </tr>
                              ))}
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Summary Notes and Financial Summary Box */}
                    <div className="summary-section">
                      <div className="summary-notes">
                        {language === 'english' ? (
                          <>
                            <div className="summary-notes-title">Important Cargo Declarations & Rules:</div>
                            <ul>
                              <li>The company is not liable for damage or breakage of sanitary pipes or PVC items.</li>
                              <li>Leakage or wastage of oil, ghee, liquid products, or liquid cargo is the sender's risk.</li>
                              <li>Delivery is strictly subject to the presentation of this original consignment note.</li>
                              <li>Detailed transport terms are listed on the reverse side of this sheet.</li>
                            </ul>
                          </>
                        ) : (
                          <>
                            <div className="summary-notes-title">مختصر انشورنس و ذمہ داری شرائط (Short Terms Summary):</div>
                            <ul style={{ direction: 'rtl', textAlign: 'right' }}>
                              <li>تیل، گھی، شیشہ، پائپ، چینی یا مائع لیک ہونے یا ٹوٹنے کی ذمہ داری کمپنی پر نہ ہو گی۔</li>
                              <li>بغیر بلٹی پیش کیے بیوپاری کو مال کی حوالگی ممکن نہ ہو گی۔</li>
                              <li>بلٹی جاری ہونے کے 15 دن کے اندر مال کی عدم دستیابی پر ہی کلیم رجسٹرڈ ہوگا۔</li>
                              <li>حتمی تفصیلی شرائط بلٹی کی دوسری جانب (Back Page) درج اور نافذ العمل ہیں۔</li>
                            </ul>
                          </>
                        )}
                      </div>

                      <div className="summary-financials">
                        <div className="financial-row">
                          <span className="label">
                            {language === 'english' ? 'Gross Freight:' : 'Total Freight / کل کرایہ:'}
                          </span>
                          <span className="value">
                            {blankTemplate ? 'Rs. ____________' : `Rs. ${totalFreight.toLocaleString()}`}
                          </span>
                        </div>
                        <div className="financial-row">
                          <span className="label">
                            {language === 'english' ? 'Advance Paid:' : 'Advance paid / پیشگی:'}
                          </span>
                          <span className="value">
                            {blankTemplate ? 'Rs. ____________' : `Rs. ${(parseFloat(advancePaid) || 0).toLocaleString()}`}
                          </span>
                        </div>
                        <div className="financial-row">
                          <span className="label">
                            {language === 'english' ? 'Balance Due:' : 'Balance Due / بقایا:'}
                          </span>
                          <span className="value">
                            {blankTemplate ? 'Rs. ____________' : `Rs. ${balanceFreight.toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Signatures Area */}
                    <div className="signatures">
                      <div className="sig-box">
                        <span>Authorized Officer</span>
                        <div className="sig-line">
                          {language === 'english' ? 'For Murree Karwan Goods' : 'دستخط برائے کمپنی'}
                        </div>
                      </div>
                      <div className="sig-box">
                        <span>Sender / Consignor</span>
                        <div className="sig-line">
                          {language === 'english' ? 'Authorized Sign' : 'دستخط مرسل'}
                        </div>
                      </div>
                      <div className="sig-box">
                        <span>Transit Driver</span>
                        <div className="sig-line">
                          {language === 'english' ? 'Signature' : 'دستخط ڈرائیور'}
                        </div>
                      </div>
                      <div className="sig-box">
                        <span>Receiver / Consignee</span>
                        <div className="sig-line">
                          {language === 'english' ? 'Signature' : 'دستخط وصول کنندہ'}
                        </div>
                      </div>
                    </div>

                    {/* Circular Stamp Overlay */}
                    <div className="stamp-overlay">
                      <span style={{ fontSize: '0.6rem' }}>MURREE KARWAN</span>
                      <span style={{ fontSize: '0.72rem', fontShape: '900', margin: '2px 0' }}>DISPATCHED</span>
                      <span style={{ fontSize: '0.6rem' }}>GOODS DEPT.</span>
                    </div>
                  </div>
                )}

                {/* 2. BACK SIDE OF BILITY (TERMS & BRANCHE DIRECTORY) */}
                {(previewTab === 'back' || previewTab === 'both') && (
                  <div className="bility-paper back-layout">
                    {/* Header */}
                    <div className="back-header">
                      {language === 'english' ? (
                        <>
                          <h1 className="back-title">Terms & Conditions of Consignment</h1>
                          <div className="back-subtitle">Murree Karwan Goods Forwarding Agency — Cargo Policy Rules</div>
                        </>
                      ) : (
                        <>
                          <h1 className="back-title">شرائط و ضوابط کارگو ایجنسی</h1>
                          <div className="back-subtitle">Murree Karwan Goods Forwarding Agency — Terms & Branch Network</div>
                        </>
                      )}
                    </div>

                    {/* Terms List */}
                    <div className="back-terms" style={{ direction: language === 'bilingual' ? 'rtl' : 'ltr' }}>
                      <ul className="terms-list">
                        {activeTerms.map((term, index) => (
                          <li key={index} className="term-item">
                            <span className="term-num">{index + 1}.</span>
                            <span className="term-val">
                              {language === 'bilingual' && index === 1 ? (
                                <>
                                  تیل، گھی، مربع جات، اور دیگر رسم یا ضائع (<span className="en-word">Leakage</span>) ہونے کی ایجنسی یا کمپنی ذمہ دار نہ ہو گی۔
                                </>
                              ) : (
                                term
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Branches Network Table */}
                    <div className="directory-section" style={{ direction: language === 'bilingual' ? 'rtl' : 'ltr' }}>
                      <h3 className="directory-title" style={{ fontSize: '0.95rem' }}>
                        {language === 'english' ? (
                          'National Logistics Network & Contact Directory'
                        ) : (
                          <>
                            <span className="urdu">برانچ نیٹ ورک و رابطہ نمبرز</span>
                            <span>— MKG National Cargo Grid —</span>
                          </>
                        )}
                      </h3>
                      
                      <table className="directory-table">
                        <thead>
                          <tr>
                            <th style={{ width: '10%' }}>
                              {language === 'english' ? 'No.' : 'شمار'}
                            </th>
                            <th style={{ width: '50%' }}>
                              {language === 'english' ? 'Branch Office Name (Service Partner)' : 'برانچ کا نام'}
                            </th>
                            <th style={{ width: '40%' }}>
                              {language === 'english' ? 'Contact / Hotline Number' : 'رابطہ نمبر'}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeDirectory.map((dir, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <span className="branch-name-en">{dir.srv}</span>
                              </td>
                              <td>
                                <span className="num-en">{dir.phone}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Footer Info */}
                    <div className="back-footer">
                      <strong>Corporate Office:</strong> Plot No. 3-A, Street 59, Al-Yasir Market, Sector I-10/1, Islamabad | <strong>Hotlines:</strong> 051-4446767, 0321-5436767
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
