export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  enrolled: number;
  rating: number;
  hasCaptions: boolean;
  hasTranscripts: boolean;
  hasSignLanguage: boolean;
  hasAudioDescription: boolean;
  wcagLevel: 'A' | 'AA' | 'AAA';
  progress?: number;
  tags: string[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  videoUrl: string;
  captionsVtt: string;
  transcript: string;
  completed: boolean;
  order: number;
}

export const courses: Course[] = [
  {
    id: 'c1', title: 'Introduction to Web Accessibility',
    description: 'Learn the fundamentals of building accessible web applications that work for everyone, including screen reader users, keyboard-only users, and more.',
    instructor: 'Dr. Sarah Chen', thumbnail: 'globe', category: 'Web Development', difficulty: 'Beginner',
    duration: '6 hours', lessons: 12, enrolled: 2847, rating: 4.9,
    hasCaptions: true, hasTranscripts: true, hasSignLanguage: true, hasAudioDescription: true,
    wcagLevel: 'AAA', progress: 75, tags: ['WCAG', 'ARIA', 'HTML', 'CSS']
  },
  {
    id: 'c2', title: 'AI & Machine Learning Foundations',
    description: 'Explore the world of artificial intelligence and machine learning with accessible, step-by-step lessons designed for all learners.',
    instructor: 'Prof. James Rivera', thumbnail: 'bot', category: 'AI/ML', difficulty: 'Intermediate',
    duration: '10 hours', lessons: 20, enrolled: 5123, rating: 4.8,
    hasCaptions: true, hasTranscripts: true, hasSignLanguage: false, hasAudioDescription: true,
    wcagLevel: 'AA', progress: 30, tags: ['Python', 'TensorFlow', 'Neural Networks']
  },
  {
    id: 'c3', title: 'Data Science with Python',
    description: 'Master data analysis, visualization, and statistical modeling using Python with fully accessible course materials.',
    instructor: 'Dr. Priya Patel', thumbnail: 'bar-chart', category: 'Data Science', difficulty: 'Intermediate',
    duration: '8 hours', lessons: 16, enrolled: 3891, rating: 4.7,
    hasCaptions: true, hasTranscripts: true, hasSignLanguage: true, hasAudioDescription: false,
    wcagLevel: 'AA', progress: 0, tags: ['Python', 'Pandas', 'Matplotlib']
  },
  {
    id: 'c4', title: 'Creative Digital Design',
    description: 'Learn graphic design principles and digital art creation with audio-described tutorials and alternative text guides.',
    instructor: 'Maria Gonzalez', thumbnail: 'palette', category: 'Design', difficulty: 'Beginner',
    duration: '5 hours', lessons: 10, enrolled: 1956, rating: 4.6,
    hasCaptions: true, hasTranscripts: true, hasSignLanguage: false, hasAudioDescription: true,
    wcagLevel: 'AA', tags: ['Figma', 'Color Theory', 'Typography']
  },
  {
    id: 'c5', title: 'Mobile App Development',
    description: 'Build cross-platform mobile apps with React Native, focusing on accessibility-first development patterns.',
    instructor: 'Alex Thompson', thumbnail: 'smartphone', category: 'Mobile Dev', difficulty: 'Advanced',
    duration: '12 hours', lessons: 24, enrolled: 4210, rating: 4.8,
    hasCaptions: true, hasTranscripts: true, hasSignLanguage: true, hasAudioDescription: true,
    wcagLevel: 'AAA', progress: 50, tags: ['React Native', 'JavaScript', 'iOS', 'Android']
  },
  {
    id: 'c6', title: 'Cybersecurity Essentials',
    description: 'Understand cybersecurity fundamentals with accessible labs and interactive examples suitable for all abilities.',
    instructor: 'Dr. Kevin Okonkwo', thumbnail: 'shield', category: 'Security', difficulty: 'Beginner',
    duration: '7 hours', lessons: 14, enrolled: 3245, rating: 4.5,
    hasCaptions: true, hasTranscripts: true, hasSignLanguage: false, hasAudioDescription: false,
    wcagLevel: 'AA', tags: ['Network Security', 'Encryption', 'Ethics']
  },
  {
    id: 'c7', title: 'Cloud Computing with AWS',
    description: 'Deploy and manage cloud infrastructure on AWS with step-by-step audio guides and visual diagrams.',
    instructor: 'Lisa Chang', thumbnail: 'cloud', category: 'Cloud', difficulty: 'Advanced',
    duration: '15 hours', lessons: 30, enrolled: 6780, rating: 4.9,
    hasCaptions: true, hasTranscripts: true, hasSignLanguage: true, hasAudioDescription: true,
    wcagLevel: 'AAA', progress: 10, tags: ['AWS', 'EC2', 'S3', 'Lambda']
  },
  {
    id: 'c8', title: 'UX Research & Inclusive Design',
    description: 'Master user experience research methods with emphasis on inclusive design for users with disabilities.',
    instructor: 'Dr. Emily Brooks', thumbnail: 'flask', category: 'Design', difficulty: 'Intermediate',
    duration: '6 hours', lessons: 12, enrolled: 2130, rating: 4.7,
    hasCaptions: true, hasTranscripts: true, hasSignLanguage: true, hasAudioDescription: true,
    wcagLevel: 'AAA', tags: ['UX', 'Research', 'Inclusive Design', 'Personas']
  }
];

