'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User } from 'lucide-react';
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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Slaptažodžiai nesutampa');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Slaptažodis turi būti bent 6 simbolių ilgio');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        role: 'client',
      });
      toast.success('Paskyra sėkmingai sukurta!');
      router.push('/');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Šis el. paštas jau užregistruotas. Prisijunkite.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Slaptažodis per silpnas. Naudokite bent 6 simbolius.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Neteisingas el. pašto formatas');
      } else {
        toast.error(error.message || 'Nepavyko sukurti paskyros');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
              <User className='h-8 w-8 text-emerald-600' />
            </div>
            <CardTitle className='text-2xl'>Sukurkite paskyrą</CardTitle>
            <CardDescription>
              Registruokitės, kad galėtumėte užsisakyti ekskursijas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <Label htmlFor='name'>Vardas ir pavardė</Label>
                <Input
                  id='name'
                  placeholder='Įveskite savo vardą ir pavardę'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
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
                    placeholder='Sukurkite slaptažodį'
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    disabled={isLoading}
                    minLength={6}
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
              <div>
                <Label htmlFor='confirm-password'>
                  Patvirtinkite slaptažodį
                </Label>
                <div className='relative'>
                  <Input
                    id='confirm-password'
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Pakartokite slaptažodį'
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-4 w-4 text-gray-400' />
                    ) : (
                      <Eye className='h-4 w-4 text-gray-400' />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type='submit'
                className='w-full bg-emerald-600 hover:bg-emerald-700'
                disabled={isLoading}
              >
                {isLoading ? 'Kuriama paskyra...' : 'Sukurti paskyrą'}
              </Button>
            </form>

            <div className='mt-6'>
              <Separator className='my-4' />
              <div className='text-center'>
                <p className='text-sm text-gray-600'>
                  Jau turite paskyrą?{' '}
                  <Link
                    href='/login'
                    className='text-emerald-600 hover:underline font-medium'
                  >
                    Prisijunkite
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
