import React from 'react';
import { Menu, Sparkles, Users, Target, Send } from 'lucide-react';
import { Button } from './ui/button';

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
        return <Sparkles className="h-5 w-5" />;
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
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 w-full">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="hover:bg-accent flex-shrink-0"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex-shrink-0">
            {getViewIcon()}
          </div>
          <h1 className="font-semibold text-foreground truncate text-sm sm:text-base">{getViewTitle()}</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="px-2 sm:px-3 py-1 bg-primary/10 rounded-full">
          <span className="text-xs sm:text-sm text-primary font-medium">Pro</span>
        </div>
      </div>
    </header>
  );
}
