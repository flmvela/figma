export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  description?: string;
}