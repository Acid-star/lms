import { Quiz, QuizResult } from '../types';
import LogisticRegression from 'ml-logistic-regression';
interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  imageUrl: string;
}

// Available courses
const courses: Course[] = [
  {
    id: 'web-dev',
    title: 'Full Stack Web Development',
    description:
      'Learn modern web development with HTML, CSS, JavaScript, React, Node.js, and more.',
    category: 'Web Development',
    level: 'Intermediate',
    topics: ['javascript', 'react', 'node', 'html', 'css'],
    imageUrl:
      'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg',
    pdfUrl:
      'https://drive.google.com/file/d/1iMUW_PSiEN-fTA4Kzp9At4T2RSty9mly/view?usp=drivesdk',
  },
  {
    id: 'data-science',
    title: 'Data Science & Analytics',
    description:
      'Master data analysis, machine learning, and statistical modeling with Python.',
    category: 'Data Science',
    level: 'Advanced',
    topics: ['python', 'statistics', 'machine-learning', 'data-analysis'],
    imageUrl:
      'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg',
    pdfUrl:
      'https://drive.google.com/file/d/1iJwJ98q3rC48JP5zIxhvgnJ2t_85mMr5/view?usp=drivesdk',
  },
  {
    id: 'mobile-dev',
    title: 'Mobile App Development',
    description:
      'Build cross-platform mobile apps using React Native and modern mobile technologies.',
    category: 'Mobile Development',
    level: 'Intermediate',
    topics: ['react-native', 'mobile', 'ios', 'android'],
    imageUrl:
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg',
    pdfUrl:
      'https://drive.google.com/file/d/1iZUDde8EhIB-cTE36Rlw3W2Fwbr-BLzV/view?usp=drivesdk',
  },
  {
    id: 'cloud-computing',
    title: 'Cloud Computing & DevOps',
    description:
      'Learn cloud services, containerization, and modern deployment practices.',
    category: 'Cloud Computing',
    level: 'Advanced',
    topics: ['aws', 'docker', 'kubernetes', 'devops'],
    imageUrl:
      'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg',
    pdfUrl:
      'https://drive.google.com/file/d/1iZnV35oTnpX6dGpV6lw91f8OQ63_A8HH/view?usp=drivesdk',
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Fundamentals',
    description:
      'Master the basics of network security, cryptography, and ethical hacking.',
    category: 'Cybersecurity',
    level: 'Intermediate',
    topics: ['security', 'cryptography', 'networking', 'ethical-hacking'],
    imageUrl:
      'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg',
    pdfUrl:
      'https://drive.google.com/file/d/1i_-25AxAc_P4EiX6oN-h9N1jNqTS6O6d/view?usp=drivesdk',
  },
];

// Feature extraction from quiz results
function extractFeatures(
  quizResults: QuizResult[],
  quizzes: Quiz[]
): number[][] {
  return quizResults
    .map((result) => {
      const quiz = quizzes.find((q) => q.id === result.quizId);
      if (!quiz) return [];

      // Calculate features
      const scorePercentage = result.score / result.totalQuestions;
      const timePerQuestion = result.timeTaken / result.totalQuestions;
      const consistencyScore = calculateConsistencyScore(result.answers);
      const difficultyLevel = getDifficultyLevel(quiz.level);
      const categoryScore = getCategoryScore(quiz.category);

      return [
        scorePercentage,
        timePerQuestion,
        consistencyScore,
        difficultyLevel,
        categoryScore,
      ];
    })
    .filter((feature) => feature.length > 0);
}

function calculateConsistencyScore(answers: QuizResult['answers']): number {
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const totalAnswers = answers.length;
  return correctAnswers / totalAnswers;
}

function getDifficultyLevel(level: string): number {
  switch (level) {
    case 'Beginner':
      return 1;
    case 'Intermediate':
      return 2;
    case 'Advanced':
      return 3;
    default:
      return 1;
  }
}

function getCategoryScore(category: string): number {
  const categoryWeights: { [key: string]: number } = {
    'Web Development': 1,
    'Data Science': 2,
    'Mobile Development': 3,
    'Cloud Computing': 4,
    Cybersecurity: 5,
  };
  return categoryWeights[category] || 0;
}

function prepareTrainingData(
  features: number[][]
): { X: number[][]; y: Float64Array } | null {
  if (features.length === 0) return null;

  const X: number[][] = [];
  const yTemp: number[] = [];

  features.forEach((feature) => {
    for (let i = 0; i < 5; i++) {
      const noisyFeature = feature.map((f) => f + (Math.random() - 0.5) * 0.1);
      X.push(noisyFeature);

      const avgScore = (noisyFeature[0] + noisyFeature[2]) / 2;
      yTemp.push(avgScore > 0.7 ? 1 : 0);
    }
  });

  if (X.length === 0) return null;

  const y = Float64Array.from(yTemp);
  return { X, y };
}

export function analyzeQuizResults(
  quizResults: QuizResult[],
  quizzes: Quiz[]
): Course[] {
  if (quizResults.length === 0) return [];

  const features = extractFeatures(quizResults, quizzes);
  if (features.length === 0) return [];

  const trainingData = prepareTrainingData(features);
  if (!trainingData) return [];

  const { X, y } = trainingData;

  try {
    const model = new LogisticRegression({ numSteps: 100, learningRate: 0.5 });
    model.train(X, y);

    const coursePredictions = courses.map((course) => {
      const courseFeatures = [
        0.8, // Assume good base performance
        60, // Average time per question
        0.8, // Consistency score
        getDifficultyLevel(course.level),
        getCategoryScore(course.category),
      ];

      const prediction = model.predict([courseFeatures])[0];

      return {
        course,
        score: prediction,
      };
    });

    return coursePredictions
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((prediction) => prediction.course);
  } catch (error) {
    console.error('Error in recommendation engine:', error);
    return courses.slice(0, 3);
  }
}

export function recommendCourses(
  quizTopics: any[],
  maxRecommendations: number = 1
): Course[] {
  return courses.slice(0, maxRecommendations);
}

// export function recommendCourses(
//   quizTopics: string[],
//   maxRecommendations: number = 3
// ): Course[] {
//   const scoredCourses = courses.map((course) => {
//     const matchScore = course.topics.filter((topic) =>
//       quizTopics.includes(topic)
//     ).length;
//     return { course, score: matchScore };
//   });

//   return scoredCourses
//     .sort((a, b) => b.score - a.score)
//     .slice(0, maxRecommendations)
//     .map((item) => item.course);
// }
