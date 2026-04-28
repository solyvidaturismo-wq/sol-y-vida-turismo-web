import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MapPin, Clock, Users, Star, ChevronDown, Mountain,
  TreePine, Heart, Phone, Mail, Instagram, Facebook,
  ArrowRight, Menu, X, Compass, Shield,
  ChevronLeft, ChevronRight, Play, MessageCircle, CheckCircle2
} from 'lucide-react';
import { useProducts } from '../store/useAppStore';
import { PRODUCT_CATEGORY_META } from '../config/categoryFields';
import { buildWhatsappUrl, formatDurationHuman, LANDING_WHATSAPP_NUMBER } from '../config/landing';
import type { Product } from '../types';

/* ─── Data ──────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Experiencias', href: '#experiencias' },
  { label: 'Destinos', href: '#destinos' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Contacto', href: '#contacto' },
];

const HERO_SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    title: 'Descubre Vélez',
    subtitle: 'Santander',
    desc: 'Aventura, cultura y naturaleza en el corazón de Colombia.',
  },
  {
    img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=80',
    title: 'Caminatas',
    subtitle: 'Ecológicas',
    desc: 'Senderos entre montañas, cascadas y paisajes que te dejarán sin aliento.',
  },
  {
    img: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1920&q=80',
    title: 'Deportes',
    subtitle: 'Extremos',
    desc: 'Rappel, torrentismo y escalada en los cañones naturales de Santander.',
  },
  {
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80',
    title: 'Turismo',
    subtitle: 'Rural',
    desc: 'Vive la experiencia campesina en fincas tradicionales de la provincia.',
  },
];

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';

const DESTINOS = [
  {
    name: 'Cascada La Honda',
    location: 'Vélez, Santander',
    img: 'https://images.unsplash.com/photo-1432405972618-c6b0cfba8b24?w=600&q=80',
    rating: 4.9,
    desc: 'Imponente caída de agua en medio de la selva santandereana.',
  },
  {
    name: 'Cañón del Río Suárez',
    location: 'Barbosa — Vélez',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    rating: 4.8,
    desc: 'Paisajes de vértigo y deportes extremos.',
  },
  {
    name: 'Parque La Periquera',
    location: 'Cerca de Vélez',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    rating: 4.7,
    desc: 'Naturaleza pura con senderos y pozos cristalinos.',
  },
  {
    name: 'Centro Histórico',
    location: 'Vélez, Santander',
    img: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80',
    rating: 4.6,
    desc: 'Arquitectura colonial y la historia de los comuneros.',
  },
];

const TESTIMONIOS = [
  {
    name: 'Carolina M.',
    text: 'Una experiencia increíble. Los guías conocen cada rincón de Vélez y te hacen sentir como en familia.',
    rating: 5,
    location: 'Bogotá',
    avatar: 'CM',
  },
  {
    name: 'Andrés F.',
    text: 'El torrentismo fue lo mejor que he hecho. Totalmente seguro y profesional. 100% recomendado.',
    rating: 5,
    location: 'Bucaramanga',
    avatar: 'AF',
  },
  {
    name: 'María José R.',
    text: 'La ruta del bocadillo es obligatoria. Mis hijos la disfrutaron tanto como nosotros. Volveremos.',
    rating: 5,
    location: 'Medellín',
    avatar: 'MR',
  },
];

const STATS = [
  { value: '500+', label: 'Viajeros felices', icon: Heart },
  { value: '30+', label: 'Experiencias', icon: Compass },
  { value: '15+', label: 'Destinos únicos', icon: MapPin },
  { value: '5', label: 'Años de experiencia', icon: Shield },
];

/* ─── Component ─────────────────────────────────────── */

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products = useProducts();
  const featuredProducts = useMemo(
    () => products.filter(p => p.is_featured && p.status === 'activo'),
    [products]
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-advance slider
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const scrollToSection = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page min-h-screen bg-white text-slate-800 overflow-x-hidden">

      {/* ════════ NAVBAR ════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 py-3'
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button onClick={() => scrollToSection('#inicio')} className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-white/95 flex items-center justify-center shadow-lg shadow-[#7E2A21]/20 group-hover:shadow-[#7E2A21]/40 transition-all overflow-hidden p-1">
              <img src="/logo.png" alt="Inventario Turístico de Vélez" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className={`text-xs font-bold tracking-tight transition-colors ${scrolled ? 'text-slate-500' : 'text-white/80'}`}>Inventario Turístico</p>
              <p className={`text-base font-black tracking-tight transition-colors ${scrolled ? 'text-[#7E2A21]' : 'text-white'}`}>de Vélez</p>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className={`text-sm font-semibold transition-colors relative group ${
                  scrolled ? 'text-slate-600 hover:text-amber-600' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            <a
              href={buildWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-bold text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all"
            >
              Reservar Ahora
            </a>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className={`lg:hidden p-2 ${scrolled ? 'text-slate-800' : 'text-white'}`}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-slate-100 p-6 space-y-3 shadow-xl">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="block w-full text-left text-base font-semibold text-slate-700 hover:text-amber-600 py-2"
              >
                {link.label}
              </button>
            ))}
            <a
              href={buildWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-bold text-white mt-4"
            >
              Reservar Ahora
            </a>
          </div>
        )}
      </nav>

      {/* ════════ HERO SLIDER ════════ */}
      <section id="inicio" className="relative h-screen min-h-[600px] overflow-hidden">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={slide.img}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        ))}

        {/* Slide Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-sm font-medium text-white mb-6">
                <MapPin size={14} className="text-amber-400" /> Vélez, Santander — Colombia
              </div>

              {HERO_SLIDES.map((slide, idx) => (
                <div
                  key={idx}
                  className={`transition-all duration-700 ${
                    idx === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute pointer-events-none'
                  }`}
                >
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.95] tracking-tight text-white mb-4">
                    {slide.title}{' '}
                    <span className="text-amber-400">{slide.subtitle}</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-white/80 max-w-lg mb-8 leading-relaxed">
                    {slide.desc}
                  </p>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToSection('#experiencias')}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-base shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  Explorar Experiencias <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => scrollToSection('#contacto')}
                  className="px-8 py-4 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white font-semibold text-base hover:bg-white/25 transition-all flex items-center justify-center gap-2"
                >
                  <Play size={16} /> Ver Video
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-8 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentSlide
                      ? 'w-10 h-2 bg-amber-400'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce sm:hidden">
          <ChevronDown size={20} className="text-white/60" />
        </div>
      </section>

      {/* ════════ STATS BAR ════════ */}
      <section className="relative -mt-16 z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 bg-white rounded-2xl shadow-xl shadow-black/10 p-6 md:p-0 md:divide-x divide-slate-100">
            {STATS.map(stat => (
              <div key={stat.label} className="flex items-center gap-4 md:px-8 md:py-6">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <stat.icon size={22} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                  <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ EXPERIENCIAS (dinámico desde la app) ════════ */}
      <section id="experiencias" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-wider mb-4">
              Nuestras Experiencias
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-800">
              Vive algo <span className="text-amber-500">inolvidable</span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto text-lg">
              Cada experiencia está diseñada para conectarte con lo mejor de Vélez y su provincia.
            </p>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="max-w-xl mx-auto text-center py-16 px-8 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-5">
                <Mountain size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Estamos preparando nuevas experiencias
              </h3>
              <p className="text-slate-500 mb-6">
                Mientras tanto, escríbenos por WhatsApp y diseñamos un plan a la medida para ti.
              </p>
              <a
                href={buildWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/25 hover:scale-105 transition-all"
              >
                <MessageCircle size={16} /> Contactar por WhatsApp
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => {
                const meta = PRODUCT_CATEGORY_META[product.category as keyof typeof PRODUCT_CATEGORY_META];
                const img = product.images?.[0] || product.banner_image || FALLBACK_IMG;
                const desc = product.short_description || product.description || 'Experiencia única en la provincia de Vélez.';
                const maxPax = product.availability?.max_capacity;
                const minPax = product.availability?.min_pax ?? 1;
                const capacityLabel = maxPax ? `${minPax}-${maxPax}` : `Desde ${minPax}`;

                return (
                  <div
                    key={product.id}
                    className="group rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500 hover:-translate-y-1 flex flex-col"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={img}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span>{meta?.emoji || '✨'}</span>
                        {meta?.label || 'Experiencia'}
                      </div>
                      {product.base_price > 0 && (
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-black shadow-lg">
                          desde {product.currency} {product.base_price.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-3 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
                        {desc}
                      </p>

                      <div className="flex items-center gap-4 pt-2">
                        <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                          <Clock size={14} className="text-amber-500" /> {formatDurationHuman(product.duration_minutes)}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                          <Users size={14} className="text-amber-500" /> {capacityLabel} pax
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="py-2.5 rounded-xl bg-slate-100 text-sm font-bold text-slate-700 hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                        >
                          Más info <ArrowRight size={14} />
                        </button>
                        <a
                          href={buildWhatsappUrl(product.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 rounded-xl bg-green-500 text-sm font-bold text-white hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-md shadow-green-500/20"
                        >
                          <MessageCircle size={14} /> Contratar
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ════════ DESTINOS ════════ */}
      <section id="destinos" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-4">
              Destinos Destacados
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-800">
              Lugares que <span className="text-emerald-500">enamoran</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DESTINOS.map(dest => (
              <div key={dest.name} className="group relative rounded-2xl overflow-hidden h-96 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-1">
                  <Star size={12} className="text-amber-500" fill="currentColor" />
                  <span className="text-xs font-bold text-slate-700">{dest.rating}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
                  <p className="text-sm text-white/70 flex items-center gap-1 mb-2">
                    <MapPin size={12} /> {dest.location}
                  </p>
                  <p className="text-sm text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {dest.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ WHY US ════════ */}
      <section id="nosotros" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-wider mb-4">
                Por qué elegirnos
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-800 mb-6">
                Turismo con <span className="text-amber-500">alma local</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-10">
                Somos de aquí. Conocemos cada sendero, cada historia, cada sabor.
                No somos una agencia más — somos vecinos que quieren mostrarte lo mejor de nuestra tierra.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Shield, title: 'Seguridad Garantizada', desc: 'Guías certificados, equipos de primera y protocolos de seguridad en cada actividad.' },
                  { icon: Heart, title: 'Experiencias Personalizadas', desc: 'Adaptamos cada plan a tus gustos, ritmo y presupuesto. Nada genérico.' },
                  { icon: Users, title: 'Grupos Pequeños', desc: 'Máximo 15 personas por grupo para una experiencia íntima y de calidad.' },
                  { icon: TreePine, title: 'Turismo Responsable', desc: 'Trabajamos con comunidades locales y respetamos el medio ambiente.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <item.icon size={22} />
                    </div>
                    <div>
                      <h4 className="text-slate-800 font-bold mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image mosaic */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden h-48 shadow-lg">
                  <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80" alt="Caminata" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="rounded-2xl overflow-hidden h-64 shadow-lg">
                  <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" alt="Gastronomía" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="rounded-2xl overflow-hidden h-64 shadow-lg">
                  <img src="https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&q=80" alt="Aventura" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="rounded-2xl overflow-hidden h-48 shadow-lg">
                  <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80" alt="Campo" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIOS ════════ */}
      <section id="testimonios" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider mb-4">
              Testimonios
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-800">
              Lo que dicen <span className="text-rose-500">nuestros viajeros</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIOS.map(t => (
              <div key={t.name} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin size={10} /> {t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA BANNER ════════ */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80"
              alt="Montañas"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/90 to-orange-500/85" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Tu próxima aventura empieza aquí
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-xl">
                Escríbenos por WhatsApp y diseñamos el plan perfecto para ti y tu grupo.
              </p>
              <a
                href={buildWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 rounded-full bg-white text-amber-600 font-bold text-lg shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
              >
                <MessageCircle size={20} /> Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ CONTACTO ════════ */}
      <section id="contacto" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-wider mb-4">
                Contacto
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-800 mb-6">
                Hablemos de tu <span className="text-amber-500">próximo viaje</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-10">
                Estamos listos para ayudarte a planear la experiencia perfecta en Vélez, Santander.
              </p>

              <div className="space-y-6">
                <a href={`tel:+${LANDING_WHATSAPP_NUMBER}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Teléfono / WhatsApp</p>
                    <p className="text-slate-800 font-bold">+57 300 123 4567</p>
                  </div>
                </a>

                <a href="mailto:info@solyvida.co" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                    <p className="text-slate-800 font-bold">info@solyvida.co</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Ubicación</p>
                    <p className="text-slate-800 font-bold">Vélez, Santander — Colombia</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <a href="#" className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-200 transition-all shadow-sm">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-200 transition-all shadow-sm">
                  <Facebook size={18} />
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Envíanos un mensaje</h3>
              <form className="space-y-5" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name');
                const message = formData.get('message');
                window.open(
                  `https://wa.me/${LANDING_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola, soy ${name}. ${message}`)}`,
                  '_blank'
                );
              }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500">Nombre</label>
                    <input
                      name="name"
                      required
                      placeholder="Tu nombre"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500">Email</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Personas</label>
                  <select
                    name="personas"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  >
                    <option value="1-2">1-2 personas</option>
                    <option value="3-5">3-5 personas</option>
                    <option value="6-10">6-10 personas</option>
                    <option value="10+">Más de 10</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Mensaje</label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder="Cuéntanos qué te gustaría hacer en Vélez..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all"
                >
                  Enviar por WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/95 flex items-center justify-center overflow-hidden p-1">
                  <img src="/logo.png" alt="Inventario Turístico de Vélez" className="w-full h-full object-contain" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-white">Inventario Turístico</p>
                  <p className="text-xs text-slate-400">de Vélez — Santander</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Experiencias auténticas diseñadas por quienes aman esta tierra. Aventura, cultura y naturaleza en el corazón de Colombia.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Enlaces</h4>
              <div className="space-y-2">
                {NAV_LINKS.map(link => (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="block text-sm text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Contacto</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <p>+57 300 123 4567</p>
                <p>info@solyvida.co</p>
                <p>Vélez, Santander — Colombia</p>
              </div>
              <div className="flex gap-3 mt-4">
                <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors"><Instagram size={18} /></a>
                <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors"><Facebook size={18} /></a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Inventario Turístico de Vélez. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* ════════ FLOATING WHATSAPP ════════ */}
      <a
        href={buildWhatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-xl shadow-green-500/30 hover:scale-110 hover:shadow-green-500/50 transition-all"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={26} />
      </a>

      {/* ════════ MODAL DE DETALLE DE PRODUCTO ════════ */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

/* ─── Modal de detalle (info orientada al cliente final) ──────────── */

function ProductDetailModal({ product, onClose }: { product: Product; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const meta = PRODUCT_CATEGORY_META[product.category as keyof typeof PRODUCT_CATEGORY_META];
  const img = product.images?.[0] || product.banner_image || FALLBACK_IMG;
  const maxPax = product.availability?.max_capacity;
  const minPax = product.availability?.min_pax ?? 1;
  const capacityLabel = maxPax ? `${minPax}-${maxPax} pax` : `Desde ${minPax} pax`;

  // Extraer "incluido" desde custom_fields (booleans que empiezan con includes_ / has_)
  const included = Object.entries(product.custom_fields || {})
    .filter(([k, v]) => v === true && (k.startsWith('includes_') || k.startsWith('has_')))
    .map(([k]) => k
      .replace(/^(includes_|has_)/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
    )
    .slice(0, 12);

  const itinerary = product.activity_itinerary || [];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-slate-700 flex items-center justify-center hover:bg-white shadow-lg"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-3xl">
          <img
            src={img}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-700 mb-3">
              <span>{meta?.emoji || '✨'}</span>
              {meta?.label || 'Experiencia'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {product.name}
            </h2>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Stats rápidos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 text-center">
              <Clock size={18} className="mx-auto text-amber-500 mb-1" />
              <p className="text-[10px] text-slate-500 font-bold uppercase">Duración</p>
              <p className="text-sm font-bold text-slate-800">{formatDurationHuman(product.duration_minutes)}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 text-center">
              <Users size={18} className="mx-auto text-amber-500 mb-1" />
              <p className="text-[10px] text-slate-500 font-bold uppercase">Capacidad</p>
              <p className="text-sm font-bold text-slate-800">{capacityLabel}</p>
            </div>
            {product.base_price > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 text-center border border-amber-100">
                <p className="text-[10px] text-amber-600 font-bold uppercase">Desde</p>
                <p className="text-base font-black text-amber-700">
                  {product.currency} {product.base_price.toLocaleString()}
                </p>
                <p className="text-[9px] text-amber-600/80">por persona</p>
              </div>
            )}
          </div>

          {/* Descripción */}
          {product.description && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-2">Descripción</h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Qué incluye */}
          {included.length > 0 && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-3">Qué incluye</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {included.map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itinerario */}
          {itinerary.length > 0 && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-3">Itinerario</h3>
              <div className="space-y-2">
                {itinerary.map((step, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50">
                    <div className="shrink-0 px-2.5 py-1 rounded-lg bg-white text-amber-600 font-bold text-xs self-start">
                      {step.time}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{step.activity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendaciones */}
          {product.recommendations && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-2">Recomendaciones</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {product.recommendations}
              </p>
            </div>
          )}

          {/* CTA WhatsApp */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <a
              href={buildWhatsappUrl(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 rounded-xl bg-green-500 text-white font-bold text-base hover:bg-green-600 shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} /> Contratar por WhatsApp
            </a>
            <button
              onClick={onClose}
              className="px-6 py-3.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-base hover:bg-slate-200 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
