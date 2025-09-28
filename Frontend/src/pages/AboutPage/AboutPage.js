import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import OurTeam from '../../components/OurTeam/OurTeam';
import './AboutPage.css';

const AboutPage = () => {
  const aboutRef = useRef(null);
  const isInView = useInView(aboutRef, { once: true, threshold: 0.3 });
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeCard, setActiveCard] = useState(0); // About US (index 0) is open by default
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(trackRef.current.scrollLeft);
    if (trackRef.current) {
      trackRef.current.classList.add('paused');
    }
    e.preventDefault();
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (trackRef.current) {
      trackRef.current.classList.remove('paused');
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (trackRef.current) {
      trackRef.current.classList.remove('paused');
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) * 1.5;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setScrollLeft(trackRef.current.scrollLeft);
    if (trackRef.current) {
      trackRef.current.classList.add('paused');
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.touches[0].pageX;
    const walk = (x - startX) * 1.5;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (trackRef.current) {
      trackRef.current.classList.remove('paused');
    }
  };

  const handleCardClick = (index) => {
    // Accordion behavior: only one card can be open at a time
    setActiveCard(activeCard === index ? -1 : index);
  };


  // Touch device detection
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  // Intersection Observer for timeline steps
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepIndex = parseInt(entry.target.dataset.step);
          setActiveStep(stepIndex);
        }
      });
    }, observerOptions);

    // Observe all step elements
    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      stepRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);


  const getFeatures = () => {
    return [
      {
        id: 1,
        title: "Smart Lead Generation",
        badge: "AI-Powered",
        description: "Discover high-quality leads with our advanced AI algorithms that analyze market data and identify your ideal customers.",
        technology: "Machine Learning & Big Data",
        results: "300% increase in qualified leads",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop&auto=format&q=80"
      },
      {
        id: 2,
        title: "Automated Email Campaigns",
        badge: "Automated",
        description: "Create personalized email sequences that nurture leads through the entire sales funnel with intelligent automation.",
        technology: "AI Content Generation & Automation",
        results: "85% higher open rates and engagement",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=500&fit=crop&auto=format&q=80"
      },
      {
        id: 3,
        title: "Lead Scoring & Analytics",
        badge: "Intelligent",
        description: "Advanced scoring algorithms that prioritize your hottest prospects and predict conversion likelihood.",
        technology: "Predictive Analytics & Machine Learning",
        results: "40% improvement in conversion rates",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=500&fit=crop&auto=format&q=80"
      },
      {
        id: 4,
        title: "CRM Integration",
        badge: "Seamless",
        description: "Connect with your existing CRM systems for unified lead management and streamlined workflows.",
        technology: "API Integration & Data Sync",
        results: "50% reduction in manual data entry",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=500&fit=crop&auto=format&q=80"
      },
      {
        id: 5,
        title: "Performance Tracking",
        badge: "Real-time",
        description: "Comprehensive dashboards and reports that track every aspect of your lead generation performance.",
        technology: "Advanced Analytics & Reporting",
        results: "Complete visibility into ROI and metrics",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=500&fit=crop&auto=format&q=80"
      }
    ];
  };

  const features = getFeatures();
  const currentFeature = features[currentFeatureIndex];

  const handlePreviousFeature = () => {
    setCurrentFeatureIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
  };

  const handleNextFeature = () => {
    setCurrentFeatureIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));
  };



  const getProblems = () => {
    return [
      { 
        id: 1, 
        title: "Lost Leads", 
        description: "Leads slip through the cracks without proper tracking systems.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&auto=format&q=80"
      },
      { 
        id: 2, 
        title: "Poor Follow-up", 
        description: "Inconsistent follow-up processes lead to missed opportunities.",
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop&auto=format&q=80"
      },
      { 
        id: 3, 
        title: "No Analytics", 
        description: "Lack of data insights makes optimization impossible.",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&auto=format&q=80"
      },
      { 
        id: 4, 
        title: "Manual Tracking", 
        description: "Time-consuming manual processes reduce efficiency.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&auto=format&q=80"
      },
      { 
        id: 5, 
        title: "Low Conversion", 
        description: "Poor lead nurturing results in lost revenue.",
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop&auto=format&q=80"
      }
    ];
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <video 
            src="/about video abstract.mp4" 
            alt="Sales Lead Management" 
            className="hero-bg-video"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-title"
          >
            Leads to loyalty
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hero-subtitle"
          >
            Discover your ideal leads, transform them into customers, and accelerate your growth.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glow-on-hover"
          >
            Get In Touch
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </motion.button>
        </div>
      </section>


      {/* New About Section with Cards */}
      <section className="new-about-section">
        <div className="new-about-container">
          <div className="new-about-content">
            {/* Left Side - Heading and Arrow */}
            <div className="new-about-left">
              <h2 className="new-about-title">
                Lead Management
                <br />
                Made Simple
                <br />
                & Effective
              </h2>
            </div>

            {/* Right Side - Interactive Cards */}
            <div className="new-about-right">
              <div className="interactive-cards">
                {/* Card 01 - About US */}
                <div className={`interactive-card ${activeCard === 0 ? 'active' : ''}`} onClick={() => handleCardClick(0)}>
                  <div className="card-number">01</div>
                  <div className="card-content">
                    <h3 className="card-title">About US</h3>
                    {activeCard === 0 && (
                      <p className="card-description">
                        At Evecta, we believe growth begins with meaningful connections. Our platform empowers businesses to engage their best-fit customers through intelligent lead generation and outreach.
                        <br/><br/>
                        We are more than a tool; Evecta is your growth partner!
                      </p>
                    )}
                  </div>
                  <div className="card-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={activeCard === 0 ? "M7 14L12 9L17 14" : "M7 10L12 15L17 10"}/>
                    </svg>
                  </div>
                </div>

                {/* Card 02 - Our Mission */}
                <div className={`interactive-card ${activeCard === 1 ? 'active' : ''}`} onClick={() => handleCardClick(1)}>
                  <div className="card-number">02</div>
                  <div className="card-content">
                    <h3 className="card-title">Our Mission</h3>
                    {activeCard === 1 && (
                      <p className="card-description">
                        To transform customer conversion with advanced AI and technology by delivering the right leads, intelligent emails, and seamless outreach in a compliant, all-in-one platform.
                      </p>
                    )}
                  </div>
                  <div className="card-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={activeCard === 1 ? "M7 14L12 9L17 14" : "M7 10L12 15L17 10"}/>
                    </svg>
                  </div>
                </div>

                {/* Card 03 - Our Vision */}
                <div className={`interactive-card ${activeCard === 2 ? 'active' : ''}`} onClick={() => handleCardClick(2)}>
                  <div className="card-number">03</div>
                  <div className="card-content">
                    <h3 className="card-title">Our Vision</h3>
                    {activeCard === 2 && (
                      <p className="card-description">
                        To redefine business connections through the most trusted AI-driven platform, enabling seamless, ethical, and accessible lead generation and outreach for teams everywhere.
                      </p>
                    )}
                  </div>
                  <div className="card-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d={activeCard === 2 ? "M7 14L12 9L17 14" : "M7 10L12 15L17 10"}/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flip Card Features Section */}
      <section id="feature" className="flip-cards-section">
        <div className="flip-cards-header">
          <h2 className="flip-cards-title">Features</h2>
          <p className="flip-cards-subtitle">Discover our powerful lead management capabilities</p>
        </div>
        <div className="flip-cards-container">
          {/* Flip Card 1 */}
          <div className="flip-card-container" style={{"--hue": 220}}>
            <div className="flip-card">
              <div className="card-front">
                <figure>
                  <div className="img-bg"></div>
                  <img src="/features 1.jpg" alt="AI-Powered Lead Discovery" />
                  <figcaption>AI-Powered Lead Discovery</figcaption>
                </figure>
              </div>

              <div className="card-back">
                <figure>
                  <div className="img-bg"></div>
                  <img src="/features 1.jpg" alt="AI-Powered Lead Discovery" />
                </figure>
                <ul>
                  <li>Instantly find the right prospects with AI-driven search</li>
                  <li>Filter by industry or location</li>
                  <li>Save hours of manual research</li>
                  <li>Advanced targeting algorithms</li>
                  <li>Real-time data analysis</li>
                </ul>
                <button>Get Started</button>
                <div className="design-container">
                  <span className="design design--1"></span>
                  <span className="design design--2"></span>
                  <span className="design design--3"></span>
                  <span className="design design--4"></span>
                  <span className="design design--5"></span>
                  <span className="design design--6"></span>
                  <span className="design design--7"></span>
                  <span className="design design--8"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Flip Card 2 */}
          <div className="flip-card-container" style={{"--hue": 170}}>
            <div className="flip-card">
              <div className="card-front">
                <figure>
                  <div className="img-bg"></div>
                  <img src="/features 2.jpg" alt="Smart Outreach Automation" />
                  <figcaption>Smart Outreach Automation</figcaption>
                </figure>
              </div>

              <div className="card-back">
                <figure>
                  <div className="img-bg"></div>
                  <img src="/features 2.jpg" alt="Smart Outreach Automation" />
                </figure>
                <ul>
                  <li>Send personalized emails at scale</li>
                  <li>Automated follow-ups</li>
                  <li>AI-crafted messages that connect</li>
                  <li>Boost conversions</li>
                  <li>Smart sequence optimization</li>
                </ul>
                <button>Learn More</button>
                <div className="design-container">
                  <span className="design design--1"></span>
                  <span className="design design--2"></span>
                  <span className="design design--3"></span>
                  <span className="design design--4"></span>
                  <span className="design design--5"></span>
                  <span className="design design--6"></span>
                  <span className="design design--7"></span>
                  <span className="design design--8"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Flip Card 3 */}
          <div className="flip-card-container" style={{"--hue": 350}}>
            <div className="flip-card">
              <div className="card-front">
                <figure>
                  <div className="img-bg"></div>
                  <img src="/features 3.jpg" alt="Global Compliance Standards" />
                  <figcaption>Global Compliance Standards</figcaption>
                </figure>
              </div>

              <div className="card-back">
                <figure>
                  <div className="img-bg"></div>
                  <img src="/features 3.jpg" alt="Global Compliance Standards" />
                </figure>
                <ul>
                  <li>Built-in GDPR compliance</li>
                  <li>CCPA protection standards</li>
                  <li>Global data protection</li>
                  <li>Safe and compliant outreach</li>
                  <li>Automated compliance checks</li>
                </ul>
                <button>View Demo</button>
                <div className="design-container">
                  <span className="design design--1"></span>
                  <span className="design design--2"></span>
                  <span className="design design--3"></span>
                  <span className="design design--4"></span>
                  <span className="design design--5"></span>
                  <span className="design design--6"></span>
                  <span className="design design--7"></span>
                  <span className="design design--8"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Flip Card 4 */}
          <div className="flip-card-container" style={{"--hue": 60}}>
            <div className="flip-card">
              <div className="card-front">
                <figure>
                  <div className="img-bg"></div>
                  <img src="/features 4.jpg" alt="Performance Insights & Analytics" />
                  <figcaption>Performance Insights & Analytics</figcaption>
                </figure>
              </div>

              <div className="card-back">
                <figure>
                  <div className="img-bg"></div>
                  <img src="/features 4.jpg" alt="Performance Insights & Analytics" />
                </figure>
                <ul>
                  <li>Track opens, replies, and conversions in real time</li>
                  <li>Clear dashboards and insights</li>
                  <li>Optimize campaigns for better results</li>
                  <li>Advanced performance metrics</li>
                  <li>Data-driven decision making</li>
                </ul>
                <button>Learn More</button>
                <div className="design-container">
                  <span className="design design--1"></span>
                  <span className="design design--2"></span>
                  <span className="design design--3"></span>
                  <span className="design design--4"></span>
                  <span className="design design--5"></span>
                  <span className="design design--6"></span>
                  <span className="design design--7"></span>
                  <span className="design design--8"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <h1 className="how-it-works-title">How it works</h1>
          <h2 className="how-it-works-headline">From Frustration to Discovery</h2>
          
          <div className="timeline-container" data-active-step={activeStep}>
            {/* Line Segments */}
            <div className="timeline-segment timeline-segment-1"></div>
            <div className="timeline-segment timeline-segment-2"></div>
            <div className="timeline-segment timeline-segment-3"></div>
            
            {/* Step 1 - Right Side */}
            <div 
              className="timeline-step step-right"
              ref={(el) => (stepRefs.current[0] = el)}
              data-step="1"
            >
              <div className="step-content">
                <div className="step-number">1</div>
                <div className="step-details">
                  <h3 className="step-title">Start Smarter Conversations</h3>
                  <p className="step-description">
                    Skip clunky forms. Simply chat your ideal company profile – sector, size, location – like briefing an expert.
                  </p>
                  <div className="step-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 - Left Side */}
            <div 
              className="timeline-step step-left"
              ref={(el) => (stepRefs.current[1] = el)}
              data-step="2"
            >
              <div className="step-content">
                <div className="step-number">2</div>
                <div className="step-details">
                  <h3 className="step-title">AI Finds the Hidden Gems</h3>
                  <p className="step-description">
                    No more sifting. AI scans vast data, pinpointing companies that perfectly fit. Precision research at lightning speed.
                  </p>
                  <div className="step-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - Right Side */}
            <div 
              className="timeline-step step-right"
              ref={(el) => (stepRefs.current[2] = el)}
              data-step="3"
            >
              <div className="step-content">
                <div className="step-number">3</div>
                <div className="step-details">
                  <h3 className="step-title">Actionable Insights, Immediate Impact</h3>
                  <p className="step-description">
                    Get curated lists with vital intelligence to understand, qualify, and connect. Move from discovery to meaningful engagement, faster.
                  </p>
                  <div className="step-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <OurTeam />

      {/* Ready for the Ascent Section */}
      <section className="ready-ascent-section">
        <div className="ready-ascent-container">
          <div className="ready-ascent-content">
            <h2 className="ready-ascent-title">Ready for the Ascent?</h2>
            <h3 className="ready-ascent-headline">Your next chapter of Growth awaits</h3>
            <p className="ready-ascent-description">
              Stop leaving opportunities unexplored. Start a journey of precise lead discovery today.
            </p>
            <button className="ready-ascent-cta">
              Explore Leads Now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};


export default AboutPage;
