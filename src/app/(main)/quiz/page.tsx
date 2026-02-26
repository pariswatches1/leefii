'use client';

import { useState } from 'react';
import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';

interface QuizAnswer {
  id: string;
  text: string;
  icon: string;
  effects?: string[];
  type?: string;
  terpenes?: string[];
  thcPreference?: 'low' | 'medium' | 'high';
}

interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  answers: QuizAnswer[];
  multiSelect?: boolean;
}

const questions: QuizQuestion[] = [
  {
    id: 'experience',
    question: "What's your experience level with cannabis?",
    subtitle: "This helps us recommend the right potency",
    answers: [
      { id: 'new', text: "I'm new to cannabis", icon: '🌱', thcPreference: 'low' },
      { id: 'occasional', text: 'Occasional user', icon: '🌿', thcPreference: 'medium' },
      { id: 'regular', text: 'Regular consumer', icon: '🌳', thcPreference: 'medium' },
      { id: 'experienced', text: 'Very experienced', icon: '🏔️', thcPreference: 'high' },
    ],
  },
  {
    id: 'goal',
    question: 'What are you looking to achieve?',
    subtitle: 'Select the main reason for your interest',
    answers: [
      { id: 'relax', text: 'Relax & unwind', icon: '😌', effects: ['Relaxed', 'Sleepy'], type: 'indica' },
      { id: 'social', text: 'Social & creative', icon: '🎨', effects: ['Happy', 'Euphoric', 'Creative', 'Talkative'], type: 'sativa' },
      { id: 'focus', text: 'Focus & productivity', icon: '🎯', effects: ['Focused', 'Energetic', 'Uplifted'], type: 'sativa' },
      { id: 'pain', text: 'Pain relief', icon: '💆', effects: ['Relaxed'], terpenes: ['caryophyllene', 'myrcene'] },
      { id: 'sleep', text: 'Better sleep', icon: '😴', effects: ['Sleepy', 'Relaxed'], type: 'indica', terpenes: ['myrcene', 'linalool'] },
      { id: 'mood', text: 'Mood enhancement', icon: '✨', effects: ['Happy', 'Euphoric', 'Uplifted'], type: 'hybrid' },
    ],
  },
  {
    id: 'time',
    question: 'When do you typically consume?',
    subtitle: 'This affects the type of strain we recommend',
    answers: [
      { id: 'morning', text: 'Morning / Daytime', icon: '☀️', type: 'sativa', effects: ['Energetic', 'Focused', 'Uplifted'] },
      { id: 'afternoon', text: 'Afternoon', icon: '🌤️', type: 'hybrid', effects: ['Happy', 'Creative'] },
      { id: 'evening', text: 'Evening', icon: '🌅', type: 'hybrid', effects: ['Relaxed', 'Happy'] },
      { id: 'night', text: 'Night / Before bed', icon: '🌙', type: 'indica', effects: ['Sleepy', 'Relaxed'] },
    ],
  },
  {
    id: 'flavor',
    question: 'What flavors do you enjoy?',
    subtitle: 'Select all that appeal to you',
    multiSelect: true,
    answers: [
      { id: 'citrus', text: 'Citrus & Lemon', icon: '🍋', terpenes: ['limonene'] },
      { id: 'berry', text: 'Berry & Fruit', icon: '🫐', terpenes: ['myrcene', 'linalool'] },
      { id: 'earthy', text: 'Earthy & Herbal', icon: '🌿', terpenes: ['myrcene', 'humulene'] },
      { id: 'pine', text: 'Pine & Forest', icon: '🌲', terpenes: ['pinene'] },
      { id: 'spicy', text: 'Spicy & Pepper', icon: '🌶️', terpenes: ['caryophyllene'] },
      { id: 'floral', text: 'Floral & Lavender', icon: '💐', terpenes: ['linalool', 'terpinolene'] },
    ],
  },
  {
    id: 'avoid',
    question: 'Anything you want to avoid?',
    subtitle: 'Select any concerns (optional)',
    multiSelect: true,
    answers: [
      { id: 'anxiety', text: 'Anxiety or paranoia', icon: '😰', effects: ['Relaxed'], terpenes: ['linalool', 'myrcene'] },
      { id: 'couch', text: 'Couch-lock feeling', icon: '🛋️', type: 'sativa' },
      { id: 'dry', text: 'Dry mouth/eyes', icon: '💧' },
      { id: 'munchies', text: 'The munchies', icon: '🍕' },
      { id: 'none', text: 'No concerns', icon: '✅' },
    ],
  },
];

