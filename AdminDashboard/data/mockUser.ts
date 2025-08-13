import { User, NavigationItem } from '../types/user';
import { 
  LayoutDashboard, 
  Database, 
  BarChart3, 
  Users, 
  Settings, 
  FileText,
  GraduationCap,
  BookOpen,
  Target
} from 'lucide-react';

export const mockUser: User = {
  id: '1',
  name: 'Sarah Chen',
  email: 'sarah.chen@gemeos.edu',
  role: 'Administrator'
};

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Platform overview and statistics'
  },
  {
    id: 'domains',
    label: 'Learning Domains',
    href: '/domains',
    icon: Database,
    description: 'Manage learning domains'
  },
  {
    id: 'concepts',
    label: 'Concepts',
    href: '/concepts',
    icon: BookOpen,
    description: 'Manage learning concepts'
  },
  {
    id: 'goals',
    label: 'Learning Goals',
    href: '/goals',
    icon: Target,
    description: 'Define learning objectives'
  },
  {
    id: 'exercises',
    label: 'Exercises',
    href: '/exercises',
    icon: GraduationCap,
    description: 'Create and manage exercises'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Performance metrics and insights'
  },
  {
    id: 'users',
    label: 'User Management',
    href: '/users',
    icon: Users,
    description: 'Manage platform users'
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: FileText,
    description: 'Generate and view reports'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Platform configuration'
  }
];