export const sampleLessons: Lesson[] = [
  { id: 'l1', courseId: 'c1', title: 'What is Web Accessibility?', duration: '15:30', videoUrl: '', captionsVtt: '', transcript: 'Web accessibility means that websites, tools, and technologies are designed and developed so that people with disabilities can use them. More specifically, people can perceive, understand, navigate, and interact with the Web. Web accessibility encompasses all disabilities that affect access to the Web, including auditory, cognitive, neurological, physical, speech, and visual disabilities.', completed: true, order: 1 },
  { id: 'l2', courseId: 'c1', title: 'Understanding WCAG 2.2 Guidelines', duration: '22:15', videoUrl: '', captionsVtt: '', transcript: 'The Web Content Accessibility Guidelines (WCAG) 2.2 is the latest version of the internationally recognized standard for web content accessibility. It includes 13 new success criteria organized under the POUR principles: Perceivable, Operable, Understandable, and Robust. These guidelines help ensure content is accessible to a wider range of people with disabilities.', completed: true, order: 2 },
  { id: 'l3', courseId: 'c1', title: 'Semantic HTML for Accessibility', duration: '18:45', videoUrl: '', captionsVtt: '', transcript: 'Semantic HTML uses HTML elements according to their intended purpose. Using the correct semantic elements like header, nav, main, article, and footer provides meaning to assistive technologies. Screen readers rely on semantic structure to help users navigate and understand content. Always use headings in proper hierarchy, lists for related items, and buttons for interactive elements.', completed: false, order: 3 },
  { id: 'l4', courseId: 'c1', title: 'ARIA Labels and Roles', duration: '25:00', videoUrl: '', captionsVtt: '', transcript: 'Accessible Rich Internet Applications (ARIA) is a set of attributes that define ways to make web content more accessible. ARIA roles, states, and properties supplement HTML semantics. Use aria-label for elements without visible text, aria-describedby for additional descriptions, and aria-live regions for dynamic content updates that screen readers should announce.', completed: false, order: 4 },
  { id: 'l5', courseId: 'c1', title: 'Keyboard Navigation Patterns', duration: '20:30', videoUrl: '', captionsVtt: '', transcript: 'Keyboard navigation is essential for users who cannot use a mouse. All interactive elements must be reachable and operable with keyboard alone. Implement logical tab order, visible focus indicators, and standard keyboard patterns. Use Tab for navigation, Enter/Space for activation, Arrow keys for menus, and Escape for dismissal.', completed: false, order: 5 },
];

export const sampleCaptions = [
  { time: '00:00', text: 'Welcome to Introduction to Web Accessibility.' },
  { time: '00:05', text: 'In this course, you will learn how to build websites' },
  { time: '00:09', text: 'that are accessible to everyone, regardless of ability.' },
  { time: '00:14', text: 'Web accessibility is not just about compliance —' },
  { time: '00:18', text: 'it\'s about creating inclusive experiences.' },
  { time: '00:23', text: 'Let\'s start by understanding what accessibility means.' },
  { time: '00:28', text: 'Accessibility, often abbreviated as a11y,' },
  { time: '00:32', text: 'ensures that people with disabilities can perceive,' },
  { time: '00:36', text: 'understand, navigate, and interact with the web.' },
  { time: '00:41', text: 'This includes visual, auditory, motor,' },
  { time: '00:45', text: 'and cognitive disabilities.' },
  { time: '00:48', text: 'Over 1.3 billion people worldwide live with some form of disability.' },
  { time: '00:54', text: 'That\'s 16% of the global population.' },
  { time: '00:58', text: 'Making your content accessible isn\'t optional — it\'s essential.' },
];

export const quizQuestions = [
  {
    id: 'q1', question: 'What does WCAG stand for?',
    options: ['Web Content Accessibility Guidelines', 'Web Compliance And Governance', 'Wide Coverage Accessibility Guide', 'Web Content Audit Guidelines'],
    correctAnswer: 0
  },
  {
    id: 'q2', question: 'Which ARIA attribute is used to provide a text label for an element without visible text?',
    options: ['aria-hidden', 'aria-label', 'aria-role', 'aria-value'],
    correctAnswer: 1
  },
  {
    id: 'q3', question: 'What keyboard key is typically used to move focus to the next interactive element?',
    options: ['Enter', 'Space', 'Tab', 'Escape'],
    correctAnswer: 2
  },
  {
    id: 'q4', question: 'Which of the POUR principles focuses on whether users can find and use the UI?',
    options: ['Perceivable', 'Operable', 'Understandable', 'Robust'],
    correctAnswer: 1
  },
  {
    id: 'q5', question: 'How many people worldwide live with some form of disability?',
    options: ['500 million', '800 million', '1 billion', '1.3 billion'],
    correctAnswer: 3
  },
];
