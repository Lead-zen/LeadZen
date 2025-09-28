// src/components/dashboard/LeadDashboard.js
import React, { useState, useEffect } from "react";
import {
  createLead,
  listLeads,
  updateLead,
  deleteLead,
} from "../../services/lead";
import { ArrowUpDown } from "lucide-react";

export function LeadDashboard({
  leadCategories,
  onCreateCampaign,
  onCreateOutreach,
  onStartOutreach,
  onNavigateToCampaignCreation,
  onNavigateToSequenceCreation,
  onAddCategory,
  onRemoveCategory,
  onEditCategory,
  onNavigateToAIGeneration,
}) {
  const [leads, setLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [starredLeads, setStarredLeads] = useState(new Set());
  const [selectedLeadForSidebar, setSelectedLeadForSidebar] = useState(null);
  const [showLeadSidebar, setShowLeadSidebar] = useState(false);

  // Function to generate realistic job titles based on business type
  const generateJobTitle = (lead) => {
    const businessName = (lead.business_name || '').toLowerCase();
    const industry = (lead.industry || '').toLowerCase();
    
    // Hotel/Hospitality titles
    if (businessName.includes('hotel') || businessName.includes('inn') || businessName.includes('resort') || industry.includes('hotel')) {
      const titles = ['General Manager', 'Operations Manager', 'Front Desk Manager', 'Guest Relations Manager', 'Revenue Manager', 'Sales Manager', 'Marketing Manager'];
      return titles[Math.floor(Math.random() * titles.length)];
    }
    
    // Restaurant/Food titles
    if (businessName.includes('restaurant') || businessName.includes('cafe') || businessName.includes('kitchen') || businessName.includes('food')) {
      const titles = ['Head Chef', 'Restaurant Manager', 'Operations Manager', 'General Manager', 'Kitchen Manager', 'F&B Manager'];
      return titles[Math.floor(Math.random() * titles.length)];
    }
    
    // Tech/Software titles
    if (businessName.includes('tech') || businessName.includes('software') || businessName.includes('digital') || industry.includes('technology')) {
      const titles = ['CTO', 'Software Engineer', 'Product Manager', 'Technical Lead', 'DevOps Engineer', 'Solutions Architect'];
      return titles[Math.floor(Math.random() * titles.length)];
    }
    
    // Finance titles
    if (businessName.includes('finance') || businessName.includes('bank') || businessName.includes('investment') || industry.includes('finance')) {
      const titles = ['CFO', 'Financial Analyst', 'Investment Manager', 'Risk Manager', 'Finance Director', 'Treasury Manager'];
      return titles[Math.floor(Math.random() * titles.length)];
    }
    
    // Healthcare titles
    if (businessName.includes('health') || businessName.includes('medical') || businessName.includes('clinic') || industry.includes('healthcare')) {
      const titles = ['Medical Director', 'Practice Manager', 'Healthcare Administrator', 'Clinical Manager', 'Operations Director'];
      return titles[Math.floor(Math.random() * titles.length)];
    }
    
    // Education titles
    if (businessName.includes('school') || businessName.includes('education') || businessName.includes('academy') || industry.includes('education')) {
      const titles = ['Principal', 'Academic Director', 'Education Manager', 'Curriculum Coordinator', 'Student Affairs Manager'];
      return titles[Math.floor(Math.random() * titles.length)];
    }
    
    // Default business titles
    const defaultTitles = ['CEO', 'COO', 'General Manager', 'Operations Manager', 'Business Development Manager', 'Sales Manager', 'Marketing Manager', 'Project Manager', 'Operations Director', 'Business Owner'];
    return defaultTitles[Math.floor(Math.random() * defaultTitles.length)];
  };

  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    jobTitle: "",
    company: "",
    phone: "",
    location: "",
    industry: "",
    folder: "",
    leadScore: 50,
    chatTitle: "",
    linkedinUrl: "",
    description: "",
    tags: "",
  });

  // Fetch leads from backend
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await listLeads();
        setLeads(data);
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };
    fetchLeads();
  }, []);

  // Toggle star functionality
  const toggleStar = (leadId) => {
    setStarredLeads(prev => {
      const newStarred = new Set(prev);
      if (newStarred.has(leadId)) {
        newStarred.delete(leadId);
      } else {
        newStarred.add(leadId);
      }
      return newStarred;
    });
  };

  // Handle lead name click to show sidebar
  const handleLeadNameClick = (lead) => {
    setSelectedLeadForSidebar(lead);
    setShowLeadSidebar(true);
  };

  // Close sidebar
  const closeLeadSidebar = () => {
    setShowLeadSidebar(false);
    setSelectedLeadForSidebar(null);
  };

  const starredLeadsList = leads.filter((lead) => starredLeads.has(lead.id));

  const displayLeads =
    activeTab === "starred"
      ? starredLeadsList
      : leads.filter((lead) => {
          const matchesSearch =
            searchTerm === "" ||
            lead.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.industry?.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesIndustry =
            selectedIndustry === "All Industries" ||
            lead.industry === selectedIndustry;

          return matchesSearch && matchesIndustry;
        });

  const handleSelectLead = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === displayLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(displayLeads.map((l) => l.id));
    }
  };

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  const closeLeadDetails = () => {
    setSelectedLead(null);
    setShowLeadDetails(false);
  };

  // ⭐ Toggle Star
  const handleToggleStar = async (leadId) => {
    try {
      const lead = leads.find((l) => l.id === leadId);
      const updated = await updateLead(leadId, {
        ...lead,
        isStarred: !lead.isStarred,
      });
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? updated : l))
      );
    } catch (err) {
      console.error("Error toggling star:", err);
    }
  };

  // 🗑️ Delete Lead
  const handleDeleteLead = async (leadId) => {
    try {
      await deleteLead(leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedIndustry("All Industries");
  };

  const handleInputChange = (field, value) => {
    setNewLead((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const closeAddLeadModal = () => {
    setShowAddLeadModal(false);
    setNewLead({
      name: "",
      email: "",
      jobTitle: "",
      company: "",
      phone: "",
      location: "",
      industry: "",
      folder: "",
      leadScore: 50,
      chatTitle: "",
      linkedinUrl: "",
      description: "",
      tags: "",
    });
  };

  // -----------------------------
  // FULL JSX
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row w-full">
      <div
        className={`flex-1 transition-all duration-300 w-full ${
          showLeadDetails ? "lg:mr-96" : ""
        }`}
      >
        <div className="p-6 w-full">
          {/* Top Bar */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lead Database</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {leads.length} total leads • {starredLeadsList.length} starred • {selectedLeads.length} selected
                </p>
              </div>

                {/* New Search Button */}
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2"
                  onClick={() => {
                    if (onNavigateToAIGeneration) {
                      onNavigateToAIGeneration();
                    } else {
                      console.log("New search clicked - navigate to AI Lead Generation");
                    }
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>New Search</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mb-6">
              <button
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 inline-flex items-center ${
                  activeTab === "all"
                    ? ""
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("all")}
                style={{
                  backgroundColor: activeTab === "all" ? "rgba(107, 33, 168, 0.15)" : "transparent",
                  color: "#6B21A8",
                  fontWeight: activeTab === "all" ? "600" : "500",
                  border: activeTab === "all" ? "1px solid rgba(107, 33, 168, 0.3)" : "1px solid transparent",
                  height: "32px"
                }}
              >
                All Leads ({leads.length})
              </button>
              <button
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 inline-flex items-center space-x-2 ${
                  activeTab === "starred"
                    ? ""
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("starred")}
                style={{
                  backgroundColor: activeTab === "starred" ? "rgba(107, 33, 168, 0.15)" : "transparent",
                  color: activeTab === "starred" ? "#6B21A8" : "#6B7280",
                  fontWeight: activeTab === "starred" ? "600" : "500",
                  border: activeTab === "starred" ? "1px solid rgba(107, 33, 168, 0.3)" : "1px solid transparent",
                  height: "32px"
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: activeTab === "starred" ? "#6B21A8" : "#9CA3AF" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span>Starred Leads ({starredLeadsList.length})</span>
              </button>
            </div>

            {/* Search Bar and Filter */}
            <div className="flex gap-3 items-center">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9CA3AF' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search heads by name, company, title, or location...."
                  className="w-full pl-10 pr-4 text-gray-900 border-0 rounded-full focus:outline-none transition-all duration-200"
                  style={{ 
                    backgroundColor: '#E6FCFB',
                    height: '40px',
                    color: '#6B7280'
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Industry Filter Dropdown */}
              <div className="relative">
                <div className="relative">
              <select
                    className="px-4 py-2 text-sm bg-white border rounded-full focus:outline-none appearance-none cursor-pointer pr-8"
                    style={{
                      height: '40px',
                      borderColor: '#6B21A8',
                      color: '#6B21A8',
                      fontWeight: '500',
                      minWidth: '160px'
                    }}
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                <option>All Industries</option>
                <option>Financial Technology</option>
                <option>Software as a Service</option>
                <option>Cryptocurrency</option>
                <option>Business Services</option>
              </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#6B21A8' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Results and Pagination */}
            <div className="flex items-center justify-between mt-4 mb-4">
              <div className="text-sm font-medium" style={{ color: '#374151' }}>
                Showing 1-{displayLeads.length} of {displayLeads.length} leads
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: '#374151' }}>Show:</span>
                  <div className="relative">
                    <select 
                      className="px-3 py-1.5 text-sm focus:outline-none appearance-none cursor-pointer pr-6 transition-colors duration-200"
                      style={{ 
                        borderRadius: '6px',
                        border: '1px solid rgba(107, 33, 168, 0.3)',
                        backgroundColor: 'rgba(221, 252, 224, 0.15)',
                        color: '#374151'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#6B21A8';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = 'rgba(107, 33, 168, 0.3)';
                      }}
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(107, 33, 168, 0.4)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-purple-300 text-purple-600 transition-colors duration-200"
                    style={{ 
                      backgroundColor: 'transparent',
                      margin: 0,
                      padding: 0
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#6B21A8';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'rgba(107, 33, 168, 0.7)';
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium" style={{ color: '#374151', margin: 0, padding: 0, lineHeight: '1' }}>Page 1 of 1</span>
                  <button 
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-purple-300 text-purple-600 transition-colors duration-200"
                    style={{ 
                      backgroundColor: 'transparent',
                      margin: 0,
                      padding: 0
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#6B21A8';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'rgba(107, 33, 168, 0.7)';
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            </div>

            {/* Leads Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead style={{ backgroundColor: '#F9FAFB' }}>
                  <tr>
                    <th className="w-12 py-2.5 px-4 text-left border-r" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}>
                      <input
                        type="checkbox"
                        checked={leads.length > 0 && selectedLeads.length === displayLeads.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-2 border-purple-600 text-purple-600 focus:ring-purple-500"
                        style={{ accentColor: '#6B21A8' }}
                      />
                    </th>
                    <th className="w-12 py-2.5 px-4 text-left border-r" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}>
                      <div className="flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#6B21A8' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                    </th>
                    <th className="w-32 py-2.5 px-4 text-left border-r" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: '#1F2937' }}>Name</span>
                        <ArrowUpDown className="w-4 h-4" style={{ color: '#6B21A8' }} />
                      </div>
                    </th>
                    <th className="w-40 py-2.5 px-4 text-left border-r" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: '#1F2937' }}>Title</span>
                        <ArrowUpDown className="w-4 h-4" style={{ color: '#6B21A8' }} />
                      </div>
                    </th>
                    <th className="w-32 py-2.5 px-4 text-left border-r" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: '#1F2937' }}>Company</span>
                        <ArrowUpDown className="w-4 h-4" style={{ color: '#6B21A8' }} />
                      </div>
                    </th>
                    <th className="w-32 py-2.5 px-4 text-left border-r" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: '#1F2937' }}>Industry</span>
                        <ArrowUpDown className="w-4 h-4" style={{ color: '#6B21A8' }} />
                      </div>
                    </th>
                    <th className="w-20 py-2.5 px-4 text-left border-r" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: '#1F2937' }}>Score</span>
                        <ArrowUpDown className="w-4 h-4" style={{ color: '#6B21A8' }} />
                      </div>
                    </th>
                    <th className="w-40 py-2.5 px-4 text-left border-r" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}>
                      <span className="text-sm font-semibold" style={{ color: '#1F2937' }}>Tags</span>
                    </th>
                    <th className="w-24 py-2.5 px-4 text-left">
                      <span className="text-sm font-semibold" style={{ color: '#1F2937' }}>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tr>
                  <td colSpan="9" className="border-b" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}></td>
                </tr>
                <tbody className="bg-white">
                  {displayLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50 transition-colors duration-150 border-b"
                      style={{ borderColor: 'rgba(107, 33, 168, 0.1)' }}
                    >
                      <td className="py-2.5 px-4 border-r" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}>
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectLead(lead.id);
                          }}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="py-2.5 px-4 border-r" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}>
                        <div className="flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(lead.id);
                            }}
                            className="p-1 rounded hover:bg-gray-100 transition-colors duration-200"
                          >
                            <svg 
                              className="w-4 h-4" 
                              fill={starredLeads.has(lead.id) ? "currentColor" : "none"} 
                              stroke="currentColor" 
                              viewBox="0 0 24 24" 
                              style={{ color: starredLeads.has(lead.id) ? '#FCD34D' : '#6B21A8' }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 border-r" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}>
                        <div className="min-w-0">
                          <div 
                            className="text-sm font-bold text-gray-900 truncate cursor-pointer hover:text-purple-600 transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLeadNameClick(lead);
                            }}
                          >
                            {lead.business_name || 'Unknown Name'}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {lead.address || 'No Location'}
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 border-r" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}>
                        <div className="text-sm text-gray-900 truncate">{lead.designation || generateJobTitle(lead)}</div>
                      </td>
                      <td className="py-2.5 px-4 border-r" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}>
                        <div className="text-sm text-gray-900 truncate">{lead.business_name || '-'}</div>
                      </td>
                      <td className="py-2.5 px-4 border-r" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}>
                        <span 
                          className="inline-flex items-center rounded-full transition-colors duration-200" 
                          style={{ 
                            border: '2px solid #6B21A8',
                            backgroundColor: 'transparent',
                            color: '#6B21A8',
                            fontSize: '14px',
                            fontWeight: '500',
                            padding: '6px 16px'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(107, 33, 168, 0.05)';
                            e.target.style.borderColor = '#6B21A8';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.borderColor = '#6B21A8';
                          }}
                        >
                          {lead.industry || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 border-r" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}>
                        <div className="text-sm font-bold text-purple-600">
                          {lead.lead_score || 0}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 border-r" style={{ borderColor: 'rgba(107, 33, 168, 0.3)' }}>
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            // Create tags based on available lead data
                            const tags = [];
                            if (lead.verified) tags.push('Verified');
                            if (lead.lead_score >= 80) tags.push('High Score');
                            if (lead.email) tags.push('Has Email');
                            if (lead.contact_number) tags.push('Has Phone');
                            if (lead.website) tags.push('Has Website');
                            
                            if (tags.length > 0) {
                              return tags.slice(0, 2).map((tag, index) => {
                                return (
                                  <span key={index} className="inline-flex items-center px-2 py-1 text-xs font-medium rounded" style={{
                                    backgroundColor: 'rgba(0, 255, 209, 0.15)',
                                    color: '#1F2937',
                                    borderRadius: '4px',
                                    height: '17px',
                                    fontWeight: '500'
                                  }}>
                                    {tag}
                                  </span>
                                );
                              });
                            } else {
                              return <span className="text-xs text-gray-400">-</span>;
                            }
                          })()}
                          {(() => {
                            const tags = [];
                            if (lead.verified) tags.push('Verified');
                            if (lead.lead_score >= 80) tags.push('High Score');
                            if (lead.email) tags.push('Has Email');
                            if (lead.contact_number) tags.push('Has Phone');
                            if (lead.website) tags.push('Has Website');
                            
                            if (tags.length > 2) {
                              return (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded" style={{
                                  backgroundColor: 'rgba(0, 255, 209, 0.15)',
                                  color: '#1F2937',
                                  borderRadius: '4px',
                                  height: '17px',
                                  fontWeight: '500'
                                }}>
                                  +{tags.length - 2}
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (lead.email) window.open(`mailto:${lead.email}`, '_blank');
                            }}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors duration-150"
                            title="Email"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                              if (lead.phone) window.open(`tel:${lead.phone}`, '_blank');
                          }}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors duration-150"
                            title="Call"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                              // Chat action - you can implement this
                          }}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors duration-150"
                            title="Chat"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {displayLeads.length === 0 && (
                    <tr>
                      <td colSpan="9" className="py-16 text-center">
                        <div className="text-gray-500">
                          <img 
                            src="/Group 275.svg" 
                            alt="No leads" 
                            className="mx-auto h-20 w-20 mb-6"
                          />
                          <p className="text-xl font-semibold text-gray-900 mb-3">
                            {leads.length === 0 ? "No leads in your database" : "No leads found"}
                          </p>
                          <p className="text-sm text-gray-500 mb-6">
                            {leads.length === 0 
                              ? "Start by generating leads using AI or importing your existing contacts."
                              : "Try adjusting your search criteria or create a new search."
                            }
                          </p>
                          {leads.length === 0 && (
                            <div className="flex gap-3 justify-center">
                              <button
                                onClick={() => window.location.href = '/dashboard?view=generate'}
                                className="px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors duration-200"
                              >
                                Generate Leads with AI
                              </button>
                              <button
                                onClick={() => setShowAddLeadModal(true)}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors duration-200"
                              >
                                Add Lead Manually
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Details Drawer */}
      {showLeadDetails && selectedLead && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l z-50 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-semibold">{selectedLead.name}</h2>
            <p>{selectedLead.title}</p>
            <p>{selectedLead.company}</p>
            <p>{selectedLead.email}</p>
            <p>{selectedLead.phone}</p>
            <button
              onClick={closeLeadDetails}
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Lead Details Sidebar */}
      {showLeadSidebar && selectedLeadForSidebar && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-y-auto rounded-l-2xl">
          <div className="p-6">
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedLeadForSidebar.business_name || 'Unknown Name'}</h3>
                <p className="text-sm text-gray-600">
                  {(selectedLeadForSidebar.designation || selectedLeadForSidebar.contact_person) ? 
                    `${selectedLeadForSidebar.designation || selectedLeadForSidebar.contact_person} at ${selectedLeadForSidebar.business_name || 'Company'}` : 
                    'Business Lead'
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStar(selectedLeadForSidebar.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill={starredLeads.has(selectedLeadForSidebar.id) ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    style={{ color: starredLeads.has(selectedLeadForSidebar.id) ? '#FCD34D' : '#6B21A8' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                <button
                  onClick={closeLeadSidebar}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <svg className="w-4 h-4 hover:text-gray-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9CA3AF' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Lead Name & Title */}
            <div className="mb-8">
              
              {/* Score Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm" style={{ backgroundColor: '#1F2937' }}>
                  Score: {selectedLeadForSidebar.lead_score || 0}/100
                </span>
              </div>

              {/* Industry & Value Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border" style={{ 
                  backgroundColor: '#F8FAFC', 
                  color: '#475569',
                  borderColor: '#E2E8F0'
                }}>
                  {selectedLeadForSidebar.industry || 'Unknown Industry'}
                </span>
                {selectedLeadForSidebar.lead_score >= 80 && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border" style={{ 
                    backgroundColor: '#F0FDF4', 
                    color: '#166534',
                    borderColor: '#BBF7D0'
                  }}>
                    High Value
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h4>
              <div className="flex justify-center">
                <button className="w-auto flex items-center justify-center gap-2 px-6 py-2 rounded-2xl text-white font-semibold mb-4 shadow-sm hover:shadow-md hover:bg-purple-700 hover:text-white transition-all duration-200" style={{ backgroundColor: '#6B21A8', color: 'white' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Start Email Campaign
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button className="flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-xs">Call</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-xs">LinkedIn</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-xs">Message</span>
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }}></div>
                Contact Information
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#E0F2FE' }}>
                    <svg className="w-4 h-4" style={{ color: '#0369A1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {selectedLeadForSidebar.email || `${(selectedLeadForSidebar.business_name || selectedLeadForSidebar.name || 'lead').toLowerCase().replace(/\s+/g, '.')}@gmail.com`}
                    </div>
                    <div className="text-xs text-gray-500">Primary Email</div>
                  </div>
                </div>
                {selectedLeadForSidebar.contact_number && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
                      <svg className="w-4 h-4" style={{ color: '#16A34A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{selectedLeadForSidebar.contact_number}</div>
                      <div className="text-xs text-gray-500">Phone Number</div>
                    </div>
                  </div>
                )}
                {selectedLeadForSidebar.address && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
                      <svg className="w-4 h-4" style={{ color: '#D97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{selectedLeadForSidebar.address}</div>
                      <div className="text-xs text-gray-500">Location</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Company Details */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3B82F6' }}></div>
                Company Details
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Company</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLeadForSidebar.business_name || '-'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Industry</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLeadForSidebar.industry || '-'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Position</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLeadForSidebar.designation || selectedLeadForSidebar.contact_person || '-'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Added On</span>
                  <span className="text-sm font-medium text-gray-900">{new Date(selectedLeadForSidebar.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Source</span>
                  <span className="text-sm font-medium text-gray-900">AI Chat</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Chat Session</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLeadForSidebar.industry || 'Unknown'} Leaders</span>
                </div>
              </div>
            </div>

            {/* Lead Profile */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#8B5CF6' }}></div>
                Lead Profile
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedLeadForSidebar.summary || `Experienced ${selectedLeadForSidebar.designation || 'professional'} leading digital transformation at ${selectedLeadForSidebar.business_name || 'a growing company'}. Focuses on ${selectedLeadForSidebar.industry || 'innovative'} solutions and regulatory compliance technology.`}
                </p>
              </div>
            </div>

            {/* Tags & Keywords */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }}></div>
                Tags & Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const tags = [];
                  if (selectedLeadForSidebar.designation) tags.push(selectedLeadForSidebar.designation);
                  if (selectedLeadForSidebar.industry) tags.push(selectedLeadForSidebar.industry);
                  if (selectedLeadForSidebar.lead_score >= 80) tags.push('High Value');
                  if (selectedLeadForSidebar.verified) tags.push('Verified');
                  if (selectedLeadForSidebar.website) tags.push('Has Website');
                  
                  return tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium" style={{ 
                      backgroundColor: '#F8FAFC', 
                      color: '#475569',
                      border: '1px solid #E2E8F0'
                    }}>
                      {tag}
                    </span>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
