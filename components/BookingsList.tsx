'use client';

import { useState } from 'react';
import {
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Booking } from '@/lib/types';

interface BookingsListProps {
  bookings: Booking[];
  onStatusChange: (bookingId: string, newStatus: string) => void;
}

export default function BookingsList({
  bookings,
  onStatusChange,
}: BookingsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch =
        booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'client') {
        return a.clientName.localeCompare(b.clientName);
      }
      if (sortBy === 'price') {
        return b.price - a.price;
      }
      return 0;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>All Bookings</CardTitle>
          <div className='flex items-center space-x-2'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search bookings...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 w-64'
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-32'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='confirmed'>Confirmed</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='cancelled'>Cancelled</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className='w-32'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='date'>Date</SelectItem>
                <SelectItem value='client'>Client</SelectItem>
                <SelectItem value='price'>Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {filteredBookings.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              <Calendar className='h-12 w-12 mx-auto mb-4 text-gray-300' />
              <p>No bookings found matching your criteria.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors'
              >
                <div className='flex items-center space-x-4'>
                  <div className='flex-shrink-0'>
                    <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                      <span className='text-sm font-medium text-blue-600'>
                        {booking.clientName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center space-x-2'>
                      <p className='text-sm font-medium text-gray-900 truncate'>
                        {booking.clientName}
                      </p>
                      <Badge variant={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    <p className='text-sm text-gray-600 truncate'>
                      {booking.serviceName}
                    </p>
                    <div className='flex items-center space-x-4 mt-1'>
                      <div className='flex items-center space-x-1 text-xs text-gray-500'>
                        <Calendar className='h-3 w-3' />
                        <span>
                          {new Date(booking.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className='flex items-center space-x-1 text-xs text-gray-500'>
                        <Clock className='h-3 w-3' />
                        <span>{booking.startTime}</span>
                      </div>
                      <div className='text-xs text-gray-500'>
                        {booking.duration} min
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex items-center space-x-4'>
                  <div className='text-right'>
                    <p className='text-sm font-medium text-gray-900'>
                      ${booking.price}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='sm'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(booking.id, 'confirmed')}
                      >
                        <CheckCircle className='h-4 w-4 mr-2' />
                        Confirm
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(booking.id, 'cancelled')}
                      >
                        <XCircle className='h-4 w-4 mr-2' />
                        Cancel
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(booking.id, 'completed')}
                      >
                        <Clock className='h-4 w-4 mr-2' />
                        Mark Complete
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
  );
}
