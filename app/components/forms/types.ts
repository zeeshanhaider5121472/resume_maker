export interface PersonalInfo {
  name: string;
  contact: string;
  email: string;
  address: string;
}
export interface WorkExp {
  company: string;
  role: string;
  duration: string;
  location: string;
  responsibilities: string[];
}
export interface Education {
  name: string;
  location: string;
  degree: string;
  cgpa: string;
}
export interface UserLanguage {
  name: string;
  level: string;
}
export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Strengths {
  category: string;
  skills: string[];
}

export interface User {
  id: string;
  filename: string;
  personalinformation: PersonalInfo;
  aboutmyself: { summary: string };
  workexperience: WorkExp[];
  educationhistory: Education[];
  languages: UserLanguage[];
  skillCategories: SkillCategory[];
  strengths: SkillCategory[];
  portfoliolink: string;
}

export interface DbData {
  resumeusers: User[];
}

// Props for the updater functions
export interface FormProps {
  updateField: (path: string, value: any) => void;
  addArrayItem: (arrayPath: string, newItem: any) => void;
  removeArrayItem: (arrayPath: string, index: number) => void;
}
