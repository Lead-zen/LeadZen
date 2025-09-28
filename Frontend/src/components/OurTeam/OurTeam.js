import React from 'react';
import { motion } from 'framer-motion';
import './OurTeam.css';

const OurTeam = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Chhitesh Shrestha",
      position: "CEO",
      description: "SaaS growth strategy, business development, and scaling global ventures."
    },
    {
      id: 2,
      name: "Sugat Shrestha",
      position: "CTO",
      description: "AI systems, data engineering, and building scalable, secure platforms."
    },
    {
      id: 3,
      name: "Eric Nakarmi",
      position: "Head of Growth",
      description: "B2B marketing, customer acquisition funnels, and sales enablement."
    },
    {
      id: 4,
      name: "Kussum Shakya",
      position: "GTM (Go-to-Market Strategy)",
      description: "Go-to-market strategies, market analysis, and product positioning."
    },
    {
      id: 5,
      name: "Sadhan Shakya",
      position: "Backend Developer",
      description: "Backend architecture, server management, and API integration."
    },
    {
      id: 6,
      name: "Sushma Sharma",
      position: "Frontend Developer",
      description: "Front-end development, web performance optimization, and responsive design."
    },
    {
      id: 7,
      name: "Bini Shrestha",
      position: "UI/UX Designer",
      description: "User interface design, user experience research, and wireframing."
    },
    {
      id: 8,
      name: "Krishnaa Shrestha",
      position: "Social Media Manager",
      description: "Social media strategy, content creation, and community engagement."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 0.9, 0.35, 1]
      }
    }
  };

  return (
    <section className="our-team-section">
      <div className="our-team-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 0.9, 0.35, 1] }}
          viewport={{ once: true }}
          className="team-header"
        >
          <h2 className="team-title">Our Team</h2>
          <p className="team-subtitle">
            Behind Evecta is a team of innovators and strategists united by one goal: to make lead generation and outreach smarter, faster, and more ethical. Each member's expertise helps shape the platform and advance our mission.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="team-grid"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              className="team-member-card"
              whileHover={{ 
                y: -5,
                transition: { duration: 0.3, ease: [0.22, 0.9, 0.35, 1] }
              }}
            >
              <div className="member-content">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-position">{member.position}</p>
                <p className="member-description">{member.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OurTeam;
