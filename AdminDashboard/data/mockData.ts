import { DomainStats, PlatformStats } from '../types/dashboard';

export const mockDomains: DomainStats[] = [
  {
    id: '1',
    name: 'Mathematics',
    description: 'Core mathematical concepts from basic arithmetic to advanced calculus',
    concepts: 245,
    learningGoals: 89,
    exercises: 1456,
    lastUpdated: '2024-12-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Computer Science',
    description: 'Programming, algorithms, data structures, and software engineering',
    concepts: 189,
    learningGoals: 67,
    exercises: 892,
    lastUpdated: '2024-12-14',
    status: 'active'
  },
  {
    id: '3',
    name: 'Physics',
    description: 'Classical and modern physics principles and applications',
    concepts: 156,
    learningGoals: 54,
    exercises: 734,
    lastUpdated: '2024-12-13',
    status: 'active'
  },
  {
    id: '4',
    name: 'Chemistry',
    description: 'Chemical principles, reactions, and laboratory techniques',
    concepts: 198,
    learningGoals: 72,
    exercises: 658,
    lastUpdated: '2024-12-12',
    status: 'active'
  },
  {
    id: '5',
    name: 'Biology',
    description: 'Life sciences covering cellular biology to ecosystems',
    concepts: 223,
    learningGoals: 81,
    exercises: 745,
    lastUpdated: '2024-12-11',
    status: 'active'
  },
  {
    id: '6',
    name: 'History',
    description: 'World history from ancient civilizations to modern times',
    concepts: 167,
    learningGoals: 58,
    exercises: 423,
    lastUpdated: '2024-12-10',
    status: 'draft'
  },
  {
    id: '7',
    name: 'Literature',
    description: 'Classic and contemporary literature analysis and writing',
    concepts: 134,
    learningGoals: 45,
    exercises: 367,
    lastUpdated: '2024-12-09',
    status: 'active'
  },
  {
    id: '8',
    name: 'Economics',
    description: 'Microeconomics and macroeconomics principles',
    concepts: 89,
    learningGoals: 32,
    exercises: 234,
    lastUpdated: '2024-12-08',
    status: 'draft'
  }
];

export const calculatePlatformStats = (domains: DomainStats[]): PlatformStats => {
  return {
    totalDomains: domains.length,
    totalConcepts: domains.reduce((sum, domain) => sum + domain.concepts, 0),
    totalLearningGoals: domains.reduce((sum, domain) => sum + domain.learningGoals, 0),
    totalExercises: domains.reduce((sum, domain) => sum + domain.exercises, 0)
  };
};