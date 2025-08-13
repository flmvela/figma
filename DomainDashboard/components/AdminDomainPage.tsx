import { 
  BookOpen, 
  Target, 
  ClipboardList, 
  CheckSquare, 
  Lightbulb, 
  Bot, 
  Upload, 
  Trophy, 
  Heart 
} from "lucide-react";
import { Breadcrumb } from "./Breadcrumb";
import { FeatureCard } from "./FeatureCard";

interface AdminDomainPageProps {
  domainName: string;
}

export function AdminDomainPage({ domainName }: AdminDomainPageProps) {
  // Mock data for the dashboard
  const mockData = {
    conceptsCount: 74,
    goalsCount: 28,
    tasksCount: 15,
    strategiesCount: 8
  };

  const breadcrumbItems = [
    { label: "Admin Dashboard", href: "/admin" },
    { label: domainName }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="mb-8">
          <h1 className="text-3xl mb-2">{domainName}</h1>
          <p className="text-muted-foreground">
            Manage all aspects of your learning domain from this control center
          </p>
        </div>

        {/* Learning Setup & Content Management */}
        <section className="mb-8">
          <h2 className="text-xl mb-4 text-muted-foreground">Learning Setup & Content Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <FeatureCard
              title="Learning Concepts"
              description="Number of concepts in the domain; manage concepts and relationships."
              icon={BookOpen}
              count={mockData.conceptsCount}
              onClick={() => console.log('Navigate to Learning Concepts')}
            />
            <FeatureCard
              title="Learning Goals"
              description="Number of learning objectives; define and organize them."
              icon={Target}
              count={mockData.goalsCount}
              onClick={() => console.log('Navigate to Learning Goals')}
            />
            <FeatureCard
              title="Exercises"
              description="Create and manage practice activities."
              icon={ClipboardList}
              comingSoon={true}
              onClick={() => console.log('Exercises coming soon')}
            />
            <FeatureCard
              title="Tasks"
              description="Manage types of tasks used in this domain."
              icon={CheckSquare}
              count={mockData.tasksCount}
              onClick={() => console.log('Navigate to Tasks')}
            />
            <FeatureCard
              title="Strategies"
              description="Define learning strategies and methodologies for this domain."
              icon={Lightbulb}
              count={mockData.strategiesCount}
              onClick={() => console.log('Navigate to Strategies')}
            />
          </div>
        </section>

        {/* Intelligent Assistance & Teacher Tools */}
        <section className="mb-8">
          <h2 className="text-xl mb-4 text-muted-foreground">Intelligent Assistance & Teacher Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <FeatureCard
              title="Train the AI"
              description="Train the AI (your digital twin) to support teaching and content creation."
              icon={Bot}
              highlighted={true}
              onClick={() => console.log('Navigate to AI Training')}
            />
            <FeatureCard
              title="Upload Data"
              description="Upload and manage learning materials, datasets, and resources for AI training and content delivery."
              icon={Upload}
              onClick={() => console.log('Navigate to Upload Data')}
            />
          </div>
        </section>

        {/* Motivation & Engagement */}
        <section>
          <h2 className="text-xl mb-4 text-muted-foreground">Motivation & Engagement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              title="Gamification"
              description="Add game elements to boost learning motivation."
              icon={Trophy}
              comingSoon={true}
              onClick={() => console.log('Gamification coming soon')}
            />
            <FeatureCard
              title="Motivation"
              description="Tools to track and boost learner engagement."
              icon={Heart}
              comingSoon={true}
              onClick={() => console.log('Motivation tools coming soon')}
            />
          </div>
        </section>
      </div>
    </div>
  );
}