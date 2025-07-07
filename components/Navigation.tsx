'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useState } from 'react';

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sėkmingai atsijungėte');
      router.push('/');
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Nepavyko atsijungti');
    }
  };

  return (
    <nav className='bg-white border-b shadow-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link href='/' className='flex items-center space-x-2 sm:space-x-3'>
              <img
                src='/logodan.png'
                alt='Danielių Ūkio Logo'
                className='h-10 sm:h-12 w-auto'
              />
              <span
                className='text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-wide'
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Danielių Kiemas
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center space-x-4'>
            {user ? (
              <>
                <div className='flex items-center space-x-2'>
                  <User className='h-4 w-4 text-gray-500' />
                  <span className='text-sm text-gray-700'>{user.name}</span>
                  <span className='text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded'>
                    {user.role === 'provider' ? 'Administratorius' : 'Klientas'}
                  </span>
                </div>
                {user.role === 'provider' && (
                  <>
                    <Button variant='outline' size='sm' asChild>
                      <Link href='/dashboard'>Rezervacijos</Link>
                    </Button>
                    <Button variant='ghost' size='sm' asChild>
                      <Link href='/profile'>Profilis</Link>
                    </Button>
                  </>
                )}
                <Button variant='ghost' size='sm' onClick={handleLogout}>
                  <LogOut className='h-4 w-4 mr-2' />
                  Atsijungti
                </Button>
              </>
            ) : (
              <div className='flex items-center space-x-2'>
                <Button variant='ghost' size='sm' asChild>
                  <Link href='/login'>Prisijungti</Link>
                </Button>
                <Button
                  size='sm'
                  asChild
                  className='bg-emerald-600 hover:bg-emerald-700'
                >
                  <Link href='/register'>Registruotis</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='p-2'
            >
              {isMobileMenuOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden border-t bg-white'>
            <div className='px-2 pt-2 pb-3 space-y-1'>
              {user ? (
                <>
                  <div className='flex items-center space-x-2 px-3 py-2'>
                    <User className='h-4 w-4 text-gray-500' />
                    <span className='text-sm text-gray-700'>{user.name}</span>
                    <span className='text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded'>
                      {user.role === 'provider'
                        ? 'Administratorius'
                        : 'Klientas'}
                    </span>
                  </div>
                  {user.role === 'provider' && (
                    <>
                      <Link
                        href='/dashboard'
                        className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Rezervacijos
                      </Link>
                      <Link
                        href='/profile'
                        className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Profilis
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className='block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  >
                    <LogOut className='h-4 w-4 mr-2 inline' />
                    Atsijungti
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href='/login'
                    className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Prisijungti
                  </Link>
                  <Link
                    href='/register'
                    className='block px-3 py-2 text-base font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Registruotis
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
