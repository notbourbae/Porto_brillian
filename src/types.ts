export interface Project {
  id: string;
  title: string;
  category: 'Design' | 'Code' | 'Architecture';
  description: string;
  longDescription: string;
  imageUrl: string;
  tags: string[];
  role: string;
  year: string;
  client: string;
  link?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  major?: string;
}

export interface Skill {
  name: string;
  category: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  bio: string;
  avatarUrl: string;
  email: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  tiktok?: string;
}
