import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  Plus, 
  Menu, 
  Settings,
  BarChart3,
  BookOpen,
  Target,
  PenTool,
  Calendar,
  ChevronDown
} from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AdminDashboardProps {
  user: any;
  onSignOut: () => void;
}

interface DomainStats {
  concepts: number;
  goals: number;
  exercises: number;
  conceptsColor: string;
  goalsColor: string;
  exercisesColor: string;
}

interface Domain {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Draft';
  lastUpdated: string;
  stats: DomainStats;
}

export function AdminDashboard({ user, onSignOut }: AdminDashboardProps) {
  // Mock data matching your Figma design
  const overviewStats = [
    {
      title: "Total Domains",
      value: "8",
      subtitle: "Active learning domains",
      icon: BookOpen
    },
    {
      title: "Total Concepts",
      value: "1,401",
      subtitle: "Learning concepts across all domains",
      icon: Target
    },
    {
      title: "Learning Goals",
      value: "498",
      subtitle: "Defined learning objectives",
      icon: Target
    },
    {
      title: "Total Exercises",
      value: "5,509",
      subtitle: "Practice exercises available",
      icon: PenTool
    }
  ];

  const domains: Domain[] = [
    {
      id: "biology",
      name: "Biology",
      description: "Life sciences covering cellular biology to ecosystems",
      status: "Active",
      lastUpdated: "11.12.2024",
      stats: {
        concepts: 223,
        goals: 81,
        exercises: 745,
        conceptsColor: "text-learning-blue",
        goalsColor: "text-learning-emerald",
        exercisesColor: "text-purple-600"
      }
    },
    {
      id: "chemistry",
      name: "Chemistry",
      description: "Chemical principles, reactions, and laboratory techniques",
      status: "Active",
      lastUpdated: "12.12.2024",
      stats: {
        concepts: 198,
        goals: 72,
        exercises: 658,
        conceptsColor: "text-learning-blue",
        goalsColor: "text-learning-emerald",
        exercisesColor: "text-purple-600"
      }
    },
    {
      id: "computer-science",
      name: "Computer Science",
      description: "Programming, algorithms, data structures, and software engineering",
      status: "Active",
      lastUpdated: "14.12.2024",
      stats: {
        concepts: 189,
        goals: 67,
        exercises: 892,
        conceptsColor: "text-learning-blue",
        goalsColor: "text-learning-emerald",
        exercisesColor: "text-purple-600"
      }
    },
    {
      id: "economics",
      name: "Economics",
      description: "Microeconomics and macroeconomics principles",
      status: "Draft",
      lastUpdated: "8.12.2024",
      stats: {
        concepts: 89,
        goals: 32,
        exercises: 234,
        conceptsColor: "text-learning-blue",
        goalsColor: "text-learning-emerald",
        exercisesColor: "text-purple-600"
      }
    },
    {
      id: "history",
      name: "History",
      description: "World history from ancient civilizations to modern times",
      status: "Draft",
      lastUpdated: "10.12.2024",
      stats: {
        concepts: 167,
        goals: 58,
        exercises: 423,
        conceptsColor: "text-learning-blue",
        goalsColor: "text-learning-emerald",
        exercisesColor: "text-purple-600"
      }
    },
    {
      id: "literature",
      name: "Literature",
      description: "Classic and contemporary literature analysis and writing",
      status: "Active",
      lastUpdated: "9.12.2024",
      stats: {
        concepts: 134,
        goals: 45,
        exercises: 367,
        conceptsColor: "text-learning-blue",
        goalsColor: "text-learning-emerald",
        exercisesColor: "text-purple-600"
      }
    },
    {
      id: "mathematics",
      name: "Mathematics",
      description: "Core mathematical concepts from basic arithmetic to advanced calculus",
      status: "Active",
      lastUpdated: "15.12.2024",
      stats: {
        concepts: 245,
        goals: 89,
        exercises: 1456,
        conceptsColor: "text-learning-blue",
        goalsColor: "text-learning-emerald",
        exercisesColor: "text-purple-600"
      }
    },
    {
      id: "physics",
      name: "Physics",
      description: "Classical and modern physics principles and applications",
      status: "Active",
      lastUpdated: "13.12.2024",
      stats: {
        concepts: 156,
        goals: 54,
        exercises: 734,
        conceptsColor: "text-learning-blue",
        goalsColor: "text-learning-emerald",
        exercisesColor: "text-purple-600"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="p-1">
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-black rounded-lg p-2">
                <div className="text-white text-sm font-semibold">G</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Gemeos</div>
                <div className="text-sm text-gray-500">Learning Domain Management</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">Sarah Chen</div>
              <div className="text-xs text-gray-500">sarah.chen@gemeos.edu</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1">
                  <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">SC</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Platform Overview */}
        <section className="mb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Platform Overview</h1>
            <p className="text-gray-600">Get a high-level view of your educational platform's content and performance metrics.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                      <IconComponent className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 mb-1">{stat.value}</div>
                    <p className="text-sm text-gray-500">{stat.subtitle}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Learning Domains */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Learning Domains</h2>
              <p className="text-gray-600">Manage your learning domains, view their statistics, and access detailed management tools.</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search domains..." 
                  className="pl-10 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    All Stat
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All Status</DropdownMenuItem>
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>Draft</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="text-sm text-gray-600">Name</div>
            </div>
            
            <Button className="gap-2 bg-black hover:bg-gray-800">
              <Plus className="h-4 w-4" />
              Create New Domain
            </Button>
          </div>

          {/* Domains Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain) => (
              <Card key={domain.id} className="bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {domain.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {domain.description}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={domain.status === 'Active' ? 'default' : 'secondary'}
                      className={domain.status === 'Active' 
                        ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                      }
                    >
                      {domain.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className={`text-2xl font-semibold ${domain.stats.conceptsColor}`}>
                        {domain.stats.concepts}
                      </div>
                      <div className="text-xs text-gray-500">Concepts</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-semibold ${domain.stats.goalsColor}`}>
                        {domain.stats.goals}
                      </div>
                      <div className="text-xs text-gray-500">Goals</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-semibold ${domain.stats.exercisesColor}`}>
                        {domain.stats.exercises}
                      </div>
                      <div className="text-xs text-gray-500">Exercises</div>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    Last updated: {domain.lastUpdated}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Settings className="h-3 w-3" />
                      Manage
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <BarChart3 className="h-3 w-3" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}