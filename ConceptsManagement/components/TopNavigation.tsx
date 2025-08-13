import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Menu } from 'lucide-react';

export function TopNavigation() {
  return (
    <div className="w-full border-b bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left section - Menu and Branding */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </Button>
          
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-foreground">Gemeos</h1>
            <p className="text-sm text-muted-foreground">Learning Domain Management</p>
          </div>
        </div>

        {/* Right section - User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Sarah Chen</p>
            <p className="text-xs text-muted-foreground">sarah.chen@gemeos.edu</p>
          </div>
          
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              SC
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}