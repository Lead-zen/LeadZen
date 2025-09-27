// src/components/dashboard/LeadDashboard.js
import React, { useState, useEffect } from "react";
import {
  createLead,
  listLeads,
  updateLead,
  deleteLead,
} from "../../services/lead";

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

  const starredLeads = leads.filter((lead) => lead.isStarred);

  const displayLeads =
    activeTab === "starred"
      ? starredLeads
      : leads.filter((lead) => {
          const matchesSearch =
            searchTerm === "" ||
            lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.location?.toLowerCase().includes(searchTerm.toLowerCase());

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
        <div className="p-3 sm:p-4 lg:p-6 w-full">
          {/* Lead Database Card */}
          <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 lg:p-6 w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Lead Database
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {leads.length} total leads • {starredLeads.length} starred •{" "}
                  {selectedLeads.length} selected
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-1.5 text-sm w-full sm:w-auto"
                  onClick={() => {
                    if (onNavigateToAIGeneration) {
                      onNavigateToAIGeneration();
                    } else {
                      console.log(
                        "New search clicked - navigate to AI Lead Generation"
                      );
                    }
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>New Search</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-4 sm:gap-8 border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
              <button
                className={`pb-2 px-1 text-xs font-medium whitespace-nowrap ${
                  activeTab === "all"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All Leads ({leads.length})
              </button>
              <button
                className={`pb-2 px-1 text-xs font-medium flex items-center space-x-1 whitespace-nowrap ${
                  activeTab === "starred"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("starred")}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <span>Starred Leads ({starredLeads.length})</span>
              </button>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search leads..."
                  className="block w-full pl-8 pr-8 py-2 text-sm border border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              <select
                className="border border-gray-300 rounded-md px-2 py-2 text-sm bg-white"
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

            {/* Leads Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={
                          leads.length > 0 &&
                          selectedLeads.length === displayLeads.length
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Industry</th>
                    <th>Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleLeadClick(lead)}
                    >
                      <td className="px-2">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectLead(lead.id);
                          }}
                        />
                      </td>
                      <td>{lead.business_name}</td>
                      <td>{lead.industry}</td>
                      <td>{lead.lead_score}</td>
                      <td>{lead.address}</td>
                      <td>{lead.website}</td>
                      <td className="space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStar(lead.id);
                          }}
                          className="text-yellow-500"
                        >
                          ★
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLead(lead.id);
                          }}
                          className="text-red-500"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                  {displayLeads.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-6">
                        No leads found
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

    </div>
  );
}
