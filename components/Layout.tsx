
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, MapPin, Menu, X, Search, User, Instagram, Facebook, Phone, ShoppingBag, Trash2 } from 'lucide-react';
import { useApp } from '../services/state';
import { Button, Stepper } from './Shared';
import { WhatsAppButton } from './WhatsAppButton';

const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart } = useApp();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-brand-dark border-l border-stone-800 shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-800 bg-brand-black">
          <h2 className="text-xl font-serif font-bold text-brand-gold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Tu Carrito
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-brand-light transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-500 space-y-4">
              <ShoppingCart className="w-16 h-16 opacity-20" />
              <p>Tu carrito está vacío</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/productos');
                }}
                className="text-brand-gold hover:underline text-sm"
              >
                Ir al catálogo
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.productId} className="flex gap-4 bg-stone-900/50 p-3 rounded-lg border border-stone-800">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-md object-cover bg-brand-gray border border-stone-800"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-brand-light font-medium text-sm line-clamp-1">{item.name}</h3>
                    <p className="text-brand-gold text-sm font-bold">${item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Stepper
                      value={item.quantity}
                      onChange={(val) => updateQuantity(item.productId, val)}
                      unit={item.unit}
                      min={item.unit === 'kg' ? 0.5 : 1}
                      step={item.unit === 'kg' ? 0.5 : 1}
                    />
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-stone-500 hover:text-red-500 p-2 rounded-full hover:bg-stone-800 transition-colors"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="p-5 border-t border-stone-800 bg-brand-black space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-stone-400">Subtotal</span>
              <span className="text-2xl font-bold text-brand-gold">${subtotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-stone-500 text-center">
              El costo de envío se calcula en el siguiente paso.
            </p>
            <Button
              className="w-full"
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
            >
              Iniciar Compra
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const Header: React.FC = () => {
  const { selectedBranch, cart, setIsCartOpen, userProfile } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cart.items.reduce((acc, item) => acc + 1, 0); // Items count

  const handleBranchClick = () => {
    navigate('/sucursales/seleccionar');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-brand-black/95 backdrop-blur-sm border-b border-brand-gray sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/logo-frs.png"
                alt="FRS Frigorífico Online"
                className="h-16 w-auto object-contain"
              />

            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {[
                { name: 'Inicio', path: '/' },
                { name: 'Catálogo', path: '/productos' },
                { name: 'Sucursales', path: '/sucursales' }
              ].map((link) => {
                const isActive = link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-brand-gold' : 'text-brand-light hover:text-brand-gold'
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Icons & Branch Selector */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBranchClick}
              className="hidden sm:flex items-center text-brand-light hover:text-brand-gold transition-colors bg-brand-gray px-3 py-1.5 rounded-full text-xs md:text-sm border border-stone-700"
            >
              <MapPin className="h-4 w-4 mr-2 text-brand-gold" />
              <span className="truncate max-w-[150px]">
                {selectedBranch ? selectedBranch.name : 'Elegí tu sucursal'}
              </span>
            </button>

            <button className="text-brand-light hover:text-brand-gold p-2 transition-colors">
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="text-brand-light hover:text-brand-gold p-2 relative transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full ring-2 ring-brand-black bg-brand-gold text-brand-black text-[10px] font-bold text-center leading-4">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/perfil')}
              className="text-brand-light hover:text-brand-gold p-2 hidden sm:flex items-center transition-colors"
            >
              <User className="h-5 w-5" />
              {userProfile.name && <span className="ml-2 text-xs hidden lg:inline-block truncate max-w-[80px]">Hola, {userProfile.name.split(' ')[0]}</span>}
            </button>

            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-brand-light hover:text-brand-gold focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-dark border-t border-brand-gray">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={handleBranchClick}
              className="w-full flex items-center text-brand-light hover:text-brand-gold px-3 py-2 rounded-md text-base font-medium"
            >
              <MapPin className="h-5 w-5 mr-3 text-brand-gold" />
              {selectedBranch ? selectedBranch.name : 'Seleccionar Sucursal'}
            </button>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-brand-light hover:text-brand-gold block px-3 py-2 rounded-md text-base font-medium">Inicio</Link>
            <Link to="/productos" onClick={() => setIsMenuOpen(false)} className="text-brand-light hover:text-brand-gold block px-3 py-2 rounded-md text-base font-medium">Catálogo</Link>
            <Link to="/sucursales" onClick={() => setIsMenuOpen(false)} className="text-brand-light hover:text-brand-gold block px-3 py-2 rounded-md text-base font-medium">Sucursales</Link>
            <Link to="/perfil?tab=wholesale" onClick={() => setIsMenuOpen(false)} className="text-brand-light hover:text-brand-gold block px-3 py-2 rounded-md text-base font-medium">Ventas Mayoristas</Link>
            <Link to="/perfil" onClick={() => setIsMenuOpen(false)} className="text-brand-light hover:text-brand-gold block px-3 py-2 rounded-md text-base font-medium">Mi Perfil</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-black border-t border-brand-gray mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold text-brand-gold mb-4">FRS Online</h3>
            <p className="text-stone-400 text-sm mb-4">
              Calidad de frigorífico, directo a tu mesa. Especialistas en productos de cerdo, fiambres y delicatessen.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-400 hover:text-brand-gold"><Instagram className="h-6 w-6" /></a>
              <a href="#" className="text-stone-400 hover:text-brand-gold"><Facebook className="h-6 w-6" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-brand-light mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link to="/sucursales" className="hover:text-brand-gold">Nuestras Sucursales</Link></li>
              <li><Link to="/productos" className="hover:text-brand-gold">Catálogo</Link></li>
              <li><a href="#" className="hover:text-brand-gold">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-brand-gold">Ayuda / Preguntas Frecuentes</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-brand-light mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li className="flex items-center"><Phone className="h-4 w-4 mr-2 text-brand-gold" /> 0800-555-CERDO</li>
              <li>info@frs-online.com</li>
              <li>Atención al cliente: Lun a Vie 9 a 18hs</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-brand-gray mt-8 pt-8 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} FRS Frigorífico Online. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-dark text-brand-light">
      <Header />
      <CartDrawer />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};
