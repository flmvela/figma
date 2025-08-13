export interface DomainStats {
  id: string;
  name: string;
  description: string;
  concepts: number;
  learningGoals: number;
  exercises: number;
  lastUpdated: string;
  status: 'active' | 'draft' | 'archived';
}

export interface PlatformStats {
  totalDomains: number;
  totalConcepts: number;
  totalLearningGoals: number;
  totalExercises: number;
}