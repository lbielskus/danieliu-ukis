'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Building } from 'lucide-react';
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
import { useAuth } from '@/hooks/useAuth';
import { createProvider, createProviderSettings } from '@/lib/firestore';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    location: '',
    phone: '',
  });

  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      // Create provider profile
      const providerId = await createProvider({
        userId: user.id,
        businessName: formData.businessName,
        description: formData.description,
        location: formData.location,
        phone: formData.phone,
        rating: 0,
        reviewCount: 0,
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

      toast.success('Provider profile created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create provider profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-gray-600'>Please sign in to continue.</p>
          <Button asChild className='mt-4'>
            <Link href='/login'>Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <Link href='/' className='inline-flex items-center space-x-2'>
            <Calendar className='h-8 w-8 text-blue-600' />
            <span className='text-2xl font-bold text-gray-900'>BookEasy</span>
          </Link>
        </div>

        <Card>
          <CardHeader className='text-center'>
            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Building className='h-8 w-8 text-blue-600' />
            </div>
            <CardTitle className='text-2xl'>
              Complete Your Provider Setup
            </CardTitle>
            <CardDescription>
              Tell us about your business to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <Label htmlFor='business-name'>Business Name</Label>
                <Input
                  id='business-name'
                  placeholder='Your business name'
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor='phone'>Phone Number</Label>
                <Input
                  id='phone'
                  placeholder='Your business phone'
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor='location'>Location</Label>
                <Input
                  id='location'
                  placeholder='City, State'
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor='description'>Business Description</Label>
                <Textarea
                  id='description'
                  placeholder='Describe your services...'
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? 'Setting up...' : 'Complete Setup'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
