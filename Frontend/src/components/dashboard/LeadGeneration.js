import React, { useState } from 'react';
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

export function LeadGeneration({ 
  onLeadsGenerated, 
  stagedLeads, 
  onStageLeads, 
  onMoveStagedLeadsToDatabase, 
  onStartNewChat 
}) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // ✅ new

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
      const generatedLeads = (response.leads || []).map((lead, index) => ({
        id: lead.id || `${lead.business_name}-${index}`,
        company: lead.business_name,
        email: lead.email || lead.contact_number || '',
        phone: lead.contact_number,
        linkedinUrl: lead.website && lead.website.startsWith("http") ? lead.website : null,
        industry: lead.industry,
        location: lead.address,
        description: lead.summary || '',
        score: lead.lead_score || 0,
        chatTitle: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : '')
      }));

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
        <div className="bg-card border-b border-border">
          <div className="p-2 sm:p-3">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Search Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Found {stagedLeads.length} leads • {selectedLeads.length} selected
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button
                variant="outline"
                onClick={handleNewSearch}
                className="gap-2 w-full sm:w-auto hover:bg-[#E0F2FE] hover:border-blue-300"
              >
                <MessageSquare className="h-4 w-4" />
                New Search
              </Button>
              <Button
                onClick={handleSaveSelected}
                disabled={selectedLeads.length === 0}
                className="gap-2 w-full sm:w-auto text-white"
              >
                <Save className="h-4 w-4" />
                Save Selected ({selectedLeads.length})
              </Button>
              </div>
            </div>
          </div>
          
          {/* Chat history - directly under header */}
          {chatHistory.length > 0 && (
            <div className="px-3 pb-3">
              <div className="max-w-3xl mx-auto space-y-2">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-2 rounded-lg max-w-lg",
                      msg.role === "user"
                        ? "bg-[#E0F2FE] text-gray-800 ml-auto rounded-br-sm"
                        : "bg-gray-100 text-gray-800 mr-auto rounded-bl-sm border border-gray-200"
                    )}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto w-full">
        {stagedLeads.length === 0 ? (
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
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your ideal leads... (e.g., 'find CTOs at Series A startups in fintech')"
                      className="flex-1 resize-none focus:outline-none border-0 bg-transparent"
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                        minHeight: '40px'
                      }}
                      disabled={isGenerating}
                    />
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
        ) : (
          <div className="w-full">
            {/* Results table - directly under header */}
            <div className="bg-card rounded-lg border w-full">
              <div className="p-2 sm:p-3 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h3 className="font-semibold">Generated Leads</h3>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllLeads}
                      className="w-full sm:w-auto"
                    >
                      {selectedLeads.length === stagedLeads.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b">
                      <th className="w-12 p-2 sm:p-4">
                        <input
                          type="checkbox"
                          checked={selectedLeads.length === stagedLeads.length && stagedLeads.length > 0}
                          onChange={selectAllLeads}
                          className="rounded"
                        />
                      </th>
                      <th className="text-left p-2 sm:p-4 font-medium min-w-[120px]">Company</th>
                      <th className="text-left p-2 sm:p-4 font-medium min-w-[100px] hidden md:table-cell">Industry</th>
                      <th className="text-left p-2 sm:p-4 font-medium w-16">Score</th>
                      <th className="text-left p-2 sm:p-4 font-medium w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stagedLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className={cn(
                          "hover:bg-muted/50 cursor-pointer border-b",
                          selectedLeads.includes(lead.id) && "bg-muted/30"
                        )}
                        onClick={() => toggleLeadSelection(lead.id)}
                      >
                        <td className="p-2 sm:p-4">
                          <input
                            type="checkbox"
                            checked={selectedLeads.includes(lead.id)}
                            onChange={() => toggleLeadSelection(lead.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="p-2 sm:p-4 min-w-[120px]">
                          <div>
                            <div className="font-medium truncate">{lead.company}</div>
                            <div className="text-xs text-muted-foreground truncate">{lead.location}</div>
                          </div>
                        </td>
                        <td className="p-2 sm:p-4 min-w-[100px] hidden md:table-cell">
                          <Badge variant="outline" className="text-xs truncate">
                            {lead.industry}
                          </Badge>
                        </td>
                        <td className="p-2 sm:p-4 w-16">
                          <Badge 
                            variant={lead.score >= 90 ? "default" : lead.score >= 75 ? "secondary" : "outline"}
                            className="font-medium"
                          >
                            {lead.score}
                          </Badge>
                        </td>
                        <td className="p-2 sm:p-4 w-20">
                          <div className="flex items-center gap-1">
                            {lead.email && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`mailto:${lead.email}`, '_blank');
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Mail className="h-4 w-4" />
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
                                className="h-8 w-8 p-0"
                              >
                                <Phone className="h-4 w-4" />
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
                                className="h-8 w-8 p-0"
                              >
                                <ExternalLink className="h-4 w-4" />
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
