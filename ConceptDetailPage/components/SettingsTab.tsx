import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Settings, Trash2, Archive } from "lucide-react";
import { ParentConceptSelector } from "./ParentConceptSelector";

interface ConceptType {
  id: string;
  title: string;
  description: string;
  parentConcept: string;
  totalLearningGoals: number;
  totalRelationships: number;
  difficultyLevel: string;
}

interface SettingsTabProps {
  concept: ConceptType;
  updateConcept: (updates: Partial<ConceptType>) => void;
}



const difficultyLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" }
];

export function SettingsTab({ concept, updateConcept }: SettingsTabProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);

  const handleParentConceptChange = (newParent: string) => {
    updateConcept({ parentConcept: newParent });
  };

  const handleDifficultyChange = (newDifficulty: string) => {
    updateConcept({ difficultyLevel: newDifficulty });
  };

  const handleDeleteConcept = () => {
    console.log("Deleting concept:", concept.id);
    // In a real app, this would delete the concept and redirect
    setIsDeleteDialogOpen(false);
  };

  const handleArchiveConcept = () => {
    console.log("Archiving concept:", concept.id);
    // In a real app, this would archive the concept
    setIsArchiveDialogOpen(false);
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3>Settings</h3>
        <p className="text-muted-foreground">
          Administrative settings and actions for this concept
        </p>
      </div>

      {/* Basic Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Basic Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="parent-concept">Parent Concept</Label>
            <ParentConceptSelector 
              value={concept.parentConcept} 
              onValueChange={handleParentConceptChange}
            />
            <p className="text-sm text-muted-foreground">
              Move this concept to a different location in the hierarchy
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty-level">Difficulty Level</Label>
            <Select value={concept.difficultyLevel.toLowerCase()} onValueChange={handleDifficultyChange}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficultyLevels.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Set the appropriate difficulty level for learners
            </p>
          </div>
        </CardContent>
      </Card>



      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <AlertDialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Concept
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive this concept?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Archiving will hide this concept from the main interface but preserve all data. 
                    You can restore it later if needed. Associated learning goals and relationships 
                    will also be archived.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleArchiveConcept}>
                    Archive Concept
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-sm text-muted-foreground mt-1">
              Hide this concept while preserving all data
            </p>
          </div>

          <Separator />

          <div>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Concept
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this concept permanently?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the concept "{concept.title}" 
                    and all associated learning goals, relationships, and progress data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteConcept}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-sm text-muted-foreground mt-1">
              Permanently remove this concept and all associated data
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Concept ID:</span>
              <span className="ml-2 font-mono">{concept.id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <span className="ml-2">January 15, 2024</span>
            </div>
            <div>
              <span className="text-muted-foreground">Last Modified:</span>
              <span className="ml-2">March 8, 2024</span>
            </div>
            <div>
              <span className="text-muted-foreground">Version:</span>
              <span className="ml-2">1.3.2</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}