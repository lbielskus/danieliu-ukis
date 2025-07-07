'use client';

import { useState } from 'react';
import { Calendar, MapPin, Star, ArrowLeft, Clock } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import BookingCalendar from '@/components/BookingCalendar';
import { createBooking } from '@/lib/firestore';
import { toast } from 'sonner';

// Deer farm tour information in Lithuanian
const deerFarmInfo = {
  id: 'deer-farm',
  name: 'Europos Danielių Ūkio Ekskursijos',
  description:
    'Patirti Europos danielių grožį jų natūralioje aplinkoje su mūsų gidų ekskursijomis',
  rating: 4.9,
  reviewCount: 127,
  location: 'Kaimo Slėnis, Gamtos Apskritis',
  image: '/1.jpg', // Using the first deer image as the main image
  tourOptions: [
    {
      id: 'standard',
      name: 'Standartinė Ekskursija',
      duration: 90,
      price: 25,
      description:
        'Pagrindinė gidų ekskursija su danielių stebėjimu ir šėrimo demonstracija',
    },
    {
      id: 'family',
      name: 'Šeimos Patirtis',
      duration: 120,
      price: 35,
      description:
        'Išplėsta ekskursija su interaktyvia veikla vaikams ir fotografavimo galimybėmis',
    },
    {
      id: 'photography',
      name: 'Fotografijos Ekskursija',
      duration: 180,
      price: 45,
      description:
        'Išplėsta ekskursija, skirta fotografijai su geriausiais stebėjimo taškais ir apšvietimo patarimais',
    },
    {
      id: 'educational',
      name: 'Švietėjiška Grupės Ekskursija',
      duration: 150,
      price: 30,
      description:
        'Detalus švietėjiškas turas, puikiai tinkantis mokykloms ir mokymosi grupėms',
    },
  ],
};

