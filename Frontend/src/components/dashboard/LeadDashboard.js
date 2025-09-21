import React, { useState } from 'react';

export function LeadDashboard({ 
  leads, 
  leadCategories, 
  onToggleStar, 
  onCreateCampaign, 
  onCreateOutreach, 
  onStartOutreach, 
  onNavigateToCampaignCreation, 
  onNavigateToSequenceCreation, 
  onAddLead, 
  onAddCategory, 
  onRemoveCategory, 
  onEditCategory 
}) {
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    jobTitle: '',
    company: '',
    phone: '',
    location: '',
    industry: '',
    folder: '',
    leadScore: 50,
    chatTitle: '',
    linkedinUrl: '',
    description: '',
    tags: ''
  });

  // Sample data matching the image
  const sampleLeads = [
    {
      id: 1,
      name: 'Sarah Chen',
      location: 'San Francisco, CA',
      title: 'Chief Technology Officer',
      company: 'FinanceFlow',
      industry: 'Financial Technology',
      score: 92,
      isStarred: false,
      email: 'sarah.chen@financeflow.com',
      phone: '+1 (555) 123-4567'
    },
    {
      id: 2,
      name: 'David Thompson',
      location: 'New York, NY',
      title: 'Chief Marketing Officer',
      company: 'TechFlow',
      industry: 'Software as a Service',
      score: 90,
      isStarred: false,
      email: 'david.thompson@techflow.com',
      phone: '+1 (555) 234-5678'
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      location: 'San Francisco, CA',
      title: 'VP of Engineering',
      company: 'PayScale Pro',
      industry: 'Financial Technology',
      score: 88,
      isStarred: false,
      email: 'michael.rodriguez@payscalepro.com',
      phone: '+1 (555) 345-6789'
    },
    {
      id: 4,
      name: 'Jennifer Kim',
      location: 'San Francisco, CA',
      title: 'Head of Product',
      company: 'CryptoLogic',
      industry: 'Cryptocurrency',
      score: 85,
      isStarred: false,
      email: 'jennifer.kim@cryptologic.com',
      phone: '+1 (555) 456-7890'
    },
    {
      id: 5,
      name: 'Alex Johnson',
      location: 'Austin, TX',
      title: 'Sales Director',
      company: 'StartupHub',
      industry: 'Business Services',
      score: 76,
      isStarred: false,
      email: 'alex.johnson@startuphub.com',
      phone: '+1 (555) 567-8901'
    },
    {
      id: 6,
      name: 'Maria Garcia',
      location: 'Miami, FL',
      title: 'Business Development Manager',
      company: 'LocalTech',
      industry: 'Business Services',
      score: 71,
      isStarred: false,
      email: 'maria.garcia@localtech.com',
      phone: '+1 (555) 678-9012'
    }
  ];

  const displayLeads = leads && leads.length > 0 ? leads : sampleLeads;
  const starredLeads = displayLeads.filter(lead => lead.isStarred);
  
  // Apply search and industry filters
  const searchFilteredLeads = displayLeads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = selectedIndustry === 'All Industries' || 
      lead.industry === selectedIndustry;
    
    return matchesSearch && matchesIndustry;
  });
  
  const filteredLeads = activeTab === 'starred' 
    ? starredLeads.filter(lead => {
        const matchesSearch = searchTerm === '' || 
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesIndustry = selectedIndustry === 'All Industries' || 
          lead.industry === selectedIndustry;
        
        return matchesSearch && matchesIndustry;
      })
    : searchFilteredLeads;

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedIndustry('All Industries');
  };

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  const closeLeadDetails = () => {
    setShowLeadDetails(false);
    setSelectedLead(null);
  };

  const openAddLeadModal = () => {
    setShowAddLeadModal(true);
  };

  const closeAddLeadModal = () => {
    setShowAddLeadModal(false);
    setNewLead({
      name: '',
      email: '',
      jobTitle: '',
      company: '',
      phone: '',
      location: '',
      industry: '',
      folder: '',
      leadScore: 50,
      chatTitle: '',
      linkedinUrl: '',
      description: '',
      tags: ''
    });
  };

  const handleInputChange = (field, value) => {
    setNewLead(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddLead = () => {
    // Validate required fields
    if (!newLead.name || !newLead.email) {
      alert('Please fill in required fields (Name and Email)');
      return;
    }

    // Create a new lead object with proper structure
    const leadToAdd = {
      id: Date.now(), // Simple ID generation
      name: newLead.name,
      email: newLead.email,
      title: newLead.jobTitle || '',
      company: newLead.company || '',
      phone: newLead.phone || '',
      location: newLead.location || '',
      industry: newLead.industry || '',
      score: newLead.leadScore || 50,
      isStarred: false,
      // Additional fields for the lead details panel
      chatTitle: newLead.chatTitle || '',
      linkedinUrl: newLead.linkedinUrl || '',
      description: newLead.description || '',
      tags: newLead.tags || '',
      folder: newLead.folder || '',
      addedOn: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      source: 'Manual Entry'
    };

    // Call the onAddLead prop if it exists
    if (onAddLead) {
      onAddLead(leadToAdd);
    }

    // Add to local sample data for immediate display
    sampleLeads.unshift(leadToAdd);
    
    closeAddLeadModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row w-full">
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 w-full ${showLeadDetails ? 'lg:mr-96' : ''}`}>
    <div className="p-3 sm:p-4 lg:p-6 w-full">
        {/* Lead Database Card */}
        <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 lg:p-6 w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Lead Database</h2>
              <p className="text-xs text-gray-500 mt-1">
                {displayLeads.length} total leads • {starredLeads.length} starred • {selectedLeads.length} selected
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button 
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-1.5 text-xs sm:text-sm w-full sm:w-auto"
            onClick={openAddLeadModal}
          >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Lead</span>
              </button>
              <button className="bg-white text-gray-700 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 flex items-center justify-center space-x-1.5 text-xs sm:text-sm w-full sm:w-auto">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                <span className="hidden sm:inline">Manage Folders</span>
                <span className="sm:hidden">Folders</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-4 sm:gap-8 border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
            <button
              className={`pb-2 px-1 text-xs font-medium whitespace-nowrap ${
                activeTab === 'all' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All Leads ({displayLeads.length})
            </button>
            <button
              className={`pb-2 px-1 text-xs font-medium flex items-center space-x-1 whitespace-nowrap ${
                activeTab === 'starred' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('starred')}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>Starred Leads ({starredLeads.length})</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search leads by name, company, title, or location..."
                className="block w-full pl-8 pr-8 py-2 text-sm border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <select
                className="border border-gray-300 rounded-md px-2 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                <option>All Industries</option>
                <option>Financial Technology</option>
                <option>Software as a Service</option>
                <option>Cryptocurrency</option>
                <option>Business Services</option>
              </select>
            </div>
          </div>

          {/* All Leads Table */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <h3 className="text-sm font-semibold text-gray-900">
                {searchTerm || selectedIndustry !== 'All Industries' ? 'Search Results' : 'All Leads'} ({filteredLeads.length} leads • {selectedLeads.length} selected)
              </h3>
              <button 
                className="text-blue-600 hover:text-blue-700 text-xs font-medium self-start sm:self-auto"
                onClick={handleSelectAll}
              >
                Select All
              </button>
            </div>

            <div className="overflow-x-auto">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="mt-2 text-xs font-medium text-gray-900">No leads found</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {searchTerm || selectedIndustry !== 'All Industries' 
                      ? 'Try adjusting your search criteria or filters.' 
                      : 'No leads available at the moment.'}
                  </p>
                  {(searchTerm || selectedIndustry !== 'All Industries') && (
                    <button
                      onClick={clearSearch}
                      className="mt-3 text-blue-600 hover:text-blue-700 text-xs font-medium"
                    >
                      Clear search and filters
                    </button>
                  )}
                </div>
              ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3 h-3"
                        checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      <div className="flex items-center space-x-1">
                        <span>Name</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] hidden sm:table-cell">Title</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Company</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] hidden md:table-cell">Industry</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Score</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleLeadClick(lead)}
                    >
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap w-8">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3 h-3"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectLead(lead.id);
                          }}
                        />
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap w-8">
                        <button 
                          className="text-yellow-400 hover:text-yellow-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleStar(lead.id);
                          }}
                        >
                          <svg className="w-4 h-4" fill={lead.isStarred ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap min-w-[120px]">
                        <div>
                          <div className="text-xs font-medium text-gray-900 truncate">{lead.name}</div>
                          <div className="text-xs text-gray-500 truncate">{lead.location}</div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs text-gray-900 min-w-[100px] hidden sm:table-cell">
                        <div className="truncate">{lead.title}</div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs text-gray-900 min-w-[120px]">
                        <div className="truncate">{lead.company}</div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap min-w-[100px] hidden md:table-cell">
                        <span className="inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 truncate">
                          {lead.industry}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap w-16">
                        <span className="inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full bg-gray-800 text-white">
                          {lead.score}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs font-medium w-20">
                        <div className="flex space-x-1">
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-900"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </button>
                          <button 
                            className="text-purple-600 hover:text-purple-900"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </div>
        </div>
        
        {/* Organize by Folders Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Organize by Folders</h3>
            <button className="bg-white text-gray-700 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 flex items-center space-x-1.5 text-sm">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              <span>Manage Folders</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* High Value Folder */}
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                <h4 className="text-sm font-semibold text-gray-900">High Value</h4>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Total Leads:</span>
                  <span className="text-xs font-medium text-gray-900">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Search Sessions:</span>
                  <span className="text-xs font-medium text-gray-900">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Avg Score:</span>
                  <span className="text-xs font-medium text-gray-900">90/100</span>
                </div>
              </div>
            </div>

            {/* Medium Value Folder */}
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                <h4 className="text-sm font-semibold text-gray-900">Medium Value</h4>
              </div>
        <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Total Leads:</span>
                  <span className="text-xs font-medium text-gray-900">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Search Sessions:</span>
                  <span className="text-xs font-medium text-gray-900">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Avg Score:</span>
                  <span className="text-xs font-medium text-gray-900">77/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* Lead Details Panel */}
      {showLeadDetails && selectedLead && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 z-50 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedLead.name}</h2>
                  <button
                    onClick={closeLeadDetails}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-3">{selectedLead.title} at {selectedLead.company}</p>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Score: {selectedLead.score}/100
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    {selectedLead.industry}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    High Value
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Start Email Campaign</span>
              </button>
              <div className="flex space-x-2">
                <button className="flex-1 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Call</span>
                </button>
                <button 
                  className="flex-1 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center space-x-2"
                  onClick={() => {
                    if (selectedLead.linkedinUrl) {
                      window.open(selectedLead.linkedinUrl, '_blank');
                    } else {
                      alert('No LinkedIn URL available for this lead');
                    }
                  }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>LinkedIn</span>
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-900">{selectedLead.email}</p>
                    <p className="text-xs text-gray-500">Primary Email</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-900">{selectedLead.phone}</p>
                    <p className="text-xs text-gray-500">Phone Number</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-900">{selectedLead.location}</p>
                    <p className="text-xs text-gray-500">Location</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Company Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Company:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLead.company || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Industry:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLead.industry || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Position:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLead.title || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Added On:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLead.addedOn || 'September 20, 2025'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Source:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedLead.source || 'AI Chat'}</span>
                </div>
                {selectedLead.chatTitle && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Chat Session:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedLead.chatTitle}</span>
                  </div>
                )}
                {selectedLead.folder && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Folder:</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{selectedLead.folder.replace('-', ' ')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Lead Profile */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Lead Profile</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {selectedLead.description || `Experienced ${selectedLead.title?.toLowerCase() || 'professional'} leading digital transformation at a fast-growing ${selectedLead.industry?.toLowerCase() || 'technology'} startup. Focuses on scalable payment solutions and regulatory compliance technology.`}
              </p>
              {selectedLead.tags && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {selectedLead.tags.split(',').map((tag, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add New Lead</h2>
                <p className="text-sm text-gray-500 mt-1">Create a new lead entry in your database.</p>
              </div>
              <button
                onClick={closeAddLeadModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter lead name"
                      value={newLead.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>

                  {/* Job Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter job title"
                      value={newLead.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter phone number"
                      value={newLead.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter industry"
                      value={newLead.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                    />
                  </div>

                  {/* Chat Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chat Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter chat session title"
                      value={newLead.chatTitle}
                      onChange={(e) => handleInputChange('chatTitle', e.target.value)}
                    />
                  </div>

                  {/* LinkedIn URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter LinkedIn profile URL"
                      value={newLead.linkedinUrl}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter lead description"
                      value={newLead.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="e.g., CEO, Fintech, Hot Lead"
                      value={newLead.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter email address"
                      value={newLead.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter company name"
                      value={newLead.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Enter location"
                      value={newLead.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>

                  {/* Folder */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Folder
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      value={newLead.folder}
                      onChange={(e) => handleInputChange('folder', e.target.value)}
                    >
                      <option value="">Select folder</option>
                      <option value="high-value">High Value</option>
                      <option value="medium-value">Medium Value</option>
                      <option value="low-value">Low Value</option>
                      <option value="new-leads">New Leads</option>
                    </select>
                  </div>

                  {/* Lead Score */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lead Score (1-100)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      value={newLead.leadScore}
                      onChange={(e) => handleInputChange('leadScore', parseInt(e.target.value) || 50)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeAddLeadModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLead}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Add Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