interface Strain {
  id: string;
  name: string;
  slug: string;
  type: string;
  thcMin?: number | null;
  thcMax?: number | null;
  effects: string[];
  rating?: number | null;
  description?: string | null;
  terpMyrcene?: number | null;
  terpLimonene?: number | null;
  terpCaryophyllene?: number | null;
  terpPinene?: number | null;
  terpLinalool?: number | null;
  terpHumulene?: number | null;
  terpTerpinolene?: number | null;
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<Strain[]>([]);
  const [loading, setLoading] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion) / questions.length) * 100;

  const handleAnswer = (answerId: string) => {
    const questionId = question.id;

    if (question.multiSelect) {
      const current = answers[questionId] || [];
      if (answerId === 'none') {
        setAnswers({ ...answers, [questionId]: ['none'] });
      } else if (current.includes(answerId)) {
        setAnswers({ ...answers, [questionId]: current.filter(a => a !== answerId) });
      } else {
        setAnswers({ ...answers, [questionId]: [...current.filter(a => a !== 'none'), answerId] });
      }
    } else {
      setAnswers({ ...answers, [questionId]: [answerId] });
      // Auto-advance for single select
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        }
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = async () => {
    setLoading(true);

    // Aggregate preferences from answers
    const preferences = {
      effects: [] as string[],
      type: null as string | null,
      terpenes: [] as string[],
      thcPreference: 'medium' as 'low' | 'medium' | 'high',
    };

    // Process each answer
    Object.entries(answers).forEach(([questionId, selectedIds]) => {
      const q = questions.find(q => q.id === questionId);
      if (!q) return;

      selectedIds.forEach(answerId => {
        const answer = q.answers.find(a => a.id === answerId);
        if (!answer) return;

        if (answer.effects) {
          preferences.effects.push(...answer.effects);
        }
        if (answer.type && !preferences.type) {
          preferences.type = answer.type;
        }
        if (answer.terpenes) {
          preferences.terpenes.push(...answer.terpenes);
        }
        if (answer.thcPreference) {
          preferences.thcPreference = answer.thcPreference;
        }
      });
    });

    // Build query params
    const params = new URLSearchParams();
    if (preferences.type) {
      params.set('type', preferences.type);
    }
    if (preferences.effects.length > 0) {
      // Use most common effect
      const effectCounts = preferences.effects.reduce((acc, e) => {
        acc[e] = (acc[e] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const topEffect = Object.entries(effectCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      if (topEffect) {
        params.set('effect', topEffect);
      }
    }
    if (preferences.terpenes.length > 0) {
      // Use most common terpene
      const terpCounts = preferences.terpenes.reduce((acc, t) => {
        acc[t] = (acc[t] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const topTerpene = Object.entries(terpCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      if (topTerpene) {
        params.set('terpene', topTerpene);
      }
    }
    params.set('take', '6');

    try {
      const res = await fetch(`/api/strains?${params.toString()}`);
      const data = await res.json();
      setResults(data.strains || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]);
    }

    setLoading(false);
    setShowResults(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults([]);
  };

  const isAnswerSelected = (answerId: string) => {
    return answers[question.id]?.includes(answerId) || false;
  };

  const canProceed = () => {
    if (question.multiSelect) {
      return true; // Multi-select is optional
    }
    return answers[question.id]?.length > 0;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SATIVA': return 'bg-orange-100 text-orange-700';
      case 'INDICA': return 'bg-purple-100 text-purple-700';
      case 'HYBRID': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Results Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6">
              <span className="text-4xl">🎯</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Your Perfect Matches</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Based on your preferences, we found these strains that match your needs
            </p>
          </div>

          {/* Results Grid */}
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {results.map((strain, index) => (
                <Link
                  key={strain.id}
                  href={`/strains/${strain.slug}`}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden group"
                >
                  {/* Match Badge */}
                  {index === 0 && (
                    <div className="bg-green-600 text-white text-center py-2 text-sm font-medium">
                      Top Match
                    </div>
                  )}

                  {/* Image */}
                  <div className="h-40 bg-gradient-to-br from-green-100 to-green-200 overflow-hidden">
                    <img
                      src="https://cdn.midjourney.com/69b327bd-36d7-4219-8bc6-ffd1da9dd44b/0_1.png"
                      alt={strain.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getTypeColor(strain.type)}`}>
                      {strain.type}
                    </span>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{strain.name}</h3>

                    {/* THC */}
                    {strain.thcMax && (
                      <p className="text-sm text-gray-500 mb-2">
                        THC: {strain.thcMin || 0}% - {strain.thcMax}%
                      </p>
                    )}

                    {/* Effects */}
                    {strain.effects && strain.effects.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {strain.effects.slice(0, 3).map((effect) => (
                          <span key={effect} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {effect}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Rating */}
                    {strain.rating && strain.rating > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-700">{strain.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg mb-10">
              <p className="text-gray-500 text-lg">No exact matches found. Try exploring all strains!</p>
            </div>
          )}

          {/* Share Results */}
          <div className="text-center mb-8">
            <ShareButtons
              url="https://leefii.com/quiz"
              title="I found my perfect cannabis strains on Leefii!"
              variant="full"
              heading="Share Your Results"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={restartQuiz}
              className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-full font-medium hover:bg-green-50 transition"
            >
              Retake Quiz
            </button>
            <Link
              href="/strains"
              className="px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition text-center"
            >
              Browse All Strains
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Strain</h1>
          <p className="text-gray-600">Answer a few questions to get personalized recommendations</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{question.question}</h2>
          {question.subtitle && (
            <p className="text-gray-500 mb-6">{question.subtitle}</p>
          )}

          {/* Answers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.answers.map((answer) => (
              <button
                key={answer.id}
                onClick={() => handleAnswer(answer.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  isAnswerSelected(answer.id)
                    ? 'border-green-600 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{answer.icon}</span>
                  <span className={`font-medium ${isAnswerSelected(answer.id) ? 'text-green-700' : 'text-gray-700'}`}>
                    {answer.text}
                  </span>
                  {isAnswerSelected(answer.id) && (
                    <svg className="w-5 h-5 text-green-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          {question.multiSelect && (
            <p className="text-sm text-gray-400 mt-4 text-center">
              Select all that apply, then click Continue
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 rounded-full font-medium transition ${
              currentQuestion === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-white hover:shadow'
            }`}
          >
            ← Back
          </button>

          {(question.multiSelect || currentQuestion === questions.length - 1) && (
            <button
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className={`px-8 py-3 rounded-full font-medium transition ${
                canProceed() && !loading
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Finding matches...
                </span>
              ) : currentQuestion === questions.length - 1 ? (
                'See My Matches →'
              ) : (
                'Continue →'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
