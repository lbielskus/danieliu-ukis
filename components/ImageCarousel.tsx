'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const carouselImages = [
  {
    src: '/1.jpg',
    alt: 'Europos danieliai ganosi pievoje',
    title: 'Didingieji Danieliai',
    description:
      'Stebėkite mūsų gražius danielius laisvai klajojančius natūralioje aplinkoje',
  },
  {
    src: '/2.jpg',
    alt: 'Jaunas danielius su didelėmis ausimis',
    title: 'Jaunieji Danieliai',
    description:
      'Susipažinkite su mūsų jaunaisiais danieliais ir stebėkite jų žaismingą elgesį',
  },
  {
    src: '/3.jpg',
    alt: 'Danielių šeima natūralioje aplinkoje',
    title: 'Danielių Šeimos',
    description:
      'Stebėkite danielių šeimas ir sužinokite apie jų socialų elgesį',
  },
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || !mounted) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, mounted]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(
      currentIndex === 0 ? carouselImages.length - 1 : currentIndex - 1
    );
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(
      currentIndex === carouselImages.length - 1 ? 0 : currentIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (!mounted) {
    return (
      <div className='w-full h-[400px] md:h-[500px] rounded-2xl bg-gray-200 animate-pulse flex items-center justify-center'>
        <div className='text-gray-400'>Kraunama...</div>
      </div>
    );
  }

  return (
    <div className='relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl'>
      {/* Images */}
      <div className='relative w-full h-full'>
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.src || '/placeholder.svg'}
              alt={image.alt}
              className='w-full h-full object-cover'
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
            <div className='absolute bottom-6 left-6 right-6 text-white'>
              <h3 className='text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg'>
                {image.title}
              </h3>
              <p className='text-lg opacity-90 drop-shadow-md'>
                {image.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        variant='ghost'
        size='icon'
        className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
        onClick={goToPrevious}
      >
        <ChevronLeft className='h-6 w-6' />
      </Button>

      <Button
        variant='ghost'
        size='icon'
        className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
        onClick={goToNext}
      >
        <ChevronRight className='h-6 w-6' />
      </Button>

      {/* Dots indicator */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-110'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
