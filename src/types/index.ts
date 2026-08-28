export type Difficulty = 'Foundation' | 'Intermediate' | 'Advanced' | 'Exhibition Challenge';

export type MathBranch =
  | 'Number'
  | 'Algebra'
  | 'Geometry'
  | 'Statistics'
  | 'Probability'
  | 'Functions'
  | 'Sequences'
  | 'Logic'
  | 'Patterns'
  | 'Number Theory';

export interface Experiment {
  id: string;
  title: string;
  shortTitle: string;
  branch: MathBranch;
  difficulty: Difficulty;
  description: string;
  longDescription: string;
  tags: string[];
  featured?: boolean;
  exhibitionPick?: boolean;
  icon: string;
  color: string;
}

export interface Challenge {
  id: string;
  title: string;
  branch: MathBranch;
  difficulty: Difficulty;
  problem: string;
  hint: string;
  answer: number | string;
  explanation: string;
  type: 'multiple-choice' | 'numeric' | 'pattern';
  options?: string[];
}

export interface DiscoverArticle {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  branch: MathBranch;
  tags: string[];
  featured?: boolean;
  icon: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  reducedMotion: boolean;
  highContrast: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  exhibitionMode: boolean;
}

export interface ExperimentResult {
  experimentId: string;
  timestamp: number;
  data: Record<string, unknown>;
}

export interface Mathematician {
  id: string;
  name: string;
  era: string;
  region: string;
  branch: MathBranch;
  contributions: string[];
  whyTheyMatter: string;
  interestingFact: string;
  exploreLink: string;
  exploreLabel: string;
}

export interface Formula {
  id: string;
  name: string;
  category: string;
  formula: string;
  variables: { symbol: string; meaning: string }[];
  intuition: string;
  example: string;
  relatedConcept: string;
  interactiveType: 'circle-area' | 'pythagorean' | 'statistics' | 'quadratic' | 'slope' | 'distance' | 'trig' | 'sequence' | 'none';
}

export interface FunFact {
  id: string;
  category: string;
  fact: string;
  why: string;
  exploreLink: string;
  exploreLabel: string;
}

export interface RealWorldTopic {
  id: string;
  title: string;
  icon: string;
  concept: string;
  scenario: string;
  mathConcept: string;
  relatedClass: string;
  color: string;
}

export interface LearnTopic {
  id: string;
  classLevel: 6 | 7 | 8 | 9 | 10;
  title: string;
  area: string;
  concept: string;
  formula: string;
  example: string;
  realWorld: string;
  relatedExperiment?: string;
  challenge: {
    question: string;
    answer: number | string;
    type: 'numeric' | 'multiple-choice';
    options?: string[];
  };
  prerequisites?: string[];
  connections?: string[];
  goFurther?: { title: string; description: string; topicId?: string; experimentId?: string };
}

export interface LearningPath {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  steps: { topicId: string; label: string; classLevel: 6 | 7 | 8 | 9 | 10 }[];
}
