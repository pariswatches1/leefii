'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  user: {
    name: string;
    image: string | null;
  };
}

interface ReviewsProps {
  entityType: 'dispensary' | 'strain' | 'product' | 'seller';
  entityId: string;
  entityName: string;
}

// Star Rating Display Component
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Star Rating Input Component
function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none"
        >
          <svg
            className={`w-8 h-8 transition-colors ${
              star <= (hover || value) ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {value > 0 ? ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value] : 'Select rating'}
      </span>
    </div>
  );
}

export default function Reviews({ entityType, entityId, entityName }: ReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ averageRating: '0', totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Fetch reviews
  useEffect(() => {
    async function fetchReviews() {
      try {
        const paramKey = `${entityType}Id`;
        const response = await fetch(`/api/reviews?${paramKey}=${entityId}`);
        const data = await response.json();

        if (response.ok) {
          setReviews(data.reviews);
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [entityType, entityId]);

  // Submit review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [`${entityType}Id`]: entityId,
          rating,
          title: title || null,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to submit review');
        return;
      }

      setSuccess(true);
      setShowForm(false);
      setRating(0);
      setTitle('');
      setContent('');

      // Add new review to list
      setReviews((prev) => [
        {
          ...data.review,
          user: { name: session?.user?.name || 'You', image: session?.user?.image || null },
          isVerified: false,
          helpfulCount: 0,
        },
        ...prev,
      ]);
      setStats((prev) => ({
        ...prev,
        totalReviews: prev.totalReviews + 1,
      }));
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={Math.round(parseFloat(stats.averageRating))} size="md" />
            <span className="text-lg font-semibold">{stats.averageRating}</span>
            <span className="text-gray-500">({stats.totalReviews} reviews)</span>
          </div>
        </div>

        {session ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Write a Review
          </button>
        ) : (
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '/')}`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Sign in to Review
          </Link>
        )}
      </div>

      {/* Success message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Thank you! Your review has been submitted.
        </div>
      )}

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">
            Review {entityName}
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating *
            </label>
            <StarRatingInput value={rating} onChange={setRating} />
          </div>

          <div>
            <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-1">
              Title (optional)
            </label>
            <input
              id="review-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-1">
              Your Review *
            </label>
            <textarea
              id="review-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience..."
              required
              minLength={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || rating === 0 || content.length < 10}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading reviews...</div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {review.user.image ? (
                      <img
                        src={review.user.image}
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <span className="text-gray-600 font-medium">
                        {review.user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{review.user.name}</span>
                      {review.isVerified && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {review.title && (
                <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
              )}

              <p className="text-gray-700 text-sm leading-relaxed">{review.content}</p>

              <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                <button className="hover:text-green-600 transition">
                  Helpful ({review.helpfulCount})
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-gray-600 font-medium">No reviews yet</p>
          <p className="text-gray-500 text-sm mt-1">Be the first to share your experience!</p>
        </div>
      )}
    </div>
  );
}

// Export star rating for use elsewhere
export { StarRating };
