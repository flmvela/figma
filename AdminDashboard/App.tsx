import { useState } from "react";
import { StatsOverview } from "./components/StatsOverview";
import { DomainList } from "./components/DomainList";
import { Header } from "./components/Header";
import { NavigationOverlay } from "./components/NavigationOverlay";
import { mockDomains, calculatePlatformStats } from "./data/mockData";
import { mockUser, navigationItems } from "./data/mockUser";

export default function App() {
  const [domains] = useState(mockDomains);
  const [currentPage, setCurrentPage] = useState('/dashboard');
  const platformStats = calculatePlatformStats(domains);

  const handleCreateNewDomain = () => {
    console.log("Creating new domain...");
    // In a real app, this would navigate to a domain creation page
    alert("Navigation to domain creation page would happen here");
  };

  const handleManageDomain = (domainId: string) => {
    console.log("Managing domain:", domainId);
    // In a real app, this would navigate to the domain management page
    alert(`Navigation to manage domain ${domainId} would happen here`);
  };

  const handleViewAnalytics = (domainId: string) => {
    console.log("Viewing analytics for domain:", domainId);
    // In a real app, this would navigate to the analytics page
    alert(`Navigation to analytics for domain ${domainId} would happen here`);
  };

  const handleNavigation = (href: string) => {
    console.log("Navigating to:", href);
    setCurrentPage(href);
    // In a real app, this would use a router to navigate
    if (href !== '/dashboard') {
      alert(`Navigation to ${href} would happen here`);
    }
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case '/dashboard':
      default:
        return (
          <main className="container mx-auto px-6 py-8 space-y-8">
            {/* Platform Statistics */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Platform Overview</h2>
                <p className="text-muted-foreground">
                  Get a high-level view of your educational platform's content and performance metrics.
                </p>
              </div>
              <StatsOverview stats={platformStats} />
            </section>

            {/* Domain Management */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Learning Domains</h2>
                <p className="text-muted-foreground">
                  Manage your learning domains, view their statistics, and access detailed management tools.
                </p>
              </div>
              <DomainList
                domains={domains}
                onCreateNew={handleCreateNewDomain}
                onManageDomain={handleManageDomain}
                onViewAnalytics={handleViewAnalytics}
              />
            </section>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={mockUser}
        onNavigate={handleNavigation}
      />
      <NavigationOverlay 
        navigationItems={navigationItems}
        onNavigate={handleNavigation}
      />
      {renderPageContent()}
    </div>
  );
}