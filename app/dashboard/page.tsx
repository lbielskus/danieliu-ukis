'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Settings,
  Plus,
  MoreHorizontal,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import {
  getProviderByUserId,
  getBookingsByProvider,
  updateBooking,
  createProvider,
  createProviderSettings,
  getProvider,
  createProviderWithId,
} from '@/lib/firestore';
import type { ServiceProvider, Booking } from '@/lib/types';
import CalendarView from '@/components/CalendarView';
import BookingsList from '@/components/BookingsList';
import AvailabilitySettings from '@/components/AvailabilitySettings';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't run if auth is still loading
    if (authLoading) return;

    // Redirect if not authenticated
    if (!user) {
      router.push('/login');
      return;
    }

    // If user is a client, redirect to home
    if (user.role !== 'provider') {
      router.push('/');
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get provider data
        const providerData = await getProviderByUserId(user.id);

        if (!providerData) {
          // If no provider profile exists, create one for the admin
          try {
            const providerId = await createProvider({
              userId: user.id,
              businessName: 'Danielių Ūkis',
              description: 'Europos danielių ūkio ekskursijos',
              location: 'Kaimo Slėnis, Gamtos Apskritis',
              phone: user.phone || '+370 123 45678',
              rating: 4.9,
              reviewCount: 127,
              isActive: true,
            });

            // Create default provider settings
            await createProviderSettings({
              providerId,
              bufferTime: 15,
              maxAdvanceBooking: 30,
              requireConfirmation: true,
              allowCancellation: true,
              cancellationDeadline: 24,
              emailNotifications: true,
              smsNotifications: false,
            });

            // Reload provider data
            const newProviderData = await getProviderByUserId(user.id);
            setProvider(newProviderData);
          } catch (createError) {
            setError(
              'Nepavyko sukurti administratoriaus profilio. Bandykite dar kartą.'
            );
            setLoading(false);
            return;
          }
        } else {
          setProvider(providerData);
        }

        // Ensure deer farm provider exists with fixed ID
        try {
          const deerFarmProvider = await getProvider('deer-farm-provider');
          if (!deerFarmProvider) {
            await createProviderWithId('deer-farm-provider', {
              userId: user.id,
              businessName: 'Danielių Ūkis',
              description: 'Europos danielių ūkio ekskursijos',
              location: 'Kaimo Slėnis, Gamtos Apskritis',
              phone: user.phone || '+370 123 45678',
              rating: 4.9,
              reviewCount: 127,
              isActive: true,
            });
          }
        } catch (error) {
          console.error('Error creating deer farm provider:', error);
        }

        // Get bookings for deer farm
        try {
          const deerFarmBookings = await getBookingsByProvider(
            'deer-farm-provider'
          );
          setBookings(deerFarmBookings);
        } catch (bookingError) {
          setBookings([]);
        }
      } catch (error) {
        setError('Nepavyko įkelti duomenų. Pabandykite atnaujinti puslapį.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, authLoading, router]);

  const handleBookingStatusChange = async (
    bookingId: string,
    newStatus: string
  ) => {
    try {
      await updateBooking(bookingId, { status: newStatus as any });

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: newStatus as any }
            : booking
        )
      );

      toast.success(`Booking ${newStatus} successfully`);
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  // Show loading spinner while auth is loading
  if (authLoading || loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center max-w-md'>
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
            <h2 className='text-lg font-semibold mb-2'>Dashboard Error</h2>
            <p>{error}</p>
          </div>
          <div className='space-x-4'>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
            <Button variant='outline' onClick={() => router.push('/')}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show provider setup needed
  if (!provider) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center max-w-md'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Complete Your Provider Setup
          </h1>
          <p className='text-gray-600 mb-6'>
            You need to complete your provider profile before accessing the
            dashboard.
          </p>
          <Button onClick={() => router.push('/setup')}>Complete Setup</Button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter((b) => b.date === today).length;
  const confirmedBookings = bookings.filter(
    (b) => b.status === 'confirmed'
  ).length;
  const totalRevenue = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + b.price, 0);

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white border-b'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Rezervacijų Valdymas
              </h1>
              <p className='text-gray-600'>Sveiki sugrįžę, {user?.name}!</p>
            </div>
            <div className='flex items-center space-x-4'>
              <Button>
                <Plus className='h-4 w-4 mr-2' />
                Nauja Rezervacija
              </Button>
              <Button variant='outline' size='icon'>
                <Settings className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className='p-6'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Today's Bookings
              </CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{todayBookings}</div>
              <p className='text-xs text-muted-foreground'>
                Active appointments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Bookings
              </CardTitle>
              <Clock className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{bookings.length}</div>
              <p className='text-xs text-muted-foreground'>All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Revenue</CardTitle>
              <div className='text-sm font-medium text-green-600'>
                ${totalRevenue}
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>${totalRevenue}</div>
              <p className='text-xs text-muted-foreground'>
                From completed bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Rating</CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {provider.rating.toFixed(1)}
              </div>
              <p className='text-xs text-muted-foreground'>
                {provider.reviewCount} reviews
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'
        >
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='calendar'>Calendar</TabsTrigger>
            <TabsTrigger value='bookings'>Bookings</TabsTrigger>
            <TabsTrigger value='availability'>Availability</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Your latest appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {recentBookings.length === 0 ? (
                      <div className='text-center py-8 text-gray-500'>
                        <Calendar className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                        <p>No bookings yet</p>
                      </div>
                    ) : (
                      recentBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className='flex items-center justify-between p-3 border rounded-lg'
                        >
                          <div className='flex-1'>
                            <div className='flex items-center space-x-2'>
                              <p className='font-medium'>
                                {booking.clientName}
                              </p>
                              <Badge
                                variant={
                                  booking.status === 'confirmed'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {booking.status}
                              </Badge>
                            </div>
                            <p className='text-sm text-gray-600'>
                              {booking.serviceName}
                            </p>
                            <p className='text-sm text-gray-500'>
                              {booking.date} at {booking.startTime}
                            </p>
                          </div>
                          <div className='text-right'>
                            <p className='font-medium'>${booking.price}</p>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='sm'>
                                  <MoreHorizontal className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleBookingStatusChange(
                                      booking.id,
                                      'confirmed'
                                    )
                                  }
                                >
                                  <CheckCircle className='h-4 w-4 mr-2' />
                                  Confirm
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleBookingStatusChange(
                                      booking.id,
                                      'cancelled'
                                    )
                                  }
                                >
                                  <XCircle className='h-4 w-4 mr-2' />
                                  Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks</CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <Button
                    className='w-full justify-start bg-transparent'
                    variant='outline'
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Add New Booking
                  </Button>
                  <Button
                    className='w-full justify-start bg-transparent'
                    variant='outline'
                  >
                    <Calendar className='h-4 w-4 mr-2' />
                    Block Time Slot
                  </Button>
                  <Button
                    className='w-full justify-start bg-transparent'
                    variant='outline'
                  >
                    <Users className='h-4 w-4 mr-2' />
                    Add New Service
                  </Button>
                  <Button
                    className='w-full justify-start bg-transparent'
                    variant='outline'
                  >
                    <Settings className='h-4 w-4 mr-2' />
                    Update Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='calendar'>
            <CalendarView bookings={bookings} />
          </TabsContent>

          <TabsContent value='bookings'>
            <BookingsList
              bookings={bookings}
              onStatusChange={handleBookingStatusChange}
            />
          </TabsContent>

          <TabsContent value='availability'>
            <AvailabilitySettings providerId={provider.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
