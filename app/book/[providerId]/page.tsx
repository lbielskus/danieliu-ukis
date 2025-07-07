'use client';

import { useState } from 'react';
import { Calendar, MapPin, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import BookingCalendar from '@/components/BookingCalendar';

// Mock provider data
const mockProvider = {
  id: '1',
  name: "Sarah's Hair Studio",
  description: 'Professional hair styling and coloring services',
  rating: 4.9,
  reviewCount: 127,
  location: 'Downtown Beauty District',
  image: '/placeholder.svg?height=200&width=200',
  services: [
    { id: '1', name: 'Haircut & Styling', duration: 60, price: 45 },
    { id: '2', name: 'Color Treatment', duration: 120, price: 85 },
    { id: '3', name: 'Highlights', duration: 180, price: 120 },
    { id: '4', name: 'Beard Trim', duration: 30, price: 25 },
  ],
};

export default function BookingPage({
  params,
}: {
  params: { providerId: string };
}) {
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const selectedServiceData = mockProvider.services.find(
    (s) => s.id === selectedService
  );

  const handleBookingSubmit = () => {
    // In production, this would make an API call to create the booking
    setStep(4); // Success step
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white border-b'>
        <div className='px-6 py-4'>
          <div className='flex items-center space-x-4'>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back
              </Link>
            </Button>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Book Appointment
              </h1>
              <p className='text-gray-600'>
                Schedule your service with {mockProvider.name}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className='max-w-4xl mx-auto p-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Provider Info */}
          <div className='lg:col-span-1'>
            <Card className='sticky top-6'>
              <CardHeader>
                <div className='flex items-center space-x-4'>
                  <img
                    src={mockProvider.image || '/placeholder.svg'}
                    alt={mockProvider.name}
                    className='w-16 h-16 rounded-full object-cover'
                  />
                  <div>
                    <CardTitle className='text-lg'>
                      {mockProvider.name}
                    </CardTitle>
                    <div className='flex items-center space-x-1 mt-1'>
                      <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                      <span className='text-sm font-medium'>
                        {mockProvider.rating}
                      </span>
                      <span className='text-sm text-gray-500'>
                        ({mockProvider.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <CardDescription className='mt-4'>
                  {mockProvider.description}
                </CardDescription>
                <div className='flex items-center space-x-2 mt-2'>
                  <MapPin className='h-4 w-4 text-gray-500' />
                  <span className='text-sm text-gray-600'>
                    {mockProvider.location}
                  </span>
                </div>
              </CardHeader>

              {selectedServiceData && (
                <CardContent className='border-t'>
                  <h3 className='font-medium mb-2'>Selected Service</h3>
                  <div className='space-y-2'>
                    <p className='font-medium'>{selectedServiceData.name}</p>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Duration:</span>
                      <span>{selectedServiceData.duration} min</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Price:</span>
                      <span className='font-medium'>
                        ${selectedServiceData.price}
                      </span>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Booking Form */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <div className='flex items-center space-x-4'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    1
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= 2
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    2
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= 3
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    3
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= 4
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    ✓
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {step === 1 && (
                  <div className='space-y-6'>
                    <div>
                      <h3 className='text-lg font-medium mb-4'>
                        Select a Service
                      </h3>
                      <div className='grid gap-4'>
                        {mockProvider.services.map((service) => (
                          <div
                            key={service.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedService === service.id
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedService(service.id)}
                          >
                            <div className='flex justify-between items-start'>
                              <div>
                                <h4 className='font-medium'>{service.name}</h4>
                                <p className='text-sm text-gray-600 mt-1'>
                                  {service.duration} minutes
                                </p>
                              </div>
                              <div className='text-right'>
                                <p className='font-medium'>${service.price}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!selectedService}
                      className='w-full'
                    >
                      Continue to Date & Time
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className='space-y-6'>
                    <div>
                      <h3 className='text-lg font-medium mb-4'>
                        Select Date & Time
                      </h3>
                      <BookingCalendar
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        selectedTime={selectedTime}
                        onTimeSelect={setSelectedTime}
                        duration={selectedServiceData?.duration || 60}
                      />
                    </div>
                    <div className='flex space-x-4'>
                      <Button
                        variant='outline'
                        onClick={() => setStep(1)}
                        className='flex-1'
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        disabled={!selectedDate || !selectedTime}
                        className='flex-1'
                      >
                        Continue to Details
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className='space-y-6'>
                    <div>
                      <h3 className='text-lg font-medium mb-4'>Your Details</h3>
                      <div className='grid gap-4'>
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <Label htmlFor='name'>Full Name</Label>
                            <Input
                              id='name'
                              value={bookingData.name}
                              onChange={(e) =>
                                setBookingData({
                                  ...bookingData,
                                  name: e.target.value,
                                })
                              }
                              placeholder='Enter your name'
                            />
                          </div>
                          <div>
                            <Label htmlFor='email'>Email</Label>
                            <Input
                              id='email'
                              type='email'
                              value={bookingData.email}
                              onChange={(e) =>
                                setBookingData({
                                  ...bookingData,
                                  email: e.target.value,
                                })
                              }
                              placeholder='Enter your email'
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor='phone'>Phone Number</Label>
                          <Input
                            id='phone'
                            value={bookingData.phone}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                phone: e.target.value,
                              })
                            }
                            placeholder='Enter your phone number'
                          />
                        </div>
                        <div>
                          <Label htmlFor='notes'>
                            Additional Notes (Optional)
                          </Label>
                          <Textarea
                            id='notes'
                            value={bookingData.notes}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                notes: e.target.value,
                              })
                            }
                            placeholder='Any special requests or notes...'
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex space-x-4'>
                      <Button
                        variant='outline'
                        onClick={() => setStep(2)}
                        className='flex-1'
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleBookingSubmit}
                        disabled={
                          !bookingData.name ||
                          !bookingData.email ||
                          !bookingData.phone
                        }
                        className='flex-1'
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className='text-center space-y-6'>
                    <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto'>
                      <Calendar className='h-8 w-8 text-green-600' />
                    </div>
                    <div>
                      <h3 className='text-xl font-medium text-gray-900 mb-2'>
                        Booking Confirmed!
                      </h3>
                      <p className='text-gray-600'>
                        Your appointment has been successfully booked. You'll
                        receive a confirmation email shortly.
                      </p>
                    </div>
                    <div className='bg-gray-50 p-4 rounded-lg text-left'>
                      <h4 className='font-medium mb-2'>Booking Details:</h4>
                      <div className='space-y-1 text-sm'>
                        <p>
                          <span className='text-gray-600'>Service:</span>{' '}
                          {selectedServiceData?.name}
                        </p>
                        <p>
                          <span className='text-gray-600'>Date:</span>{' '}
                          {selectedDate?.toLocaleDateString()}
                        </p>
                        <p>
                          <span className='text-gray-600'>Time:</span>{' '}
                          {selectedTime}
                        </p>
                        <p>
                          <span className='text-gray-600'>Duration:</span>{' '}
                          {selectedServiceData?.duration} minutes
                        </p>
                        <p>
                          <span className='text-gray-600'>Price:</span> $
                          {selectedServiceData?.price}
                        </p>
                      </div>
                    </div>
                    <Button asChild className='w-full'>
                      <Link href='/'>Return to Home</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
