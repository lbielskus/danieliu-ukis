'use client';

import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Mock reviews in Lithuanian
const mockReviews = [
  {
    id: '1',
    clientName: 'Rasa Petraitienė',
    rating: 5,
    comment:
      'Nuostabi patirtis! Danieliai buvo tokie gražūs, o gidas labai išmanytas. Mano vaikai mėgavosi kiekviena minute.',
    createdAt: new Date('2024-01-15'),
    location: 'Šeimos apsilankymas',
  },
  {
    id: '2',
    clientName: 'Mindaugas Kazlauskas',
    rating: 5,
    comment:
      'Puiki diena su šeima. Danielių ūkis gerai prižiūrimas, o gyvūnai atrodo sveiki ir laimingi. Labai rekomenduoju!',
    createdAt: new Date('2024-01-10'),
    location: 'Savaitgalio išvyka',
  },
  {
    id: '3',
    clientName: 'Gintarė Jankevičienė',
    rating: 4,
    comment:
      'Puiki švietėjiška patirtis. Sužinojome daug apie Europos danielius. Gidas buvo fantastiškas ir labai kantriai atsakė į klausimus.',
    createdAt: new Date('2024-01-08'),
    location: 'Mokyklos grupė',
  },
  {
    id: '4',
    clientName: 'Darius Stankevičius',
    rating: 5,
    comment:
      'Nuostabi rami patirtis. Danieliai yra didingos būtybės ir matyti, kad jie gerai prižiūrimi. Tikrai aplankysime dar kartą!',
    createdAt: new Date('2024-01-05'),
    location: 'Fotografijos ekskursija',
  },
  {
    id: '5',
    clientName: 'Jolanta Urbonienė',
    rating: 5,
    comment:
      'Mano pagyvenę tėvai labai mėgavosi šiuo apsilankymu. Personalas buvo labai dėmesingas ir pasirūpino, kad visi galėtų patogiai stebėti danielius.',
    createdAt: new Date('2024-01-03'),
    location: 'Kelių kartų apsilankymas',
  },
  {
    id: '6',
    clientName: 'Tomas Vasiliauskis',
    rating: 4,
    comment:
      'Graži vieta ir nuostabūs gyvūnai. Vaikai buvo sužavėti galėdami iš arti pamatyti danielius. Puikus santykis kokybės ir kainos!',
    createdAt: new Date('2023-12-28'),
    location: 'Šventinis apsilankymas',
  },
];

export default function ReviewsSection() {
  const [reviews, setReviews] = useState(mockReviews);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Auto-rotate reviews every 8 seconds
    const interval = setInterval(() => {
      setCurrentReviewIndex((prevIndex) =>
        prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [reviews.length, mounted]);

  // Calculate average rating
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!mounted) {
    return (
      <section className='py-20 px-4 bg-gray-50'>
        <div className='container mx-auto'>
          <div className='text-center'>
            <div className='h-8 bg-gray-200 animate-pulse rounded mb-4 max-w-md mx-auto'></div>
            <div className='h-4 bg-gray-200 animate-pulse rounded mb-8 max-w-lg mx-auto'></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='py-20 px-4 bg-gray-50'>
      <div className='container mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>
            Ką Sako Mūsų Lankytojai
          </h2>
          <div className='flex items-center justify-center space-x-2 mb-4'>
            <div className='flex items-center space-x-1'>
              {renderStars(Math.round(averageRating))}
            </div>
            <span className='text-lg font-semibold text-gray-700'>
              {averageRating.toFixed(1)} iš 5
            </span>
            <span className='text-gray-500'>
              ({reviews.length} atsiliepimai)
            </span>
          </div>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Išgirskite iš šeimų, kurios patyrė mūsų danielių ūkio stebuklą
          </p>
        </div>

        {/* Featured Review */}
        <div className='max-w-4xl mx-auto mb-12'>
          <Card className='border-0 shadow-xl bg-white relative overflow-hidden'>
            <div className='absolute top-4 left-4 text-emerald-200'>
              <Quote className='h-12 w-12' />
            </div>
            <CardContent className='pt-16 pb-8 px-8'>
              <div className='text-center'>
                <div className='flex items-center justify-center space-x-1 mb-4'>
                  {renderStars(reviews[currentReviewIndex].rating)}
                </div>
                <blockquote className='text-xl md:text-2xl text-gray-700 mb-6 italic leading-relaxed'>
                  "{reviews[currentReviewIndex].comment}"
                </blockquote>
                <div className='text-center'>
                  <p className='font-semibold text-gray-900 text-lg'>
                    {reviews[currentReviewIndex].clientName}
                  </p>
                  <p className='text-gray-500'>
                    {reviews[currentReviewIndex].location} •{' '}
                    {reviews[currentReviewIndex].createdAt.toLocaleDateString(
                      'lt-LT'
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Review Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {reviews.slice(0, 6).map((review, index) => (
            <Card
              key={review.id}
              className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                index === currentReviewIndex
                  ? 'ring-2 ring-emerald-500 scale-105'
                  : ''
              }`}
            >
              <CardContent className='p-6'>
                <div className='flex items-center space-x-1 mb-3'>
                  {renderStars(review.rating)}
                </div>
                <blockquote className='text-gray-700 mb-4 line-clamp-3'>
                  "{review.comment}"
                </blockquote>
                <div className='border-t pt-4'>
                  <p className='font-semibold text-gray-900'>
                    {review.clientName}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {review.location} •{' '}
                    {review.createdAt.toLocaleDateString('lt-LT')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Review indicators */}
        <div className='flex justify-center mt-8 space-x-2'>
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentReviewIndex
                  ? 'bg-emerald-600 scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => setCurrentReviewIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
