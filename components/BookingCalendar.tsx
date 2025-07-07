'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BookingCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  duration: number;
}

// Generate available slots for the next 3 months dynamically
const generateAvailableSlots = () => {
  const slots: Record<string, string[]> = {};
  const today = new Date();
  const endDate = new Date();
  endDate.setMonth(today.getMonth() + 3); // Next 3 months

  const currentDate = new Date(today);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    // Available Tuesday to Saturday (2-6), closed Sunday (0) and Monday (1)
    if (dayOfWeek >= 2 && dayOfWeek <= 6) {
      const dateStr = currentDate.toISOString().split('T')[0];
      slots[dateStr] = ['09:00', '11:00', '13:00', '15:00'];
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return slots;
};

// Replace the hardcoded availableSlots with dynamic generation
const availableSlots = generateAvailableSlots();

export default function BookingCalendar({
  selectedDate,
  onDateSelect,
  selectedTime,
  onTimeSelect,
  duration,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentMonth(new Date());
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (!currentMonth) return;
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(
      currentMonth.getMonth() + (direction === 'next' ? 1 : -1)
    );
    setCurrentMonth(newMonth);
  };

  const isDateAvailable = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availableSlots[dateStr as keyof typeof availableSlots]?.length > 0;
  };

  const isDatePast = (date: Date) => {
    if (!mounted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getAvailableTimesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availableSlots[dateStr as keyof typeof availableSlots] || [];
  };

  const getDayName = (date: Date) => {
    const dayNames = [
      'Sekmadienis',
      'Pirmadienis',
      'Antradienis',
      'Trečiadienis',
      'Ketvirtadienis',
      'Penktadienis',
      'Šeštadienis',
    ];
    return dayNames[date.getDay()];
  };

  if (!mounted || !currentMonth) {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Kraunama...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-64 bg-gray-100 animate-pulse rounded'></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Kraunama...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-64 bg-gray-100 animate-pulse rounded'></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'Sausis',
    'Vasaris',
    'Kovas',
    'Balandis',
    'Gegužė',
    'Birželis',
    'Liepa',
    'Rugpjūtis',
    'Rugsėjis',
    'Spalis',
    'Lapkritis',
    'Gruodis',
  ];
  const dayNames = ['Sek', 'Pir', 'Ant', 'Tre', 'Ket', 'Pen', 'Šeš'];

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6'>
      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-base sm:text-lg'>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </CardTitle>
            <div className='flex items-center space-x-1'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-7 gap-1 mb-4'>
            {dayNames.map((day) => (
              <div
                key={day}
                className='p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-500'
              >
                {day}
              </div>
            ))}
          </div>
          <div className='grid grid-cols-7 gap-1'>
            {days.map((day, index) => (
              <div key={index} className='aspect-square'>
                {day && (
                  <button
                    onClick={() =>
                      !isDatePast(day) &&
                      isDateAvailable(day) &&
                      onDateSelect(day)
                    }
                    disabled={isDatePast(day) || !isDateAvailable(day)}
                    className={`w-full h-full rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      selectedDate?.toDateString() === day.toDateString()
                        ? 'bg-emerald-600 text-white'
                        : isDatePast(day)
                        ? 'text-gray-300 cursor-not-allowed'
                        : isDateAvailable(day)
                        ? 'hover:bg-emerald-50 text-gray-900 border border-emerald-200'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                    title={
                      !isDateAvailable(day) && !isDatePast(day)
                        ? `${getDayName(day)} - Ūkis uždarytas`
                        : undefined
                    }
                  >
                    {day.getDate()}
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className='mt-4 text-xs text-gray-500'>
            <p>🟢 Galimi vizitai: Antradieniais - Šeštadieniais</p>
            <p>🔴 Ūkis uždarytas: Sekmadieniais ir Pirmadieniais</p>
          </div>
        </CardContent>
      </Card>

      {/* Time Slots */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base sm:text-lg'>
            {selectedDate ? 'Galimi Laikai' : 'Pasirinkite Datą'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            <div className='space-y-4'>
              <div className='text-sm text-gray-600 p-3 bg-emerald-50 rounded-lg'>
                <p className='font-medium'>
                  {selectedDate.toLocaleDateString('lt-LT')}
                </p>
                <p>{getDayName(selectedDate)}</p>
              </div>
              <div className='grid grid-cols-2 gap-2'>
                {getAvailableTimesForDate(selectedDate).map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => onTimeSelect(time)}
                    className={`justify-center text-sm ${
                      selectedTime === time
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'hover:bg-emerald-50'
                    }`}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className='text-center text-gray-500 py-8'>
              <p className='text-sm'>
                Pasirinkite datą, kad pamatytumėte galimus laikus.
              </p>
              <p className='text-xs mt-2'>
                Ekskursijos vyksta antradieniais - šeštadieniais
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
