'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Booking } from '@/lib/types';

interface CalendarViewProps {
  bookings: Booking[];
}

const timeSlots = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarView({ bookings }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'day'>('week');

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter((booking) => booking.date === dateStr);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Calendar</CardTitle>
          <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-1'>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setView('week')}
              >
                Week
              </Button>
              <Button
                variant={view === 'day' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setView('day')}
              >
                Day
              </Button>
            </div>
            <div className='flex items-center space-x-1'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => navigateWeek('prev')}
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => navigateWeek('next')}
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
            <Button size='sm'>
              <Plus className='h-4 w-4 mr-2' />
              Add Booking
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {view === 'week' && (
          <div className='overflow-x-auto'>
            <div className='min-w-full'>
              {/* Header */}
              <div className='grid grid-cols-8 gap-px bg-gray-200 rounded-t-lg overflow-hidden'>
                <div className='bg-white p-3 text-sm font-medium text-gray-500'>
                  Time
                </div>
                {weekDates.map((date, index) => (
                  <div key={index} className='bg-white p-3 text-center'>
                    <div className='text-sm font-medium text-gray-900'>
                      {weekDays[index]}
                    </div>
                    <div className='text-lg font-semibold text-gray-900'>
                      {date.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time slots */}
              <div className='bg-gray-200'>
                {timeSlots.map((time) => (
                  <div key={time} className='grid grid-cols-8 gap-px'>
                    <div className='bg-white p-3 text-sm text-gray-500 border-r'>
                      {time}
                    </div>
                    {weekDates.map((date, dayIndex) => {
                      const dayBookings = getBookingsForDate(date);
                      const timeBooking = dayBookings.find(
                        (booking) => booking.startTime === time
                      );

                      return (
                        <div
                          key={dayIndex}
                          className='bg-white p-1 min-h-[60px] relative'
                        >
                          {timeBooking && (
                            <div
                              className={`absolute inset-1 rounded p-2 text-xs ${
                                timeBooking.status === 'confirmed'
                                  ? 'bg-blue-100 border-l-4 border-blue-500'
                                  : 'bg-yellow-100 border-l-4 border-yellow-500'
                              }`}
                            >
                              <div className='font-medium truncate'>
                                {timeBooking.clientName}
                              </div>
                              <div className='text-gray-600 truncate'>
                                {timeBooking.serviceName}
                              </div>
                              <Badge
                                variant={
                                  timeBooking.status === 'confirmed'
                                    ? 'default'
                                    : 'secondary'
                                }
                                className='mt-1 text-xs'
                              >
                                {timeBooking.status}
                              </Badge>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'day' && (
          <div className='space-y-4'>
            <div className='text-center'>
              <h3 className='text-lg font-medium'>
                {currentDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
            </div>
            <div className='space-y-2'>
              {timeSlots.map((time) => {
                const dayBookings = getBookingsForDate(currentDate);
                const timeBooking = dayBookings.find(
                  (booking) => booking.startTime === time
                );

                return (
                  <div
                    key={time}
                    className='flex items-center space-x-4 p-3 border rounded-lg'
                  >
                    <div className='w-16 text-sm text-gray-500'>{time}</div>
                    <div className='flex-1'>
                      {timeBooking ? (
                        <div
                          className={`p-3 rounded ${
                            timeBooking.status === 'confirmed'
                              ? 'bg-blue-50 border border-blue-200'
                              : 'bg-yellow-50 border border-yellow-200'
                          }`}
                        >
                          <div className='flex items-center justify-between'>
                            <div>
                              <div className='font-medium'>
                                {timeBooking.clientName}
                              </div>
                              <div className='text-sm text-gray-600'>
                                {timeBooking.serviceName}
                              </div>
                            </div>
                            <Badge
                              variant={
                                timeBooking.status === 'confirmed'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {timeBooking.status}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className='text-gray-400 text-sm'>Available</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
