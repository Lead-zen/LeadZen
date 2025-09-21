import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Sparkles, 
  Target, 
  Star, 
  TrendingUp, 
  BarChart3, 
  Send, 
  Database,
  Plus,
  LogOut,
  UserCheck,
  FileText,
  Shield
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { cn } from './ui/utils';

export function Sidebar({ 
  isOpen, 
  currentView, 
  onViewChange, 
  leadCount, 
  starredCount, 
  campaignCount,
  outreachCount,
  activeSequences = 0,
  totalSent = 0,
  totalOpened = 0,
  totalReplied = 0,
  userCount = 0,
  currentUserRole = 'user'
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Use the proper logout function from AuthContext
    logout();
    // Redirect to chat page
    navigate('/chat');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const leadGenItems = [
    {
      id: 'generate',
      label: 'AI Lead Gen',
      icon: Sparkles,
      count: null,
      description: 'Generate new leads'
    }
  ];

  const leadManagementItems = [
    {
      id: 'leads',
      label: 'Lead Database',
      icon: Database,
      count: leadCount,
      description: 'Manage all leads'
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      icon: Target,
      count: campaignCount,
      description: 'Organize lead campaigns'
    }
  ];

  const outreachItems = [
    {
      id: 'outreach',
      label: 'Email Sequences',
      icon: Send,
      count: outreachCount,
      description: 'Automated sequences'
    },
    {
      id: 'templates',
      label: 'Email Templates',
      icon: FileText,
      count: null,
      description: 'Reusable templates'
    }
  ];

  const analyticsItems = [
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      count: null,
      description: 'Performance insights'
    }
  ];

  const adminItems = [
    {
      id: 'users',
      label: 'User Management',
      icon: UserCheck,
      count: userCount,
      description: 'Manage team members'
    },
    {
      id: 'admin',
      label: 'Admin Dashboard',
      icon: Shield,
      count: null,
      description: 'System overview'
    }
  ];

  const renderNavSection = (title, items, gradient) => (
    <div className="space-y-2">
      <div className="px-2 py-1">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2 sm:gap-3 h-10 sm:h-12 px-2 sm:px-3 rounded-lg transition-all duration-200",
              isActive && "bg-blue-600 text-white shadow-lg border-2 border-blue-500 transform scale-[1.02]",
              !isActive && "hover:bg-accent/50 hover:scale-[1.01]"
            )}
            onClick={() => onViewChange(item.id)}
          >
            <div className={cn(
              "h-6 w-6 sm:h-8 sm:w-8 rounded-md flex items-center justify-center transition-colors flex-shrink-0",
              isActive 
                ? "bg-white/20" 
                : gradient || "bg-muted"
            )}>
              <Icon className={cn(
                "h-3 w-3 sm:h-4 sm:w-4",
                isActive ? "text-white" : "text-foreground"
              )} />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className={cn(
                "text-xs sm:text-sm font-medium truncate",
                isActive ? "text-white" : "text-foreground"
              )}>
                {item.label}
              </div>
              <div className={cn(
                "text-xs hidden sm:block truncate",
                isActive ? "text-white/80" : "text-muted-foreground"
              )}>
                {item.description}
              </div>
            </div>
            {item.count !== null && item.count > 0 && (
              <Badge 
                variant={isActive ? "secondary" : "outline"} 
                className={cn(
                  "ml-auto text-xs",
                  isActive && "bg-white/20 text-white border-white/30"
                )}
              >
                {item.count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );



  return (
    <aside 
      className={cn(
        "bg-card border-r border-border transition-all duration-300 flex flex-col shadow-sm",
        isOpen ? "w-72 sm:w-72" : "w-0 opacity-0",
        "fixed sm:relative z-40 h-full sm:h-auto"
      )}
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-foreground text-sm sm:text-base truncate">LeadGen Pro</h2>
            <p className="text-xs text-muted-foreground hidden sm:block">AI-Powered Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 sm:px-4 py-4">
        <div className="space-y-4 sm:space-y-6">
          {renderNavSection("Lead Generation", leadGenItems, "bg-gradient-to-br from-blue-500/10 to-purple-500/10")}
          
          <Separator className="my-4" />
          
          {renderNavSection("Lead Management", leadManagementItems, "bg-gradient-to-br from-green-500/10 to-emerald-500/10")}
          
          <Separator className="my-4" />
          
          {renderNavSection("Outreach & Email", outreachItems, "bg-gradient-to-br from-orange-500/10 to-red-500/10")}
          
          <Separator className="my-4" />
          
          {renderNavSection("Analytics", analyticsItems, "bg-gradient-to-br from-purple-500/10 to-pink-500/10")}
          
          {(currentUserRole === 'admin' || currentUserRole === 'manager') && (
            <>
              <Separator className="my-4" />
              {renderNavSection("Administration", adminItems, "bg-gradient-to-br from-red-500/10 to-pink-500/10")}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-3 sm:p-4 border-t border-border">
        <div className="space-y-2 sm:space-y-3">
          {/* Active Starred Leads Alert */}
          {starredCount > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-2 sm:p-3">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 fill-amber-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-amber-800 truncate">Ready for Campaign</span>
              </div>
              <p className="text-xs text-amber-700 mb-1 sm:mb-2 hidden sm:block">
                {starredCount} starred leads ready
              </p>
              <Button 
                size="sm" 
                className="w-full h-7 sm:h-8 bg-amber-600 hover:bg-amber-700 text-white text-xs"
                onClick={() => onViewChange('leads')}
              >
                <Plus className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Create Campaign</span>
                <span className="sm:hidden">Campaign</span>
              </Button>
            </div>
          )}


          {/* Logout Button */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300 h-7 sm:h-8 text-xs"
              onClick={handleLogout}
            >
              <LogOut className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Confirm Logout</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Are you sure you want to logout? You will be redirected to the chat interface.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={cancelLogout}
              >
                No, Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmLogout}
              >
                Yes, Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}