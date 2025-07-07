'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
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
import { getProviderByUserId } from '@/lib/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import type { ServiceProvider } from '@/lib/types';

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    businessName: '',
    description: '',
    location: '',
  });

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && user.role !== 'provider') {
      router.push('/');
      return;
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
      }));

      // Load provider data if user is admin
      const loadProviderData = async () => {
        try {
          const providerData = await getProviderByUserId(user.id);
          if (providerData) {
            setProvider(providerData);
            setFormData((prev) => ({
              ...prev,
              businessName: providerData.businessName,
              description: providerData.description,
              location: providerData.location,
            }));
          }
        } catch (error) {
          console.error('Error loading provider data:', error);
        }
      };

      loadProviderData();
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      // Update user document
      const userRef = doc(db, 'users', user.id);
      const updateData: any = {
        name: formData.name,
      };

      if (formData.phone) {
        updateData.phone = formData.phone;
      }

      await updateDoc(userRef, updateData);

      // Update provider data if exists
      if (provider) {
        const providerRef = doc(db, 'providers', provider.id);
        await updateDoc(providerRef, {
          businessName: formData.businessName,
          description: formData.description,
          location: formData.location,
          phone: formData.phone,
        });
      }

      toast.success('Profilis sėkmingai atnaujintas!');
    } catch (error: any) {
      toast.error('Nepavyko atnaujinti profilio');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Kraunama...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'provider') {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />
      <div className='py-12 px-4'>
        <div className='max-w-md mx-auto'>
          <div className='text-center mb-8'>
            <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <User className='h-8 w-8 text-emerald-600' />
            </div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Administratoriaus Profilis
            </h1>
            <p className='text-gray-600'>Atnaujinkite savo informaciją</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profilio Informacija</CardTitle>
              <CardDescription>Redaguokite savo duomenis</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <Label htmlFor='name'>Vardas ir Pavardė</Label>
                  <Input
                    id='name'
                    placeholder='Jūsų vardas ir pavardė'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='phone'>Telefono Numeris</Label>
                  <Input
                    id='phone'
                    placeholder='Jūsų telefono numeris'
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor='business-name'>Ūkio Pavadinimas</Label>
                  <Input
                    id='business-name'
                    placeholder='Danielių ūkio pavadinimas'
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='location'>Vieta</Label>
                  <Input
                    id='location'
                    placeholder='Ūkio vieta'
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='description'>Ūkio Aprašymas</Label>
                  <Textarea
                    id='description'
                    placeholder='Aprašykite savo ūkį...'
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <Button
                  type='submit'
                  className='w-full bg-emerald-600 hover:bg-emerald-700'
                  disabled={isLoading}
                >
                  {isLoading ? 'Atnaujinama...' : 'Atnaujinti Profilį'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
