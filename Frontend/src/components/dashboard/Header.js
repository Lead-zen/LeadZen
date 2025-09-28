import React from 'react';
import { Menu, Users, Target, Send } from 'lucide-react';
import { Button } from './ui/button';
import LogoWithText from './LogoWithText';
import { MagicStickIcon } from './icons/MagicStickIcon';

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
        return <MagicStickIcon className="h-5 w-5" color="white" />;
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
    <header className="h-12 border-b border-gray-200 bg-white flex items-center justify-between px-4 w-full">
      <div className="flex items-center gap-3 min-w-0 flex-1" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onToggleSidebar}
          className="hover:bg-gray-100 flex-shrink-0 p-1 rounded-md flex items-center justify-center m-0"
        >
          <Menu className="h-4 w-4 text-purple-600 m-0" />
        </button>
        
        <MagicStickIcon className="h-5 w-5" color="#6B21A8" style={{ margin: 0 }} />
        <span className="text-sm font-semibold text-gray-800 m-0">{getViewTitle()}</span>
      </div>
      
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="px-3 py-1 rounded-full text-center" style={{ 
          background: 'linear-gradient(90deg, #6B21A8 0%, #14B8A6 100%)',
          minWidth: '50px'
        }}>
          <span className="text-xs text-white font-bold">Pro</span>
        </div>
      </div>
    </header>
  );
}
