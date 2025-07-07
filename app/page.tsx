'use client';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Users,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import ImageCarousel from '@/components/ImageCarousel';
import ReviewsSection from '@/components/ReviewsSection';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-100'>
      {/* Navigation */}
      <Navigation />

      {/* Hero Section with Image Carousel */}
      <section className='relative py-8 sm:py-12 lg:py-20 px-4 overflow-hidden'>
        <div className='container mx-auto'>
          <div className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
            <div className='text-center lg:text-left order-2 lg:order-1'>
              <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6'>
                Patirtis Gamtoje
                <span className='text-emerald-600'> Su Danieliais</span>
              </h1>
              <p className='text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0'>
                Aplankykite mūsų europietiškų danielių ūkį ir pamatykite šiuos
                nuostabius gyvūnus jų natūralioje aplinkoje. Užsisakykite gido
                ekskursiją ir sukurkite nepamirštamus prisiminimus su šeima ir
                draugais.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                <Button
                  size='lg'
                  asChild
                  className='text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-700'
                >
                  <Link href='/book/deer-farm'>
                    Laiko rezervacija
                    <ArrowRight className='ml-2 h-4 w-4 sm:h-5 sm:w-5' />
                  </Link>
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  asChild
                  className='text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur'
                >
                  <Link href='#about'>Sužinoti Daugiau</Link>
                </Button>
              </div>
            </div>
            <div className='relative order-1 lg:order-2'>
              <ImageCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id='about' className='py-12 sm:py-16 lg:py-20 px-4 bg-white'>
        <div className='container mx-auto'>
          <div className='text-center mb-12 sm:mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
              Apie Mūsų Danielių Ūkį
            </h2>
            <p className='text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto'>
              Mūsų šeimos ūkis jau dešimtmetį yra europietiškų danielių namai.
              Siūlome gido ekskursijas, kuriose galėsite iš arti stebėti šiuos
              gražius gyvūnus ir sužinoti apie jų elgesį bei buveinę.
            </p>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
            <Card className='border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-emerald-50 to-green-50'>
              <CardHeader className='text-center'>
                <Calendar className='h-10 w-10 sm:h-12 sm:w-12 text-emerald-600 mb-4 mx-auto' />
                <CardTitle className='text-emerald-800'>
                  Gido Ekskursijos
                </CardTitle>
                <CardDescription className='text-gray-600'>
                  Profesionalaus gido ekskursijos kasdien. Sužinokite apie
                  danielių elgesį, mitybos įpročius ir jų pastangas apsisaugoti.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50'>
              <CardHeader className='text-center'>
                <Users className='h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mb-4 mx-auto' />
                <CardTitle className='text-blue-800'>
                  Pritaikyta Šeimoms
                </CardTitle>
                <CardDescription className='text-gray-600'>
                  Puikiai tinka šeimoms su vaikais. Švietėjiška ir pramoginga
                  patirtis visų amžiaus lankytojams.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-amber-50 to-orange-50 sm:col-span-2 lg:col-span-1'>
              <CardHeader className='text-center'>
                <Clock className='h-10 w-10 sm:h-12 sm:w-12 text-amber-600 mb-4 mx-auto' />
                <CardTitle className='text-amber-800'>
                  Lankstus grafikas
                </CardTitle>
                <CardDescription className='text-gray-600'>
                  Keletas rezervacijų per dieną. Užsisakykite laiką, kuris
                  geriausiai tinka jūsų tvarkaraščiui.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Contact & Location */}
      <section className='py-12 sm:py-16 lg:py-20 px-4 bg-emerald-600'>
        <div className='container mx-auto text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6'>
            Planuokite Savo Apsilankymą
          </h2>
          <p className='text-lg sm:text-xl text-emerald-100 mb-6 sm:mb-8 max-w-2xl mx-auto'>
            Pasiruošę patirti europietiškų danielių grožį? Užsisakykite
            apsilankymą šiandien ir sukurkite prisiminimus, kurie išliks visam
            gyvenimui.
          </p>

          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8'>
            <div className='text-center'>
              <MapPin className='h-6 w-6 sm:h-8 sm:w-8 text-emerald-200 mx-auto mb-2' />
              <h3 className='text-base sm:text-lg font-semibold text-white mb-1'>
                Vieta
              </h3>
              <p className='text-sm sm:text-base text-emerald-100'>
                Bagotšilio ūkis
                <br />
                Antanavo g. 1, Kazlų Rūdos savivaldybė
              </p>
            </div>
            <div className='text-center'>
              <Clock className='h-6 w-6 sm:h-8 sm:w-8 text-emerald-200 mx-auto mb-2' />
              <h3 className='text-base sm:text-lg font-semibold text-white mb-1'>
                Darbo Laikas
              </h3>
              <p className='text-sm sm:text-base text-emerald-100'>
                Kasdien: 9:00 - 18:00
                <br />
                Ekskursijos kas 2 valandas
              </p>
            </div>
            <div className='text-center sm:col-span-2 lg:col-span-1'>
              <Phone className='h-6 w-6 sm:h-8 sm:w-8 text-emerald-200 mx-auto mb-2' />
              <h3 className='text-base sm:text-lg font-semibold text-white mb-1'>
                Kontaktai
              </h3>
              <p className='text-sm sm:text-base text-emerald-100'>
                +370 69803302
                <br />
                info@danieliuukis.lt
              </p>
            </div>
          </div>

          <Button
            size='lg'
            variant='secondary'
            asChild
            className='text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4'
          >
            <Link href='/book/deer-farm'>
              Užsisakyti Ekskursiją Dabar
              <ArrowRight className='ml-2 h-4 w-4 sm:h-5 sm:w-5' />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-8 sm:py-12 px-4'>
        <div className='container mx-auto'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8'>
            <div className='sm:col-span-2 lg:col-span-1'>
              <div className='flex items-center space-x-2 mb-4'>
                <img
                  src='/logodan.png'
                  alt='Danielių Kiemas Logo'
                  className='h-6 w-6'
                />
                <span
                  className='text-lg sm:text-xl font-bold'
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  Danielių Kiemas
                </span>
              </div>
              <p className='text-gray-400 text-sm sm:text-base'>
                Patirkite europietiškų danielių grožį jų natūralioje aplinkoje.
              </p>
            </div>
            <div>
              <h3 className='font-semibold mb-4 text-base sm:text-lg'>
                Apsilankymas
              </h3>
              <ul className='space-y-2 text-gray-400 text-sm sm:text-base'>
                <li>
                  <Link
                    href='/book/deer-farm'
                    className='hover:text-white transition-colors'
                  >
                    Užsisakyti Ekskursiją
                  </Link>
                </li>
                <li>
                  <Link
                    href='#about'
                    className='hover:text-white transition-colors'
                  >
                    Apie Mus
                  </Link>
                </li>
                <li>
                  <Link
                    href='/gallery'
                    className='hover:text-white transition-colors'
                  >
                    Foto Galerija
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold mb-4 text-base sm:text-lg'>
                Informacija
              </h3>
              <ul className='space-y-2 text-gray-400 text-sm sm:text-base'>
                <li>
                  <Link
                    href='/faq'
                    className='hover:text-white transition-colors'
                  >
                    D.U.K.
                  </Link>
                </li>
                <li>
                  <Link
                    href='/contact'
                    className='hover:text-white transition-colors'
                  >
                    Kontaktai
                  </Link>
                </li>
                <li>
                  <Link
                    href='/reviews'
                    className='hover:text-white transition-colors'
                  >
                    Atsiliepimai
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold mb-4 text-base sm:text-lg'>
                Kontaktai
              </h3>
              <ul className='space-y-2 text-gray-400 text-sm sm:text-base'>
                <li className='flex items-center space-x-2'>
                  <Phone className='h-4 w-4 flex-shrink-0' />
                  <span>+370 698 03302</span>
                </li>
                <li className='flex items-center space-x-2'>
                  <Mail className='h-4 w-4 flex-shrink-0' />
                  <span className='break-all'>info@danieliuukis.lt</span>
                </li>
                <li className='flex items-start space-x-2'>
                  <MapPin className='h-4 w-4 flex-shrink-0 mt-0.5' />
                  <span>Antanavo g. 1, Kazlų Rūdos savivaldybė</span>
                </li>
              </ul>
            </div>
          </div>
          <div className='border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base'>
            <p> 2025 Danielių Ūkio Ekskursijos. Visos teisės saugomos.</p>
            <p>
              Svetainė sukurta &copy; "
              <a
                href='https://lbvisible.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                Let&apos;s Be Visible
              </a>
              " -{' '}
              <a
                href='https://lbvisible.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                lbvisible.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
