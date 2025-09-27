import React, { useState } from 'react';
import { 
  Send, Sparkles, Lightbulb, CheckCircle, MessageSquare, 
  Save, Mail, Phone, ExternalLink 
} from 'lucide-react';
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
        <div className="p-3 sm:p-4 bg-card border-b border-border">
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
                className="gap-2 w-full sm:w-auto"
              >
                <MessageSquare className="h-4 w-4" />
                New Search
              </Button>
              <Button
                onClick={handleSaveSelected}
                disabled={selectedLeads.length === 0}
                className="gap-2 w-full sm:w-auto"
              >
                <Save className="h-4 w-4" />
                Save Selected ({selectedLeads.length})
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto w-full">
        {/* Chat history */}
        {chatHistory.length > 0 && (
          <div className="max-w-3xl mx-auto mb-6 space-y-3">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-3 rounded-lg max-w-lg",
                  msg.role === "user"
                    ? "bg-blue-500/10 text-blue-900 ml-auto"
                    : "bg-muted text-foreground mr-auto"
                )}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}
          </div>
        )}

        {stagedLeads.length === 0 ? (
          <div className="relative h-full">
            <div className="max-w-4xl mx-auto space-y-8 w-full px-6 py-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-3 text-gray-800">AI Lead Generation</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto text-base">
                    Describe your ideal customer profile and let AI find the perfect leads for your business.
                  </p>
                </div>
              </div>

              {/* Example Prompts */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="h-3 w-3 text-blue-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-800">Example Prompts</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Try these prompts to get started or create your own
                </p>
                <div className="space-y-3">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-4 rounded-lg border border-gray-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-200 transition-all duration-200 group"
                      onClick={() => setPrompt(example)}
                    >
                      <p className="text-sm text-gray-600 group-hover:text-gray-800">{example}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Form - Fixed at bottom of screen */}
            <div className="absolute bottom-0 left-0 right-0 w-full px-6 pb-6">
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit}>
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your ideal leads... (e.g., 'find CTOs at Series A startups in fintech')"
                      className="w-full min-h-[60px] p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      disabled={isGenerating}
                    />
                    <div className="absolute bottom-4 right-4">
                      <Button
                        type="submit"
                        disabled={!prompt.trim() || isGenerating}
                        className="bg-purple-500 hover:bg-purple-600 text-white w-10 h-10 rounded-full shadow-sm"
                      >
                        {isGenerating ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-4 w-full">
            {/* Results table */}
            <div className="bg-card rounded-lg border w-full">
              <div className="p-3 sm:p-4 border-b border-border">
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

        {isGenerating && (
          <div className="flex justify-center items-center py-12">
            <div className="bg-muted p-6 rounded-lg flex items-center gap-3">
              <div className="animate-spin">
                <Sparkles className="h-5 w-5" />
              </div>
              <span>Generating leads...</span>
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