export default function DeerFarmBookingPage() {
  const [selectedTour, setSelectedTour] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    numberOfPeople: '',
    specialRequests: '',
  });

  const selectedTourData = deerFarmInfo.tourOptions.find(
    (t) => t.id === selectedTour
  );

  const handleBookingSubmit = async () => {
    if (!selectedTourData || !selectedDate || !selectedTime) {
      toast.error('Prašome užpildyti visus laukus');
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate total price
      const totalPrice =
        selectedTourData.price *
        Number.parseInt(bookingData.numberOfPeople || '1');

      // Calculate end time
      const startTime = selectedTime;
      const [hours, minutes] = startTime.split(':').map(Number);
      const endDate = new Date();
      endDate.setHours(hours, minutes + selectedTourData.duration);
      const endTime = endDate.toTimeString().slice(0, 5);

      // Create booking in Firebase
      await createBooking({
        providerId: 'deer-farm-provider', // We'll use a fixed provider ID for the deer farm
        clientName: bookingData.name,
        clientEmail: bookingData.email,
        clientPhone: bookingData.phone,
        serviceId: selectedTour,
        serviceName: selectedTourData.name,
        date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD format
        startTime: selectedTime,
        endTime: endTime,
        duration: selectedTourData.duration,
        price: totalPrice,
        status: 'pending',
        notes: bookingData.specialRequests,
      });

      toast.success('Rezervacija sėkmingai sukurta!');
      setStep(4); // Success step
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Nepavyko sukurti rezervacijos. Bandykite dar kartą.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-100'>
      {/* Header */}
      <header className='bg-white border-b shadow-sm'>
        <div className='px-6 py-4'>
          <div className='flex items-center space-x-4'>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Grįžti Namo
              </Link>
            </Button>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Užsisakykite Danielių Ūkio Apsilankymą
              </h1>
              <p className='text-gray-600'>
                Rezervuokite vietą nepamirštamai patirčiai
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className='max-w-6xl mx-auto p-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Farm Info */}
          <div className='lg:col-span-1'>
            <Card className='sticky top-6 shadow-lg'>
              <CardHeader>
                <div className='flex items-center space-x-4'>
                  <img
                    src={deerFarmInfo.image || '/placeholder.svg'}
                    alt={deerFarmInfo.name}
                    className='w-16 h-16 rounded-full object-cover border-2 border-emerald-200'
                  />
                  <div>
                    <CardTitle className='text-lg'>
                      {deerFarmInfo.name}
                    </CardTitle>
                    <div className='flex items-center space-x-1 mt-1'>
                      <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                      <span className='text-sm font-medium'>
                        {deerFarmInfo.rating}
                      </span>
                      <span className='text-sm text-gray-500'>
                        ({deerFarmInfo.reviewCount} atsiliepimai)
                      </span>
                    </div>
                  </div>
                </div>
                <CardDescription className='mt-4'>
                  {deerFarmInfo.description}
                </CardDescription>
                <div className='flex items-center space-x-2 mt-2'>
                  <MapPin className='h-4 w-4 text-gray-500' />
                  <span className='text-sm text-gray-600'>
                    {deerFarmInfo.location}
                  </span>
                </div>
              </CardHeader>

              {selectedTourData && (
                <CardContent className='border-t'>
                  <h3 className='font-medium mb-2'>Pasirinkta Ekskursija</h3>
                  <div className='space-y-2'>
                    <p className='font-medium'>{selectedTourData.name}</p>
                    <p className='text-sm text-gray-600'>
                      {selectedTourData.description}
                    </p>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Trukmė:</span>
                      <span>{selectedTourData.duration} minutės</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Kaina vienam:</span>
                      <span className='font-medium'>
                        {selectedTourData.price}€
                      </span>
                    </div>
                    {bookingData.numberOfPeople && (
                      <div className='flex justify-between text-sm font-medium border-t pt-2'>
                        <span>
                          Iš viso ({bookingData.numberOfPeople} žmonės):
                        </span>
                        <span className='text-emerald-600'>
                          {selectedTourData.price *
                            Number.parseInt(bookingData.numberOfPeople)}
                          €
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Booking Form */}
          <div className='lg:col-span-2'>
            <Card className='shadow-lg'>
              <CardHeader>
                <div className='flex items-center space-x-4'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= 1
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    1
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= 2
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    2
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= 3
                        ? 'bg-emerald-600 text-white'
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
                        Pasirinkite Ekskursijos Tipą
                      </h3>
                      <div className='grid gap-4'>
                        {deerFarmInfo.tourOptions.map((tour) => (
                          <div
                            key={tour.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedTour === tour.id
                                ? 'border-emerald-600 bg-emerald-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedTour(tour.id)}
                          >
                            <div className='flex justify-between items-start'>
                              <div className='flex-1'>
                                <h4 className='font-medium'>{tour.name}</h4>
                                <p className='text-sm text-gray-600 mt-1'>
                                  {tour.description}
                                </p>
                                <div className='flex items-center space-x-4 mt-2 text-sm text-gray-500'>
                                  <div className='flex items-center space-x-1'>
                                    <Clock className='h-4 w-4' />
                                    <span>{tour.duration} min</span>
                                  </div>
                                </div>
                              </div>
                              <div className='text-right'>
                                <p className='font-medium text-emerald-600'>
                                  {tour.price}€
                                </p>
                                <p className='text-xs text-gray-500'>vienam</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!selectedTour}
                      className='w-full bg-emerald-600 hover:bg-emerald-700'
                    >
                      Tęsti į Datą ir Laiką
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className='space-y-6'>
                    <div>
                      <h3 className='text-lg font-medium mb-4'>
                        Pasirinkite Datą ir Laiką
                      </h3>
                      <BookingCalendar
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        selectedTime={selectedTime}
                        onTimeSelect={setSelectedTime}
                        duration={selectedTourData?.duration || 90}
                      />
                    </div>
                    <div className='flex space-x-4'>
                      <Button
                        variant='outline'
                        onClick={() => setStep(1)}
                        className='flex-1'
                      >
                        Atgal
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        disabled={!selectedDate || !selectedTime}
                        className='flex-1 bg-emerald-600 hover:bg-emerald-700'
                      >
                        Tęsti į Duomenis
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className='space-y-6'>
                    <div>
                      <h3 className='text-lg font-medium mb-4'>
                        Lankytojų Informacija
                      </h3>
                      <div className='grid gap-4'>
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <Label htmlFor='name'>Kontaktinis Vardas</Label>
                            <Input
                              id='name'
                              value={bookingData.name}
                              onChange={(e) =>
                                setBookingData({
                                  ...bookingData,
                                  name: e.target.value,
                                })
                              }
                              placeholder='Jūsų vardas ir pavardė'
                            />
                          </div>
                          <div>
                            <Label htmlFor='email'>El. paštas</Label>
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
                              placeholder='jusu@elpastas.lt'
                            />
                          </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <Label htmlFor='phone'>Telefono Numeris</Label>
                            <Input
                              id='phone'
                              value={bookingData.phone}
                              onChange={(e) =>
                                setBookingData({
                                  ...bookingData,
                                  phone: e.target.value,
                                })
                              }
                              placeholder='Jūsų telefono numeris'
                            />
                          </div>
                          <div>
                            <Label htmlFor='numberOfPeople'>
                              Lankytojų Skaičius
                            </Label>
                            <Select
                              value={bookingData.numberOfPeople}
                              onValueChange={(value) =>
                                setBookingData({
                                  ...bookingData,
                                  numberOfPeople: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Kiek žmonių?' />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num} {num === 1 ? 'žmogus' : 'žmonės'}
                                  </SelectItem>
                                ))}
                                <SelectItem value='10+'>
                                  10+ žmonių (susisiekite su mumis)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor='specialRequests'>
                            Specialūs Prašymai ar Klausimai
                          </Label>
                          <Textarea
                            id='specialRequests'
                            value={bookingData.specialRequests}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                specialRequests: e.target.value,
                              })
                            }
                            placeholder='Bet kokie specialūs poreikiai, mitybos apribojimai ar klausimai...'
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
                        Atgal
                      </Button>
                      <Button
                        onClick={handleBookingSubmit}
                        disabled={
                          !bookingData.name ||
                          !bookingData.email ||
                          !bookingData.numberOfPeople ||
                          isSubmitting
                        }
                        className='flex-1 bg-emerald-600 hover:bg-emerald-700'
                      >
                        {isSubmitting
                          ? 'Kuriama rezervacija...'
                          : 'Patvirtinti Užsakymą'}
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
                        Užsakymas Patvirtintas!
                      </h3>
                      <p className='text-gray-600'>
                        Jūsų danielių ūkio apsilankymas sėkmingai užsakytas.
                        Netrukus gausite patvirtinimo el. laišką su visais
                        detaliais.
                      </p>
                    </div>
                    <div className='bg-gray-50 p-4 rounded-lg text-left'>
                      <h4 className='font-medium mb-2'>Apsilankymo Detalės:</h4>
                      <div className='space-y-1 text-sm'>
                        <p>
                          <span className='text-gray-600'>Ekskursija:</span>{' '}
                          {selectedTourData?.name}
                        </p>
                        <p>
                          <span className='text-gray-600'>Data:</span>{' '}
                          {selectedDate?.toLocaleDateString('lt-LT')}
                        </p>
                        <p>
                          <span className='text-gray-600'>Laikas:</span>{' '}
                          {selectedTime}
                        </p>
                        <p>
                          <span className='text-gray-600'>Trukmė:</span>{' '}
                          {selectedTourData?.duration} minutės
                        </p>
                        <p>
                          <span className='text-gray-600'>Lankytojai:</span>{' '}
                          {bookingData.numberOfPeople} žmonės
                        </p>
                        <p>
                          <span className='text-gray-600'>Bendra Kaina:</span>{' '}
                          {selectedTourData
                            ? selectedTourData.price *
                              Number.parseInt(bookingData.numberOfPeople)
                            : 0}
                          €
                        </p>
                      </div>
                    </div>
                    <div className='space-y-3'>
                      <Button
                        asChild
                        className='w-full bg-emerald-600 hover:bg-emerald-700'
                      >
                        <Link href='/'>Grįžti Namo</Link>
                      </Button>
                      <p className='text-sm text-gray-500'>
                        Klausimai? Skambinkite +370 123 45678 arba rašykite
                        info@danieliuukis.lt
                      </p>
                    </div>
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
