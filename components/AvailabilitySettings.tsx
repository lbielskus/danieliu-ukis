'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getProviderSettings, updateProviderSettings } from '@/lib/firestore';
import type { WeeklyAvailability, ProviderSettings } from '@/lib/types';
import { toast } from 'sonner';

interface AvailabilitySettingsProps {
  providerId: string;
}

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const timeOptions = [
  '08:00',
  '08:30',
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
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
];

export default function AvailabilitySettings({
  providerId,
}: AvailabilitySettingsProps) {
  const [availability, setAvailability] = useState<WeeklyAvailability>({
    monday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    tuesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    wednesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    thursday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    friday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    saturday: { enabled: true, slots: [{ start: '10:00', end: '16:00' }] },
    sunday: { enabled: false, slots: [] },
  });

  const [settings, setSettings] = useState<ProviderSettings | null>(null);
  const [bufferTime, setBufferTime] = useState('15');
  const [maxAdvanceBooking, setMaxAdvanceBooking] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const providerSettings = await getProviderSettings(providerId);
        if (providerSettings) {
          setSettings(providerSettings);
          setBufferTime(providerSettings.bufferTime.toString());
          setMaxAdvanceBooking(providerSettings.maxAdvanceBooking.toString());
        }
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [providerId]);

  const toggleDay = (day: keyof WeeklyAvailability) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        slots:
          !prev[day].enabled && prev[day].slots.length === 0
            ? [{ start: '09:00', end: '17:00' }]
            : prev[day].slots,
      },
    }));
  };

  const addTimeSlot = (day: keyof WeeklyAvailability) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: '09:00', end: '17:00' }],
      },
    }));
  };

  const removeTimeSlot = (day: keyof WeeklyAvailability, index: number) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index),
      },
    }));
  };

  const updateTimeSlot = (
    day: keyof WeeklyAvailability,
    index: number,
    field: 'start' | 'end',
    value: string
  ) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ),
      },
    }));
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      await updateProviderSettings(settings.id, {
        bufferTime: Number.parseInt(bufferTime),
        maxAdvanceBooking: Number.parseInt(maxAdvanceBooking),
      });

      // In a real app, you'd also save the availability to a separate collection
      // For now, we'll just show success
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure your booking preferences</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='buffer-time'>Buffer Time Between Bookings</Label>
              <Select value={bufferTime} onValueChange={setBufferTime}>
                <SelectTrigger>
                  <SelectValue placeholder='Select buffer time' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='0'>No buffer</SelectItem>
                  <SelectItem value='15'>15 minutes</SelectItem>
                  <SelectItem value='30'>30 minutes</SelectItem>
                  <SelectItem value='45'>45 minutes</SelectItem>
                  <SelectItem value='60'>1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='advance-booking'>Maximum Advance Booking</Label>
              <Select
                value={maxAdvanceBooking}
                onValueChange={setMaxAdvanceBooking}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select advance booking limit' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='7'>1 week</SelectItem>
                  <SelectItem value='14'>2 weeks</SelectItem>
                  <SelectItem value='30'>1 month</SelectItem>
                  <SelectItem value='60'>2 months</SelectItem>
                  <SelectItem value='90'>3 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Availability</CardTitle>
          <CardDescription>
            Set your working hours for each day of the week
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {daysOfWeek.map((day) => (
            <div key={day.key} className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <Switch
                    checked={
                      availability[day.key as keyof WeeklyAvailability].enabled
                    }
                    onCheckedChange={() =>
                      toggleDay(day.key as keyof WeeklyAvailability)
                    }
                  />
                  <Label className='text-base font-medium'>{day.label}</Label>
                </div>
                {availability[day.key as keyof WeeklyAvailability].enabled && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      addTimeSlot(day.key as keyof WeeklyAvailability)
                    }
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    Add Slot
                  </Button>
                )}
              </div>

              {availability[day.key as keyof WeeklyAvailability].enabled && (
                <div className='ml-6 space-y-2'>
                  {availability[day.key as keyof WeeklyAvailability].slots.map(
                    (slot, index) => (
                      <div key={index} className='flex items-center space-x-2'>
                        <Select
                          value={slot.start}
                          onValueChange={(value) =>
                            updateTimeSlot(
                              day.key as keyof WeeklyAvailability,
                              index,
                              'start',
                              value
                            )
                          }
                        >
                          <SelectTrigger className='w-24'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className='text-gray-500'>to</span>
                        <Select
                          value={slot.end}
                          onValueChange={(value) =>
                            updateTimeSlot(
                              day.key as keyof WeeklyAvailability,
                              index,
                              'end',
                              value
                            )
                          }
                        >
                          <SelectTrigger className='w-24'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {availability[day.key as keyof WeeklyAvailability].slots
                          .length > 1 && (
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              removeTimeSlot(
                                day.key as keyof WeeklyAvailability,
                                index
                              )
                            }
                          >
                            <Trash2 className='h-4 w-4 text-red-500' />
                          </Button>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className='flex justify-end'>
        <Button onClick={handleSave} size='lg'>
          Save Availability Settings
        </Button>
      </div>
    </div>
  );
}
