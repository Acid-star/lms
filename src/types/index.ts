export interface Quiz {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResult {
  quizId: string;
  score: number;
  timeTaken: number;
  totalQuestions: number;
  answers: Answer[];
}

export interface Answer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
}