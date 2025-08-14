import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, CheckCircle, XCircle, Edit, Trash2, Sparkles, BookOpen, Filter, Flag, AlertTriangle } from "lucide-react";

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  sequence: number;
}

const mockGoals: LearningGoal[] = [
  {
    id: "1",
    title: "Understand major and minor scales",
    description: "Learn the pattern of whole and half steps that create major and minor scales, and be able to construct them starting from any note.",
    status: "approved",
    createdAt: "2024-01-15",
    sequence: 1
  },
  {
    id: "2",
    title: "Identify intervals by ear",
    description: "Develop the ability to recognize perfect fifths, major thirds, minor thirds, and other common intervals through ear training exercises.",
    status: "approved",
    createdAt: "2024-01-14",
    sequence: 2
  },
  {
    id: "3",
    title: "Build basic triads",
    description: "Construct major, minor, diminished, and augmented triads using the proper intervals and note relationships.",
    status: "pending",
    createdAt: "2024-01-13",
    sequence: 3
  },
  {
    id: "4",
    title: "Analyze chord progressions",
    description: "Recognize and analyze common chord progressions like I-V-vi-IV and understand their harmonic function.",
    status: "pending",
    createdAt: "2024-01-12",
    sequence: 4
  }
];

interface LearningGoalsTabProps {
  conceptId: string;
}

export function LearningGoalsTab({ conceptId }: LearningGoalsTabProps) {
  const [goals, setGoals] = useState(mockGoals);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("approved");

  const handleApprove = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, status: 'approved' as const } : goal
    ));
  };

  const handleReject = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, status: 'rejected' as const } : goal
    ));
  };

  const handleDelete = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const handleGenerateGoals = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const newGoal: LearningGoal = {
        id: Date.now().toString(),
        title: "Master circle of fifths",
        description: "Understand and memorize the circle of fifths to quickly identify key signatures and relationships between keys.",
        status: "pending",
        createdAt: new Date().toISOString().split('T')[0],
        sequence: goals.length + 1
      };
      setGoals(prev => [newGoal, ...prev]);
      setIsGenerating(false);
    }, 2000);
  };

  const getStatusFlagColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredGoals = filterStatus === "all" 
    ? goals 
    : goals.filter(goal => goal.status === filterStatus);

  const hasPendingGoals = goals.some(goal => goal.status === 'pending');

  const handleShowSuggested = () => {
    setFilterStatus("pending");
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h3>Learning Goals</h3>
            <p className="text-muted-foreground">
              Manage and organize learning objectives for this concept
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              {hasPendingGoals && filterStatus !== "pending" && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleShowSuggested}
                      className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View suggested goals</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleGenerateGoals} 
                  disabled={isGenerating}
                  size="icon"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isGenerating ? "Generating..." : "Generate goals"}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add manual goal</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {filteredGoals.map((goal, index) => (
          <Card key={goal.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Flag className={`h-4 w-4 ${getStatusFlagColor(goal.status)}`} />
                    </div>
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                      #{goal.sequence}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Created: {goal.createdAt}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(goal.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground mb-4">{goal.description}</p>
              
              {goal.status === 'pending' && (
                <>
                  <Separator className="mb-4" />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApprove(goal.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleReject(goal.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          ))}
        </div>

        {filteredGoals.length === 0 && filterStatus !== "all" && (
          <Card className="p-8 text-center">
            <CardContent>
              <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No goals found</h3>
              <p className="text-muted-foreground mb-4">
                No learning goals match the selected filter criteria
              </p>
              <Button variant="outline" onClick={() => setFilterStatus("approved")}>
                Show approved goals
              </Button>
            </CardContent>
          </Card>
        )}

        {goals.length === 0 && (
          <Card className="p-8 text-center">
            <CardContent>
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No learning goals yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by generating goals or adding them manually
              </p>
              <Button onClick={handleGenerateGoals}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Goals
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}