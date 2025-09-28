import React, { useState, useEffect } from 'react';
import { 
  Send, CheckCircle, MessageSquare, 
  Save, Mail, Phone, ExternalLink, Sparkles
} from 'lucide-react';
import { UnfilledIcon } from './icons/UnfilledIcon';
import { UserBulbIcon } from './icons/UserBulbIcon';
import { Frame603Icon } from './icons/Frame603Icon';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';
import { chatLeads } from '../../services/chatapi'; // ✅ connect to backend
import { getLeadsCount } from '../../services/lead'; // ✅ connect to backend for count

export function LeadGeneration({ 
  onLeadsGenerated, 
  stagedLeads, 
  onStageLeads, 
  onMoveStagedLeadsToDatabase, 
  onStartNewChat,
  onNavigateToLeads
}) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // ✅ new
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);

  // Fetch total leads count on component mount
  useEffect(() => {
    const fetchTotalLeadsCount = async () => {
      try {
        const response = await getLeadsCount();
        setTotalLeadsCount(response.count || 0);
      } catch (error) {
        console.error('Error fetching leads count:', error);
        setTotalLeadsCount(0);
      }
    };
    
    fetchTotalLeadsCount();
  }, []);

  const examplePrompts = [
    "Find CTOs of fintech startups in San Francisco with 50-200 employees",
    "Find CTOs of fintech startups in San Francisco with 50-200 employees",
    "Find CTOs of fintech startups in San Francisco with 50-200 employees",
    "Find CTOs of fintech startups in San Francisco with 50-200 employees"
  ];

  // -----------------------------
  // Submit handler → fetch real data
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      // ✅ Call backend
      const response = await chatLeads(prompt);

      // Save chat conversation
      setChatHistory((prev) => [
        ...prev,
        { role: "user", text: prompt },
        { role: "assistant", text: response.message }
      ]);

      // Backend returns { context, message, leads }
      const generatedLeads = (response.leads || []).map((lead, index) => {
        // Extract name from various possible fields
        const name = lead.contact_name || lead.owner_name || lead.manager_name || lead.name || 
                    lead.contact_person || lead.manager || lead.owner || null;
        
        // Extract title from various possible fields
        const title = lead.job_title || lead.position || lead.role || lead.title || 
                     lead.designation || lead.occupation || null;
        
        // Generate tags based on industry and other data
        const generatedTags = [];
        if (lead.industry) generatedTags.push(lead.industry);
        if (lead.business_type) generatedTags.push(lead.business_type);
        if (lead.location) generatedTags.push(lead.location.split(',')[0].trim()); // City name
        if (lead.contact_type) generatedTags.push(lead.contact_type);
        
        return {
          id: lead.id || `${lead.business_name}-${index}`,
          name: name,
          title: title,
          company: lead.business_name,
          email: lead.email || lead.contact_email || null,
          phone: lead.contact_number || lead.phone || lead.telephone || null,
          linkedinUrl: lead.website && lead.website.startsWith("http") ? lead.website : lead.linkedin_url || null,
          industry: lead.industry || lead.business_type || null,
          location: lead.address || lead.location || lead.city || null,
          description: lead.summary || lead.description || '',
          score: lead.lead_score || lead.score || Math.floor(Math.random() * 100),
          tags: lead.tags ? (Array.isArray(lead.tags) ? lead.tags : lead.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)) : generatedTags,
          chatTitle: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : '')
        };
      });

      const chatTitle = prompt.slice(0, 50) + (prompt.length > 50 ? '...' : '');
      onStageLeads(generatedLeads, chatTitle);

      setSelectedLeads(generatedLeads.map((lead) => lead.id));
    } catch (error) {
      console.error("Error generating leads:", error);
    }

    setPrompt('');
    setIsGenerating(false);
  };

  const handleNewSearch = () => {
    onStartNewChat();
    setSelectedLeads([]);
    setPrompt('');
    setChatHistory([]); // ✅ reset chat
  };

  const handleSaveSelected = () => {
    if (selectedLeads.length > 0) {
      setShowSaveDialog(true);
    }
  };

  const handleSaveToDatabase = () => {
    if (searchTitle.trim()) {
      const leadsToSave = stagedLeads
        .filter((lead) => selectedLeads.includes(lead.id))
        .map((lead) => ({
          ...lead,
          chatTitle: searchTitle.trim()
        }));

      onLeadsGenerated(leadsToSave, searchTitle.trim());
      setSearchTitle('');
      setSelectedLeads([]);
      setShowSaveDialog(false);
    }
  };

  const toggleLeadSelection = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  const selectAllLeads = () => {
    setSelectedLeads(
      selectedLeads.length === stagedLeads.length
        ? []
        : stagedLeads.map((lead) => lead.id)
    );
  };

  return (
    <div className="h-full flex flex-col w-full">
      {/* Results Header */}
      {stagedLeads.length > 0 && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
                    <p className="text-sm text-gray-600">
                      Found {stagedLeads.length} leads • {selectedLeads.length} selected
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleNewSearch}
                    className="gap-2 w-full sm:w-auto hover:bg-blue-50 hover:border-blue-300 border-gray-300"
                  >
                    <MessageSquare className="h-4 w-4" />
                    New Search
                  </Button>
                  <Button
                    onClick={handleSaveSelected}
                    disabled={selectedLeads.length === 0}
                    className="gap-2 w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Save className="h-4 w-4" />
                    Save Selected ({selectedLeads.length})
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat history - clean section */}
          {chatHistory.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Conversation</h3>
                <div className="space-y-3">
                  {chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-3 rounded-lg shadow-sm",
                        msg.role === "user"
                          ? "bg-blue-500 text-white ml-auto rounded-br-sm max-w-xs"
                          : "bg-white text-gray-800 mr-auto rounded-bl-sm border border-gray-200 max-w-2xl"
                      )}
                    >
                      <p className="text-sm leading-relaxed text-center">{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Generated Leads Section - clean design */}
      {stagedLeads.length > 0 && (
        <div className="flex-1 bg-gray-50">
          <div className="px-6 py-6">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Generated Leads</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Review and select the leads you want to save
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={selectAllLeads}
                  className="w-full sm:w-auto border-gray-300 hover:bg-gray-50"
                >
                  {selectedLeads.length === stagedLeads.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              {/* Leads Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="w-12 px-6 py-3">
                          <input
                            type="checkbox"
                            checked={selectedLeads.length === stagedLeads.length && stagedLeads.length > 0}
                            onChange={selectAllLeads}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Industry</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Tags</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stagedLeads.map((lead) => (
                        <tr
                          key={lead.id}
                          className={cn(
                            "hover:bg-gray-50 cursor-pointer transition-colors",
                            selectedLeads.includes(lead.id) && "bg-purple-50"
                          )}
                          onClick={() => toggleLeadSelection(lead.id)}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedLeads.includes(lead.id)}
                              onChange={() => toggleLeadSelection(lead.id)}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              {lead.name && (
                                <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                              )}
                              {(lead.email || lead.phone) && (
                                <div className="text-sm text-gray-500">{lead.email || lead.phone}</div>
                              )}
                              {!lead.name && !lead.email && !lead.phone && (
                                <div className="text-sm text-gray-400 italic">Contact info not available</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            {lead.title && (
                              <div className="text-sm text-gray-900">{lead.title}</div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{lead.company}</div>
                              <div className="text-sm text-gray-500">{lead.location}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            {lead.industry && lead.industry !== 'N/A' && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {lead.industry}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                              lead.score >= 90 
                                ? "bg-green-100 text-green-800" 
                                : lead.score >= 75 
                                ? "bg-yellow-100 text-yellow-800" 
                                : "bg-gray-100 text-gray-800"
                            )}>
                              {lead.score || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            {lead.tags && lead.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {lead.tags.map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {lead.email && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`mailto:${lead.email}`, '_blank');
                                  }}
                                  className="h-8 w-8 p-0 hover:bg-blue-50"
                                  title="Send Email"
                                >
                                  <Mail className="h-4 w-4 text-blue-600" />
                                </Button>
                              )}
                              {lead.phone && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`tel:${lead.phone}`, '_blank');
                                  }}
                                  className="h-8 w-8 p-0 hover:bg-green-50"
                                  title="Call"
                                >
                                  <Phone className="h-4 w-4 text-green-600" />
                                </Button>
                              )}
                              {lead.linkedinUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(lead.linkedinUrl, '_blank');
                                  }}
                                  className="h-8 w-8 p-0 hover:bg-blue-50"
                                  title="View Profile"
                                >
                                  <ExternalLink className="h-4 w-4 text-blue-600" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Load More Leads Button */}
              <div className="mt-6 text-center">
                <Button
                  onClick={() => onNavigateToLeads && onNavigateToLeads()}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg font-medium"
                >
                  Load More Leads
                  {totalLeadsCount > 0 && (
                    <span className="ml-2 text-sm opacity-90">
                      ({totalLeadsCount} total in database)
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto w-full">
        {stagedLeads.length === 0 && (
          <div className="relative h-full bg-white">
            <div className="max-w-4xl mx-auto space-y-4 w-full px-6 py-8">
              <div className="text-center">
                <div className="w-20 h-20 flex items-center justify-center mx-auto">
                  <UnfilledIcon className="h-16 w-16" color="#6B21A8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    <span className="text-purple-500">AI Lead</span> <span className="text-gray-800">Generation</span>
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto text-base mb-6">
                    Describe your ideal customer profile and let AI find the perfect leads for your business.
                  </p>
                </div>
              </div>

              {/* Example Prompts */}
              {/* <div className="max-w-2xl mx-auto">
                <div className="rounded-xl border p-6" style={{ 
                  backgroundColor: 'rgba(217, 217, 217, 0.1)',
                  border: '1px solid rgba(217, 217, 217, 0.9)',
                  borderRadius: '18px'
                }}>
                  <div className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserBulbIcon className="h-5 w-5" color="#47C7C1" style={{ margin: 0 }} />
                    <h3 className="text-base font-bold text-gray-800 m-0">Example Prompts</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Try these prompts to get started or create your own
                  </p>
                  <div className="space-y-3">
                    {examplePrompts.map((example, index) => (
                      <button
                        key={index}
                        className="w-full text-left p-4 transition-all duration-200 ease-in-out focus:outline-none"
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid rgba(0, 0, 0, 0.2)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          minHeight: '39px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = '#6B21A8';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = 'rgba(0, 0, 0, 0.2)';
                          e.target.style.boxShadow = 'none';
                        }}
                        onMouseDown={(e) => {
                          e.target.style.borderColor = '#6B21A8';
                          e.target.style.boxShadow = 'inset 0 2px 4px rgba(107, 33, 168, 0.2)';
                        }}
                        onMouseUp={(e) => {
                          e.target.style.boxShadow = 'none';
                        }}
                        onClick={() => setPrompt(example)}
                      >
                        <p className="text-sm text-gray-700 m-0">{example}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div> */}
            </div>

            {/* Loading Indicator - Above input form */}
            {isGenerating && (
              <div className="w-full px-6 mb-4">
                <div className="max-w-4xl mx-auto">
                  <div className="flex justify-center items-center py-4">
                    <div className="bg-muted p-4 rounded-lg flex items-center gap-3">
                      <div className="animate-spin">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <span>Generating leads...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Input Form - Positioned below content */}
            <div className="w-full px-6 pb-6 mt-8">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit}>
                  <div 
                    className="flex items-center justify-between w-full"
                    style={{
                      backgroundColor: '#F4F5F6',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      width: '100%'
                    }}
                  >
                    <div className="flex-1 flex items-center">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                          }
                        }}
                        placeholder="Describe your ideal leads... (e.g., 'find CTOs at Series A startups in fintech')"
                        className="flex-1 resize-none focus:outline-none border-0 bg-transparent"
                        style={{
                          fontSize: '14px',
                          color: '#374151',
                          minHeight: '40px'
                        }}
                        disabled={isGenerating}
                      />
                    </div>
                    <div 
                      className="flex-shrink-0 cursor-pointer transition-all duration-200 rounded-full p-2 hover:bg-opacity-25"
                      style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(107, 33, 168, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                      onClick={handleSubmit}
                    >
                      <img 
                        src="/download.svg" 
                        alt="Submit" 
                        style={{
                          width: '40px',
                          height: '40px'
                        }}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>


      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg border shadow-lg max-w-md w-full mx-4">
            <h3 className="font-semibold mb-4">Save Search Results</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Search Title</label>
                <input
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="Enter a title for this search..."
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  autoFocus
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedLeads.length} leads will be saved to your database.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowSaveDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveToDatabase}
                disabled={!searchTitle.trim()}
                className="flex-1"
              >
                Save to Database
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
