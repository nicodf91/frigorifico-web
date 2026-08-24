
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Truck, ShieldCheck, MapPin } from 'lucide-react';
import { Button, Badge } from '../components/Shared';
import { api } from '../services/api';
import { Product, Category } from '../types';
import { useApp } from '../services/state';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { selectedBranch } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.getProducts().then(products => {
      setFeaturedProducts(products.filter(p => p.isFeatured).slice(0, 4));
    });
  }, []);

  const categories = Object.values(Category);
  const categoryImages: string[] = [
  // 0 - Productos de cerdo envasados
  'https://images.pexels.com/photos/18861865/pexels-photo-18861865.jpeg',

  // 1 - Fiambres
  'https://images.pexels.com/photos/4946940/pexels-photo-4946940.jpeg',

  // 2 - Quesos de rayar y cremosos
  'https://images.pexels.com/photos/4187783/pexels-photo-4187783.jpeg',

  // 3 - Chacinados de cerdo
  'https://images.pexels.com/photos/9287523/pexels-photo-9287523.jpeg',

  // 4 - Aceites de oliva y aceitunas
  'https://images.pexels.com/photos/10049145/pexels-photo-10049145.jpeg',

  // 5 - Picadas
  'https://images.pexels.com/photos/11121658/pexels-photo-11121658.jpeg',

  // 6 - Vinos
  'https://images.pexels.com/photos/5667613/pexels-photo-5667613.jpeg',
];


  return (
    <div className="flex flex-col space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10"></div>
          <img 
            src="https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg" 
            alt="Tabla con fiambres, quesos, productos de cerdo y vinos" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-8">
            <div className="flex items-center space-x-2">
               <Badge color="gold">Calidad Premium</Badge>
               <span className="text-brand-light/80 text-sm font-medium tracking-widest uppercase">Frigorífico Online</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-light leading-tight">
              Calidad de frigorífico, <br/>
              <span className="text-brand-gold">directo a tu mesa.</span>
            </h1>
            <p className="text-xl text-stone-300 max-w-lg">
              La mejor selección de cortes de cerdo, fiambres estacionados, quesos y vinos. Envíos a domicilio o retiro en sucursal.
            </p>
            
            {!selectedBranch && (
              <div className="bg-brand-gray/80 backdrop-blur-sm p-4 rounded-lg border border-stone-700 inline-block mb-4">
                <p className="text-brand-gold mb-2 text-sm font-bold">Para ver precios y stock:</p>
                <Button variant="secondary" onClick={() => navigate('/sucursales/seleccionar')} className="w-full sm:w-auto">
                  <MapPin className="w-4 h-4 mr-2"/> Elegí tu sucursal
                </Button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={() => navigate('/productos')}>
                Iniciar Pedido <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" onClick={() => navigate('/sucursales')}>
                Ver Sucursales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose FRS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: "Datos de demostración", desc: "Catálogo estático y explícitamente ficticio." },
            { icon: Star, title: "Catálogo explorable", desc: "Filtros, detalle y disponibilidad simulada." },
            { icon: Truck, title: "Flujo de entrega", desc: "Retiro o envío modelados solo en la interfaz." },
            { icon: MapPin, title: "Selección de sucursal", desc: "El carrito mantiene coherencia con la sede elegida." }
          ].map((item, idx) => (
            <div key={idx} className="bg-brand-gray p-6 rounded-lg border border-stone-800 text-center hover:border-brand-gold/50 transition-colors">
              <item.icon className="w-10 h-10 text-brand-gold mx-auto mb-4" />
              <h3 className="text-lg font-bold text-brand-light mb-2">{item.title}</h3>
              <p className="text-stone-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-brand-light mb-2">Ofertas del día</h2>
            <p className="text-stone-400">Los favoritos de nuestros clientes.</p>
          </div>
          <Link to="/productos" className="text-brand-gold hover:text-brand-goldLight font-medium flex items-center">
            Ver todo <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(p => (
            <div key={p.id} onClick={() => navigate(`/productos/${p.id}`)} className="cursor-pointer group relative">
               <div className="aspect-[4/5] overflow-hidden rounded-lg bg-brand-gray">
                 <img src={p.image} alt={p.name} className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity" />
                 {p.badges && p.badges[0] && (
                   <span className="absolute top-2 left-2 bg-brand-gold text-brand-black px-2 py-1 text-xs font-bold rounded">{p.badges[0]}</span>
                 )}
               </div>
               <div className="mt-4 flex justify-between">
                 <div>
                   <h3 className="text-sm text-brand-light font-medium">{p.name}</h3>
                   <p className="mt-1 text-sm text-stone-500">{p.category}</p>
                 </div>
                 <p className="text-sm font-medium text-brand-gold">${p.price.toLocaleString()}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-brand-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h2 className="text-3xl font-serif font-bold text-brand-light mb-8 text-center">Nuestras Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <div 
                key={idx} 
                onClick={() => navigate(`/productos?category=${encodeURIComponent(cat)}`)}
                className="relative h-40 rounded-lg overflow-hidden cursor-pointer group"
              >
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors z-10"></div>
                <img 
                  src={categoryImages[idx]}
                  alt={cat} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center p-4 text-center">
                  <h3 className="text-brand-light font-bold text-lg md:text-xl font-serif">{cat}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wholesale & Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid md:grid-cols-2 gap-8">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-8 flex flex-col justify-center items-start">
          <h3 className="text-2xl font-serif font-bold text-brand-light mb-4">Flujo mayorista de demo</h3>
          <p className="text-stone-400 mb-6">
            Explorá cómo una cuenta comercial podría capturar preferencias sin enviar ni persistir datos personales.
          </p>
          <Button variant="outline" onClick={() => navigate('/perfil?tab=wholesale')}>Probar el flujo</Button>
        </div>
        <div className="bg-brand-gold rounded-xl p-8 flex flex-col justify-center items-start text-brand-black">
          <h3 className="text-2xl font-serif font-bold mb-4">Proyecto de portfolio</h3>
          <p className="mb-6 opacity-90 font-medium">
            Recorré selección de sucursal, catálogo, carrito y preparación de consultas en una sola experiencia frontend.
          </p>
          <Button onClick={() => navigate('/productos')}>Explorar catálogo</Button>
        </div>
      </section>
    </div>
  );
};
