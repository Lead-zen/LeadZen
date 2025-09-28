import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Star, 
  Plus,
  LogOut
} from 'lucide-react';
import { MagicStickIcon } from './icons/MagicStickIcon';
import { LayersIcon } from './icons/LayersIcon';
import { BullseyeIcon } from './icons/BullseyeIcon';
import { EmailIcon } from './icons/EmailIcon';
import { EmailMailIcon } from './icons/EmailMailIcon';
import { AnalyticsIcon } from './icons/AnalyticsIcon';
import { UsersOutlineIcon } from './icons/UsersOutlineIcon';
import { ShieldIcon } from './icons/ShieldIcon';
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
      icon: MagicStickIcon,
      count: null,
      description: 'Generate new leads'
    }
  ];

  const leadManagementItems = [
    {
      id: 'leads',
      label: 'Lead Database',
      icon: LayersIcon,
      count: leadCount,
      description: 'Manage all leads'
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      icon: BullseyeIcon,
      count: campaignCount,
      description: 'Organize lead campaigns'
    }
  ];

  const outreachItems = [
    {
      id: 'outreach',
      label: 'Email Sequences',
      icon: EmailIcon,
      count: outreachCount,
      description: 'Automated sequences'
    },
    {
      id: 'templates',
      label: 'Email Templates',
      icon: EmailMailIcon,
      count: null,
      description: 'Reusable templates'
    }
  ];

  const analyticsItems = [
    {
      id: 'analytics',
      label: 'Analytics',
      icon: AnalyticsIcon,
      count: null,
      description: 'Performance insights'
    }
  ];

  const adminItems = [
    {
      id: 'users',
      label: 'User Management',
      icon: UsersOutlineIcon,
      count: userCount,
      description: 'Manage team members'
    },
    {
      id: 'admin',
      label: 'Admin Dashboard',
      icon: ShieldIcon,
      count: null,
      description: 'System overview'
    }
  ];

  const renderNavSection = (title, items, gradient) => (
    <div className="space-y-1">
      <div className="px-0 py-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-auto px-3 py-2 rounded-xl transition-all duration-200 relative border",
              isActive && "!bg-[#EDE9FE] border-purple-200 text-[#6B21A8]",
              !isActive && "hover:bg-[#E0F2FE] hover:border-blue-200 text-gray-700 border-transparent",
              "hover:bg-[#E0F2FE] hover:border-blue-200"
            )}
            onClick={() => onViewChange(item.id)}
          >
            <Icon 
              className="h-5 w-5 flex-shrink-0"
              color={isActive ? "#6B21A8" : "#6B21A8"}
            />
            <div className="flex-1 text-left min-w-0">
              <div className={cn(
                "text-sm font-semibold truncate",
                isActive ? "text-[#6B21A8]" : "text-gray-800"
              )}>
                {item.label}
              </div>
              <div className={cn(
                "text-xs truncate mt-0.5",
                isActive ? "text-[#6B21A8]" : "text-gray-600"
              )}>
                {item.description}
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );



  return (
    <aside 
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm",
        isOpen ? "w-64 sm:w-64" : "w-0 opacity-0",
        "fixed sm:relative z-40 h-full sm:h-auto"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-start">
          <img 
            src="/Full logo.png" 
            alt="LeadGen Pro" 
            className="h-12 w-auto object-contain"
          />
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-4">
          {renderNavSection("LEAD GENERATION", leadGenItems, "bg-gradient-to-br from-blue-500/10 to-purple-500/10")}
          
          {renderNavSection("LEAD MANAGEMENT", leadManagementItems, "bg-gradient-to-br from-green-500/10 to-emerald-500/10")}
          
          {renderNavSection("OUTREACH & EMAIL", outreachItems, "bg-gradient-to-br from-blue-500/10 to-cyan-500/10")}
          
          {renderNavSection("ANALYTICS", analyticsItems, "bg-gradient-to-br from-purple-500/10 to-pink-500/10")}
          
          {(currentUserRole === 'admin' || currentUserRole === 'manager') && (
            <>
              {renderNavSection("ADMINISTRATION", adminItems, "bg-gradient-to-br from-red-500/10 to-pink-500/10")}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-2 sm:p-3 border-t border-border">
        <div className="space-y-1 sm:space-y-2">
          {/* Active Starred Leads Alert */}
          {starredCount > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-2 sm:p-3">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 fill-blue-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-blue-800 truncate">Ready for Campaign</span>
              </div>
              <p className="text-xs text-blue-700 mb-1 sm:mb-2 hidden sm:block">
                {starredCount} starred leads ready
              </p>
              <Button 
                size="sm" 
                className="w-full h-7 sm:h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs"
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
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-sm w-full shadow-2xl border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Confirm Logout</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Are you sure you want to logout? You will be redirected to the chat interface.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                onClick={cancelLogout}
              >
                No, Cancel
              </Button>
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white border-0"
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