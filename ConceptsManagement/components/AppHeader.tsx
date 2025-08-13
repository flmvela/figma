import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Menu, Search } from "lucide-react";

export function AppHeader() {
  return (
    <div className="h-14 bg-white border-b border-border flex items-center justify-between px-4">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="p-2">
          <Menu className="h-4 w-4" />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-base font-medium leading-none">Gemeos</h1>
          <p className="text-xs text-muted-foreground leading-none mt-0.5">Learning Domain Management</p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          <span>Search Chen</span>
          <span className="text-xs">sarah.chen@gemeos.edu</span>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            SC
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}