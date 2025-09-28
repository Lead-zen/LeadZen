import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogData } from '../../data/blogData';
import './BlogPost.css';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const [tocItems, setTocItems] = useState([]);
  const [showToc, setShowToc] = useState(true);
  const sectionRefs = useRef({});

  // Blog data is now imported from shared data file

  useEffect(() => {
    // Simulate API call
    const findBlog = () => {
      const foundBlog = blogData.find(b => b.id === id);
      if (foundBlog) {
        setBlog(foundBlog);
        generateToc(foundBlog);
      }
      setIsLoading(false);
    };

    // Add a small delay to simulate loading
    setTimeout(findBlog, 500);
  }, [id]);

  const generateToc = (blogData) => {
    const toc = [];
    
    // Add introduction
    if (blogData.content.introduction) {
      toc.push({
        id: 'introduction',
        title: 'Introduction',
        level: 1
      });
    }

    // Add sections and subsections
    if (blogData.content.sections) {
      blogData.content.sections.forEach((section, sectionIndex) => {
        toc.push({
          id: `section-${sectionIndex}`,
          title: section.title,
          level: 1
        });

        if (section.subsections) {
          section.subsections.forEach((subsection, subIndex) => {
            toc.push({
              id: `section-${sectionIndex}-sub-${subIndex}`,
              title: subsection.title,
              level: 2
            });
          });
        }
      });
    }

    // Add conclusion
    if (blogData.content.conclusion) {
      toc.push({
        id: 'conclusion',
        title: 'Conclusion',
        level: 1
      });
    }

    setTocItems(toc);
  };

  // Intersection Observer for active section highlighting
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [tocItems]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleBackToBlog = () => {
    navigate('/blog');
  };

  if (isLoading) {
    return (
      <div className="blog-post-page">
        <div className="blog-post-layout">
          <div className="blog-post-main">
            <div className="loading-container">
              <svg className="pl" viewBox="0 0 64 64" width="64px" height="64px" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#000" />
                    <stop offset="100%" stopColor="#fff" />
                  </linearGradient>
                  <mask id="grad-mask">
                    <rect x="0" y="0" width="64" height="64" fill="url(#grad)" />
                  </mask>
                </defs>
                <circle className="pl__ring" cx="32" cy="32" r="26" fill="none" stroke="hsl(223,90%,55%)" strokeWidth="12" strokeDasharray="169.65 169.65" strokeDashoffset="-127.24" strokeLinecap="round" transform="rotate(135)" />
                <g fill="hsl(223,90%,55%)">
                  <circle className="pl__ball1" cx="32" cy="45" r="6" transform="rotate(14)" />
                  <circle className="pl__ball2" cx="32" cy="48" r="3" transform="rotate(-21)" />
                </g>
                <g mask="url(#grad-mask)">
                  <circle className="pl__ring" cx="32" cy="32" r="26" fill="none" stroke="hsl(283,90%,55%)" strokeWidth="12" strokeDasharray="169.65 169.65" strokeDashoffset="-127.24" strokeLinecap="round" transform="rotate(135)" />
                  <g fill="hsl(283,90%,55%)">
                    <circle className="pl__ball1" cx="32" cy="45" r="6" transform="rotate(14)" />
                    <circle className="pl__ball2" cx="32" cy="48" r="3" transform="rotate(-21)" />
                  </g>
                </g>
              </svg>
              <p>Loading blog post...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-post-page">
        <div className="blog-post-layout">
          <div className="blog-post-main">
            <div className="error-container">
              <h2>Blog post not found</h2>
              <p>The blog post you're looking for doesn't exist.</p>
              <button onClick={handleBackToBlog} className="back-button">
                ← Back to Blog
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      <div className="blog-post-layout">
        {/* Table of Contents - Left Sidebar */}
        <aside className="toc-sidebar">
          <div className="toc-header">
            <h3 className="toc-title">Contents</h3>
            <button 
              onClick={() => setShowToc(!showToc)} 
              className="toc-toggle-button"
            >
              {showToc ? '−' : '+'}
            </button>
          </div>
          {showToc && (
            <motion.div 
              className="table-of-contents"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="toc-list">
                {tocItems.map((item, index) => (
                  <li 
                    key={index}
                    className={`toc-item toc-level-${item.level} ${
                      activeSection === item.id ? 'toc-active' : ''
                    }`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </aside>

        {/* Main Content Area */}
        <div className="blog-post-main">
          {/* Header */}
          <div className="blog-post-header">
            <button onClick={handleBackToBlog} className="back-button">
              ← Back to Blog
            </button>
          </div>

        {/* Article Content */}
        <motion.article 
          className="blog-post-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="blog-post-featured-image">
              <img src={blog.featuredImage} alt={blog.title} />
            </div>
          )}

          {/* Article Header */}
          <header className="blog-post-header-content">
            <h1 className="blog-post-title">{blog.title}</h1>
            
            <div className="blog-post-meta">
              <div className="blog-post-author">
                <img 
                  src={blog.authorAvatar} 
                  alt={blog.author}
                  className="author-avatar"
                />
                <div className="author-info">
                  <span className="author-name">{blog.author}</span>
                  <span className="publish-date">{blog.date}</span>
                </div>
              </div>
              <div className="blog-post-stats">
                <span className="read-time">{blog.readTime}</span>
                <span className="category">{blog.category}</span>
              </div>
            </div>
          </header>

          {/* Introduction */}
          {blog.content.introduction && (
            <div id="introduction" className="blog-post-introduction">
              <p>{blog.content.introduction}</p>
            </div>
          )}

          {/* Sections */}
          {blog.content.sections && blog.content.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} id={`section-${sectionIndex}`} className="blog-post-section">
              <h2 className="section-title">{section.title}</h2>
              
              {section.subsections && section.subsections.map((subsection, subIndex) => (
                <div key={subIndex} id={`section-${sectionIndex}-sub-${subIndex}`} className="blog-post-subsection">
                  <h3 className="subsection-title">{subsection.title}</h3>
                  <div className="subsection-content">
                    <p>{subsection.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Conclusion */}
          {blog.content.conclusion && (
            <div id="conclusion" className="blog-post-conclusion">
              <h2>Conclusion</h2>
              <p>{blog.content.conclusion}</p>
            </div>
          )}
        </motion.article>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;