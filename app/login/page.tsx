'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'provider') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);

      toast.success('Sėkmingai prisijungėte!');
    } catch (error: any) {
      let errorMessage = 'Nepavyko prisijungti';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Paskyra su šiuo el. paštu nerasta';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Neteisingas slaptažodis';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Neteisingas el. pašto formatas';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Per daug bandymų. Bandykite vėliau';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Tikrinama autentifikacija...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if user is already logged in
  if (user) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Nukreipiama...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <Link href='/' className='inline-flex items-center space-x-3'>
            <img
              src='/logodan.png'
              alt='Danielių Kiemas Logo'
              className='h-8 w-8'
            />
            <span
              className='text-2xl font-bold text-gray-900'
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Danielių Kiemas
            </span>
          </Link>
        </div>

        <Card>
          <CardHeader className='text-center'>
            <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <LogIn className='h-8 w-8 text-emerald-600' />
            </div>
            <CardTitle className='text-2xl'>Sveiki sugrįžę</CardTitle>
            <CardDescription>Prisijunkite prie savo paskyros</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <Label htmlFor='email'>El. paštas</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Įveskite savo el. paštą'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor='password'>Slaptažodis</Label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Įveskite savo slaptažodį'
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4 text-gray-400' />
                    ) : (
                      <Eye className='h-4 w-4 text-gray-400' />
                    )}
                  </Button>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <Link
                  href='/forgot-password'
                  className='text-sm text-emerald-600 hover:underline'
                >
                  Pamiršote slaptažodį?
                </Link>
              </div>
              <Button
                type='submit'
                className='w-full bg-emerald-600 hover:bg-emerald-700'
                disabled={isLoading}
              >
                {isLoading ? 'Prisijungiama...' : 'Prisijungti'}
              </Button>
            </form>

            <div className='mt-6'>
              <Separator className='my-4' />
              <div className='text-center'>
                <p className='text-sm text-gray-600'>
                  Neturite paskyros?{' '}
                  <Link
                    href='/register'
                    className='text-emerald-600 hover:underline font-medium'
                  >
                    Registruokitės
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
