import React, { useState, useEffect } from 'react';

// Configuration constants
const WHATSAPP_PHONE = '923330103759'; // Official WhatsApp number
const WHATSAPP_MESSAGE = encodeURIComponent("Hello Murree Karwan Goods! I would like to get a quote for goods transportation/relocation.");
const BUSINESS_HOURS = "Monday - Saturday: 8:00 AM - 8:00 PM (Sunday Closed)";
const BUSINESS_ADDRESS = "House No. 45, Main Yamaha Chowk, Industrial Triangle, Kahuta Road, Islamabad, Pakistan";
const GOOGLE_MAPS_IFRAME = "https://maps.google.com/maps?q=Yamaha%20Chowk,%20Kahuta%20Road,%20Islamabad&t=&z=15&ie=UTF8&iwloc=&output=embed";

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    service_needed: 'Cargo Consolidation & Warehousing',
    pickup_location: '',
    destination: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  // Track scroll position for header blur styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Form Submission
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: false, error: null });

    try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormStatus({ submitting: false, success: true, error: null });
        // Reset form except service choice
        setFormData({
          name: '',
          phone_number: '',
          service_needed: formData.service_needed,
          pickup_location: '',
          destination: '',
          message: ''
        });
      } else {
        setFormStatus({
          submitting: false,
          success: false,
          error: data.error || 'Failed to submit quote request. Please try again.'
        });
      }
    } catch (err) {
      setFormStatus({
        submitting: false,
        success: false,
        error: 'Unable to connect to the server. Please check your internet connection and try again.'
      });
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-wrapper">
      {/* Sticky Header */}
      <header className={scrolled ? 'header-scrolled' : ''}>
        <div className="nav-container">
          <div className="logo" onClick={() => navigateTo('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="logo-icon">🚚</span>
            <div className="logo-text">
              <span className="logo-title">Murree Karwan</span>
              <span className="logo-subtitle">Goods Forwarding</span>
            </div>
          </div>
          
          <button className="nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <li>
              <a 
                href="#home" 
                className={currentPage === 'home' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={currentPage === 'about' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); navigateTo('about'); }}
              >
                About Us
              </a>
            </li>
            <li>
              <a 
                href="#services" 
                className={currentPage === 'services' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); navigateTo('services'); }}
              >
                Services
              </a>
            </li>
            <li>
              <a 
                href="#gallery" 
                className={currentPage === 'gallery' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); navigateTo('gallery'); }}
              >
                Gallery
              </a>
            </li>
            <li>
              <button className="btn btn-secondary" onClick={() => navigateTo('contact')}>
                Get a Quote
              </button>
            </li>
          </ul>
        </div>
      </header>

      {/* Dynamic Main Body Content */}
      <main>
        {currentPage === 'home' && (
          <div className="page-home fade-in">
            {/* Hero Section */}
            <section className="hero">
              <div className="hero-container">
                <div className="hero-content">
                  <span className="badge">Logistics Partner</span>
                  <h1 className="hero-title">
                    From a Single Carton to a <span>Full Truckload</span> — We Handle It All
                  </h1>
                  <p className="hero-subtitle">
                    Reliable goods forwarding, warehousing, and relocation services you can trust. Based in Pakistan.
                  </p>
                  <div className="hero-actions">
                    <button className="btn btn-primary" onClick={() => navigateTo('contact')}>
                      Get a Free Quote
                    </button>
                    <a 
                      className="btn btn-whatsapp" 
                      href={`https://wa.me/${WHATSAPP_PHONE}?text=${WHATSAPP_MESSAGE}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      💬 WhatsApp Operators
                    </a>
                  </div>
                </div>
                <div className="hero-graphic">
                  <div className="graphic-container">
                    <span className="graphic-icon">🚛</span>
                    <h3 style={{ marginBottom: '0.5rem' }}>Fast & Secure Dispatch</h3>
                    <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '1rem' }}>
                      Reliable distribution hubs operating throughout all provinces in Pakistan.
                    </p>
                    <span className="graphic-badge">Active Fleet Protection</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Services Overview Section */}
            <section className="section section-bg-alt">
              <div className="section-container">
                <div className="section-header">
                  <span className="badge">What We Do</span>
                  <h2 className="section-title">Our Logistics Solutions</h2>
                  <p className="section-subtitle">
                    Tailored freight and relocation options to serve business operations and families.
                  </p>
                </div>
                <div className="services-grid">
                  <div className="service-card">
                    <div className="service-card-icon">🏬</div>
                    <h3 className="service-card-title">Cargo & Warehousing</h3>
                    <p className="service-card-desc">
                      Collecting goods from multiple factories, storing safely in our warehouses, and dispatching in optimized full truckloads.
                    </p>
                    <a href="#services" onClick={(e) => { e.preventDefault(); navigateTo('services'); }} style={{ color: 'var(--color-gold-accent)', fontSize: '0.9rem', marginTop: '1.5rem', fontWeight: 600 }}>
                      Learn More →
                    </a>
                  </div>

                  <div className="service-card">
                    <div className="service-card-icon">📦</div>
                    <h3 className="service-card-title">Whole Truck Booking</h3>
                    <p className="service-card-desc">
                      Direct full-truck booking tailored for high-volume factories and merchants. Dedicated fleet with zero shared cargo loading.
                    </p>
                    <a href="#services" onClick={(e) => { e.preventDefault(); navigateTo('services'); }} style={{ color: 'var(--color-gold-accent)', fontSize: '0.9rem', marginTop: '1.5rem', fontWeight: 600 }}>
                      Learn More →
                    </a>
                  </div>

                  <div className="service-card">
                    <div className="service-card-icon">🏠</div>
                    <h3 className="service-card-title">House & Office Relocation</h3>
                    <p className="service-card-desc">
                      Full-service packing, loading, unpacking, and unloading. Stress-free residential and corporate relocation support.
                    </p>
                    <a href="#services" onClick={(e) => { e.preventDefault(); navigateTo('services'); }} style={{ color: 'var(--color-gold-accent)', fontSize: '0.9rem', marginTop: '1.5rem', fontWeight: 600 }}>
                      Learn More →
                    </a>
                  </div>

                  <div className="service-card">
                    <div className="service-card-icon">🏗️</div>
                    <h3 className="service-card-title">Factory Goods Transport</h3>
                    <p className="service-card-desc">
                      Safe, secure, and highly timely delivery of sensitive industrial cargo, bulk raw materials, and heavy machinery parts.
                    </p>
                    <a href="#services" onClick={(e) => { e.preventDefault(); navigateTo('services'); }} style={{ color: 'var(--color-gold-accent)', fontSize: '0.9rem', marginTop: '1.5rem', fontWeight: 600 }}>
                      Learn More →
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Why Choose Us */}
            <section className="section">
              <div className="section-container why-choose-us-grid">
                <div>
                  <span className="badge">Why Us</span>
                  <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                    Trusted Logistics & Freight Specialists
                  </h2>
                  <p style={{ color: 'var(--color-muted-grey-blue)', marginBottom: '2rem' }}>
                    Murree Karwan Goods Forwarding Agency provides complete supply chain support. We utilize an expansive operations grid, state-of-the-art storage depots, and reliable vehicle sizes to guarantee safety.
                  </p>
                  <button className="btn btn-primary" onClick={() => navigateTo('about')}>
                    Our Capabilities
                  </button>
                </div>
                <div className="why-features">
                  <div className="why-feature-card">
                    <div className="why-feature-icon">🛡️</div>
                    <h4 className="why-feature-title">Safe Cargo Handling</h4>
                    <p className="why-feature-desc">Packed and stacked with caution by experienced industrial loaders.</p>
                  </div>
                  <div className="why-feature-card">
                    <div className="why-feature-icon">⏱️</div>
                    <h4 className="why-feature-title">On-Time Dispatch</h4>
                    <p className="why-feature-desc">Consistent transit patterns and routes ensure your materials arrive on schedule.</p>
                  </div>
                  <div className="why-feature-card">
                    <div className="why-feature-icon">🚛</div>
                    <h4 className="why-feature-title">Flexible Fleet</h4>
                    <p className="why-feature-desc">Shahzore, large containers, and Mazda trucks ready for any payload size.</p>
                  </div>
                  <div className="why-feature-card">
                    <div className="why-feature-icon">💼</div>
                    <h4 className="why-feature-title">Competitive Rates</h4>
                    <p className="why-feature-desc">Affordable consolidated rates or full truck charters matching your budget.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials Banner Placeholder */}
            <section className="section section-bg-alt" style={{ textAlign: 'center' }}>
              <div className="section-container" style={{ maxWidth: '800px' }}>
                <span className="badge">Testimonials</span>
                <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>What Our Clients Say</h2>
                <div className="testimonial-slider" style={{ padding: '2rem', background: 'var(--color-navy-card)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                  <p style={{ fontStyle: 'italic', fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--color-cream-text)' }}>
                    "Murree Karwan Agency has transformed our distribution workflow. Their warehousing operations and prompt dispatching of full containers have minimized factory dispatch backlogs. Highly recommended!"
                  </p>
                  <h4 style={{ color: 'var(--color-gold-accent)' }}>- Industrial Manager, Sector I-9 Industrial Zone</h4>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="section" style={{ textAlign: 'center', background: 'linear-gradient(rgba(14,32,56,0.9), rgba(14,32,56,0.95))' }}>
              <div className="section-container" style={{ maxWidth: '700px' }}>
                <h2>Ready to Move Your Goods?</h2>
                <p style={{ color: 'var(--color-muted-grey-blue)', margin: '1.5rem 0 2.5rem 0' }}>
                  Request a quick pricing estimate or reach out directly to check vehicle availability.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={() => navigateTo('contact')}>
                    Request Quotation
                  </button>
                  <a 
                    className="btn btn-whatsapp" 
                    href={`https://wa.me/${WHATSAPP_PHONE}?text=${WHATSAPP_MESSAGE}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    💬 Direct WhatsApp
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentPage === 'about' && (
          <div className="page-about fade-in section">
            <div className="section-container">
              <div className="section-header">
                <span className="badge">Who We Are</span>
                <h2 className="section-title">About Our Agency</h2>
                <p className="section-subtitle">Your Goods, Our Responsibility</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', marginBottom: '5rem', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: 'var(--color-gold-accent)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>Our History & Mission</h3>
                  <p style={{ color: 'var(--color-muted-grey-blue)', marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: '1.7' }}>
                    Murree Karwan Goods Forwarding Agency is a trusted name in goods transport, warehousing, and freight forwarding. We collect goods from factories, store them safely in our own warehouse, and dispatch full truckloads for cost-effective delivery — alongside whole truck booking and complete house/office relocation services.
                  </p>
                  <p style={{ color: 'var(--color-muted-grey-blue)', fontSize: '1.05rem', lineHeight: '1.7' }}>
                    We aim to facilitate seamless transport logistics across Pakistan by bridging factory dispatch zones with major shipping terminals and distributors. By focusing on container security, transparent scheduling, and client support, we take the stress out of commercial shipping and relocation.
                  </p>
                </div>
                <div className="detailed-service-graphic">🏢</div>
              </div>

              {/* Warehouse & Fleet Capability Overview */}
              <div className="section-bg-alt" style={{ padding: '3rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-gold-accent)' }}>Warehouse & Fleet Capabilities</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                  <div style={{ background: 'rgba(14, 32, 56, 0.5)', padding: '1.5rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏬</div>
                    <h4>10,000+ sq. ft.</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-grey-blue)', marginTop: '0.25rem' }}>Secure Storage capacity for raw goods & finished stock.</p>
                  </div>
                  <div style={{ background: 'rgba(14, 32, 56, 0.5)', padding: '1.5rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚛</div>
                    <h4>Flexible Fleet</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-grey-blue)', marginTop: '0.25rem' }}>Shahzore loaders, Mazda trucks, and heavy container transport.</p>
                  </div>
                  <div style={{ background: 'rgba(14, 32, 56, 0.5)', padding: '1.5rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🇵🇰</div>
                    <h4>All Pakistan</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-grey-blue)', marginTop: '0.25rem' }}>Delivering to all industrial hubs in Punjab, Sindh, KPK, & Balochistan.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'services' && (
          <div className="page-services fade-in section">
            <div className="section-container">
              <div className="section-header">
                <span className="badge">Detailed Solutions</span>
                <h2 className="section-title">Our Specialized Logistics Services</h2>
                <p className="section-subtitle">A closer look at how we collect, store, and deliver your assets safely.</p>
              </div>

              <div className="services-detailed-list">
                {/* 1. Cargo Consolidation & Warehousing */}
                <div className="detailed-service-item">
                  <div className="detailed-service-content">
                    <h3 className="detailed-service-title">1. Cargo Consolidation & Warehousing</h3>
                    <p className="detailed-service-desc">
                      Ideal for businesses needing logistics without requesting individual, high-cost trucks. We gather shipments from various factories in the region, keep them cataloged and secure in our Islamabad terminal, and organize consolidated dispatch batches.
                    </p>
                    <div className="detailed-service-process">
                      <h4>Operational Workflow:</h4>
                      <div className="process-steps-container">
                        <div className="process-step">
                          <span className="process-step-num">Step 1</span>
                          <span>Contact</span>
                        </div>
                        <div className="process-step">
                          <span className="process-step-num">Step 2</span>
                          <span>Collect</span>
                        </div>
                        <div className="process-step">
                          <span className="process-step-num">Step 3</span>
                          <span>Store</span>
                        </div>
                        <div className="process-step">
                          <span className="process-step-num">Step 4</span>
                          <span>Load</span>
                        </div>
                        <div className="process-step">
                          <span className="process-step-num">Step 5</span>
                          <span>Dispatch</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="detailed-service-graphic">🏬</div>
                </div>

                {/* 2. Whole Truck Booking */}
                <div className="detailed-service-item">
                  <div className="detailed-service-content">
                    <h3 className="detailed-service-title">2. Whole Truck Booking</h3>
                    <p className="detailed-service-desc">
                      Dedicated charter booking for factories that require exclusive cargo transport. There is no mixing of cargo or midway drop-offs. The truck moves straight from the loading dock directly to the destination portal.
                    </p>
                    <div className="detailed-service-process">
                      <h4>Operational Workflow:</h4>
                      <div className="process-steps-container">
                        <div className="process-step">
                          <span className="process-step-num">Step 1</span>
                          <span>Schedule</span>
                        </div>
                        <div className="process-step">
                          <span className="process-step-num">Step 2</span>
                          <span>Dispatch Truck</span>
                        </div>
                        <div className="process-step">
                          <span className="process-step-num">Step 3</span>
                          <span>Full Loading</span>
                        </div>
                        <div className="process-step">
                          <span className="process-step-num">Step 4</span>
                          <span>Lock / Seal</span>
                        </div>
                        <div className="process-step">
                          <span className="process-step-num">Step 5</span>
                          <span>Delivery</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="detailed-service-graphic">🚛</div>
                </div>

                {/* 3. House & Office Relocation */}
                <div className="detailed-service-item">
                  <div className="detailed-service-content">
                    <h3 className="detailed-service-title">3. House & Office Relocation</h3>
                    <p className="detailed-service-desc">
                      Full-service relocation to move offices and residences. We handle the heavy lifting, packing, loading, transportation, and unloading. We utilize secure wraps for machinery, delicate office servers, and home furniture.
                    </p>
                    <div className="detailed-service-process">
                      <h4>Operational Workflow:</h4>
                      <div className="process-steps-container">
                        <div className="process-step">
                          <span className="process-step-num">Step 1</span>
                          <span>Survey</span>
                        </div>
                        <div className="process-step">
                          <span className="process-step-num">Step 2</span>
                          <span>Pack</span>
                        </div>
                        <div className="process-step">
                          <span className="process-step-num">Step 3</span>
                          <span>Secure Loading</span>
                        </div>
                        <div className="process-step">
                          <span className="process-step-num">Step 4</span>
                          <span>Transit</span>
                        </div>
                        <div className="process-step">
                          <span className="process-step-num">Step 5</span>
                          <span>Unpack</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="detailed-service-graphic">📦</div>
                </div>

                {/* 4. Factory Goods Transport */}
                <div className="detailed-service-item">
                  <div className="detailed-service-content">
                    <h3 className="detailed-service-title">4. Factory Goods Transport</h3>
                    <p className="detailed-service-desc">
                      Logistics for manufacturing nodes. We transport chemical containers, industrial raw packaging, spare parts, and textiles. Our fleet driver schedules are strictly monitored to avoid assembly line disruptions.
                    </p>
                    <div className="detailed-service-process">
                      <h4>Operational Workflow:</h4>
                      <div className="process-steps-container">
                        <div className="process-step">
                          <span className="process-step-num">Step 1</span>
                          <span>Verify Manifest</span>
                        </div>
                        <div className="process-step">
                          <span className="process-step-num">Step 2</span>
                          <span>Weight Check</span>
                        </div>
                        <div className="process-step">
                          <span className="process-step-num">Step 3</span>
                          <span>Secure Straps</span>
                        </div>
                        <div className="process-step">
                          <span className="process-step-num">Step 4</span>
                          <span>High-speed Transit</span>
                        </div>
                        <div className="process-step">
                          <span className="process-step-num">Step 5</span>
                          <span>Offload</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="detailed-service-graphic">🏗️</div>
                </div>
              </div>

              {/* Fleet Showcase subsection */}
              <div style={{ marginTop: '6rem' }}>
                <h3 style={{ textTransform: 'uppercase', color: 'var(--color-gold-accent)', fontSize: '1.25rem', letterSpacing: '0.1em', textAlign: 'center', marginBottom: '3rem' }}>
                  Our Diverse Fleet Selection
                </h3>
                <div className="fleet-grid">
                  <div className="fleet-card">
                    <div className="fleet-image-placeholder">🛻</div>
                    <div className="fleet-info">
                      <h4 className="fleet-title">Shahzore</h4>
                      <p className="fleet-desc">Perfect size for city streets, house moves, and small commercial consignments. Dynamic cargo space.</p>
                    </div>
                  </div>
                  <div className="fleet-card">
                    <div className="fleet-image-placeholder">🚚</div>
                    <div className="fleet-info">
                      <h4 className="fleet-title">Mazda Trucks</h4>
                      <p className="fleet-desc">Mid-tier payload capacity. Built to carry industrial supplies and office relocation materials across provinces.</p>
                    </div>
                  </div>
                  <div className="fleet-card">
                    <div className="fleet-image-placeholder">🚛</div>
                    <div className="fleet-info">
                      <h4 className="fleet-title">Heavy Containers</h4>
                      <p className="fleet-desc">Designed for heavy factory machinery transport and full commercial cargo loads. Available in 20ft and 40ft options.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'gallery' && (
          <div className="page-gallery fade-in section">
            <div className="section-container">
              <div className="section-header">
                <span className="badge">Visuals</span>
                <h2 className="section-title">Gallery & Works Showcase</h2>
                <p className="section-subtitle">Real-life shots and conceptual highlights of our operations, loading yards, and fleet.</p>
              </div>

              <div className="gallery-grid">
                <div className="gallery-card">
                  <div className="gallery-card-placeholder">🏬</div>
                  <div className="gallery-card-info">
                    <h4 className="gallery-card-title">Main Storage Depot</h4>
                    <span className="gallery-card-tag">Warehousing</span>
                  </div>
                </div>
                <div className="gallery-card">
                  <div className="gallery-card-placeholder">📦</div>
                  <div className="gallery-card-info">
                    <h4 className="gallery-card-title">Relocation packing yard</h4>
                    <span className="gallery-card-tag">Relocation</span>
                  </div>
                </div>
                <div className="gallery-card">
                  <div className="gallery-card-placeholder">🚛</div>
                  <div className="gallery-card-info">
                    <h4 className="gallery-card-title">Mazda Truck Fleet</h4>
                    <span className="gallery-card-tag">Fleet</span>
                  </div>
                </div>
                <div className="gallery-card">
                  <div className="gallery-card-placeholder">👷</div>
                  <div className="gallery-card-info">
                    <h4 className="gallery-card-title">Professional Loading Crew</h4>
                    <span className="gallery-card-tag">Operations</span>
                  </div>
                </div>
                <div className="gallery-card">
                  <div className="gallery-card-placeholder">🗺️</div>
                  <div className="gallery-card-info">
                    <h4 className="gallery-card-title">Inter-City Transport Route</h4>
                    <span className="gallery-card-tag">Transit</span>
                  </div>
                </div>
                <div className="gallery-card">
                  <div className="gallery-card-placeholder">🏭</div>
                  <div className="gallery-card-info">
                    <h4 className="gallery-card-title">Industrial Factory Loading</h4>
                    <span className="gallery-card-tag">Factory Cargo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'contact' && (
          <div className="page-contact fade-in section">
            <div className="section-container">
              <div className="section-header">
                <span className="badge">Contact Us</span>
                <h2 className="section-title">Get in Touch / Request a Quote</h2>
                <p className="section-subtitle">Provide details about your cargo volume or relocation timeline below.</p>
              </div>

              <div className="contact-section-layout">
                {/* Contact Form */}
                <div className="contact-form-card">
                  <h3 style={{ marginBottom: '1.5rem' }}>Send a Quote Request</h3>
                  
                  {formStatus.success && (
                    <div className="form-status form-status-success">
                      ✓ {formStatus.error || 'Your quote request has been submitted successfully! We will contact you shortly.'}
                    </div>
                  )}

                  {formStatus.error && !formStatus.success && (
                    <div className="form-status form-status-error">
                      ✗ {formStatus.error}
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input 
                          type="text" 
                          name="name" 
                          className="form-input" 
                          required 
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number (WhatsApp) *</label>
                        <input 
                          type="tel" 
                          name="phone_number" 
                          className="form-input" 
                          placeholder="e.g. 03001234567"
                          required 
                          value={formData.phone_number}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Service Needed *</label>
                      <select 
                        name="service_needed" 
                        className="form-input" 
                        required 
                        value={formData.service_needed}
                        onChange={handleInputChange}
                        style={{ background: 'var(--color-navy-light)' }}
                      >
                        <option>Cargo Consolidation & Warehousing</option>
                        <option>Whole Truck Booking</option>
                        <option>House & Office Relocation</option>
                        <option>Factory Goods Transport</option>
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Pickup City/Area *</label>
                        <input 
                          type="text" 
                          name="pickup_location" 
                          className="form-input" 
                          placeholder="e.g. Islamabad I-9"
                          required 
                          value={formData.pickup_location}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Destination City/Area *</label>
                        <input 
                          type="text" 
                          name="destination" 
                          className="form-input" 
                          placeholder="e.g. Lahore Thokar Niaz Baig"
                          required 
                          value={formData.destination}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Cargo Details / Message</label>
                      <textarea 
                        name="message" 
                        rows="4" 
                        className="form-input" 
                        placeholder="e.g. Weight, type of goods, number of cartons, special handling instructions..."
                        value={formData.message}
                        onChange={handleInputChange}
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ width: '100%', padding: '1rem' }}
                      disabled={formStatus.submitting}
                    >
                      {formStatus.submitting ? 'Submitting request...' : 'Submit Quotation Request'}
                    </button>
                  </form>
                </div>

                {/* Contact Information & Map */}
                <div className="contact-details">
                  <div className="contact-detail-item" onClick={() => window.open('https://share.google/ks7aBcdwMHvpDpGjY', '_blank')} style={{ cursor: 'pointer' }}>
                    <span className="contact-detail-icon">📍</span>
                    <div className="contact-detail-content">
                      <h4>Office Address</h4>
                      <p>{BUSINESS_ADDRESS}</p>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-gold-accent)', textDecoration: 'underline' }}>View on Google Maps</span>
                    </div>
                  </div>

                  <div className="contact-detail-item">
                    <span className="contact-detail-icon">📞</span>
                    <div className="contact-detail-content">
                      <h4>Call / Whatsapp</h4>
                      <p>+92 333 0103759</p>
                    </div>
                  </div>

                  <div className="contact-detail-item">
                    <span className="contact-detail-icon">🕒</span>
                    <div className="contact-detail-content">
                      <h4>Business Hours</h4>
                      <p>{BUSINESS_HOURS}</p>
                    </div>
                  </div>

                  <div className="map-container">
                    <iframe 
                      title="Murree Karwan Depot Map Location"
                      src={GOOGLE_MAPS_IFRAME} 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>Instant Support</h4>
                    <p style={{ color: 'var(--color-muted-grey-blue)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      Skip the form and chat with a representative directly via WhatsApp:
                    </p>
                    <a 
                      className="btn btn-whatsapp" 
                      href={`https://wa.me/${WHATSAPP_PHONE}?text=${WHATSAPP_MESSAGE}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ width: '100%' }}
                    >
                      💬 Message on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer>
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="logo-icon">🚚</span>
              <div className="logo-text">
                <span className="logo-title" style={{ fontSize: '1.25rem' }}>Murree Karwan</span>
                <span className="logo-subtitle">Goods Forwarding</span>
              </div>
            </div>
            <p className="footer-desc">
              Your Goods, Our Responsibility. Reliable cargo consolidation, whole truck charter booking, and office/house moving solutions in Pakistan.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/share/1CzSfiD4ek/" className="social-icon" target="_blank" rel="noreferrer" title="Facebook Page">F</a>
              <a href="https://www.instagram.com/murreekarwan?igsh=OHRwcHQyMWN3eWlk" className="social-icon" target="_blank" rel="noreferrer" title="Instagram Page">I</a>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>About Us</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); navigateTo('services'); }}>Services</a></li>
              <li><a href="#gallery" onClick={(e) => { e.preventDefault(); navigateTo('gallery'); }}>Gallery</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Our Services</h4>
            <ul className="footer-links">
              <li><a href="#services" onClick={(e) => { e.preventDefault(); navigateTo('services'); }}>Consolidation</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); navigateTo('services'); }}>Truck Charter</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); navigateTo('services'); }}>Relocation</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); navigateTo('services'); }}>Factory Cargo</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Get a Quote</a></li>
              <li><a href={`https://wa.me/${WHATSAPP_PHONE}?text=${WHATSAPP_MESSAGE}`} target="_blank" rel="noreferrer">WhatsApp Chat</a></li>
              <li style={{ fontSize: '0.8rem', color: 'var(--color-muted-grey-blue)', marginTop: '0.5rem' }}>📞 +92 333 0103759</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Murree Karwan Goods Forwarding Agency. All Rights Reserved.</p>
          <p>Tagline: "Your Goods, Our Responsibility"</p>
        </div>
      </footer>

      {/* Floating WhatsApp Widget */}
      <a 
        className="floating-whatsapp" 
        href={`https://wa.me/${WHATSAPP_PHONE}?text=${WHATSAPP_MESSAGE}`} 
        target="_blank" 
        rel="noopener noreferrer"
        title="Chat with Murree Karwan Operators"
      >
        💬
      </a>
    </div>
  );
}
