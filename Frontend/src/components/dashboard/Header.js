import React from 'react';
import { Menu, Users, Target, Send, Wand2 } from 'lucide-react';
import { Button } from './ui/button';
import LogoWithText from './LogoWithText';

export function Header({ onToggleSidebar, currentView }) {
  const getViewTitle = () => {
    switch (currentView) {
      case 'generate':
        return 'AI Lead Generation';
      case 'leads':
        return 'Lead Management';
      case 'campaigns':
        return 'Campaigns';
      case 'outreach':
        return 'Outreach Management';
      default:
        return 'LeadGen Pro';
    }
  };

  const getViewIcon = () => {
    switch (currentView) {
      case 'generate':
        return <Wand2 className="h-5 w-5" />;
      case 'leads':
        return <Users className="h-5 w-5" />;
      case 'campaigns':
        return <Target className="h-5 w-5" />;
      case 'outreach':
        return <Send className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 w-full">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="hover:bg-gray-100 flex-shrink-0 p-1"
        >
          <Menu className="h-5 w-5 text-purple-600" />
        </Button>
        
        <LogoWithText />
      </div>
      
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="px-4 py-1 bg-gradient-to-r from-purple-500 to-teal-500 rounded-full">
          <span className="text-xs text-white font-bold">Pro</span>
        </div>
      </div>
    </header>
  );
}
