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
  heroTag?: string;
  heroHeading?: string;
  
  // Custom about section
  aboutParagraph1?: string;
  aboutParagraph2?: string;
  aboutQuote?: string;

  // Custom skills section
  skillCat1Title?: string;
  skillCat1Desc?: string;
  skillCat1Tags?: string;
  skillCat2Title?: string;
  skillCat2Desc?: string;
  skillCat2Tags?: string;
  skillCat3Title?: string;
  skillCat3Desc?: string;
  skillCat3Tags?: string;

  // Custom contact text
  contactTitle?: string;
  contactDesc?: string;
}
