
import React, { useState, useEffect, useRef } from 'react';
import { Save, CheckCircle, Store, User, MapPin, Loader2 } from 'lucide-react';
import { useApp } from '../services/state';
import { Button } from '../components/Shared';
import { useSearchParams, useNavigate } from 'react-router-dom';

// List of available cities for the autocomplete
const AVAILABLE_CITIES = [
  "Saladillo",
  "CABA",
  "La Plata",
  "Buenos Aires",
  "Mar del Plata",
  "Tandil",
  "Olavarría",
  "Azul",
  "Lobos",
  "Roque Pérez",
  "25 de Mayo",
  "Las Flores",
  "General Alvear",
  "Cañuelas",
  "San Miguel del Monte",
  "Chivilcoy",
  "Bragado",
  "Junín"
];

export const Profile: React.FC = () => {
  const { userProfile, updateUserProfile } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Unified form state
  const [formData, setFormData] = useState({ ...userProfile });
  
  // Toggle for wholesale fields
  const [showWholesale, setShowWholesale] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // City Autocomplete State
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);

  // Initialize toggle based on existing profile or URL param
  useEffect(() => {
    if (searchParams.get('tab') === 'wholesale' || userProfile.isWholesale || (userProfile.cuit && userProfile.cuit.length > 0)) {
      setShowWholesale(true);
    }
  }, [searchParams, userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowWholesale(e.target.checked);
  };

  // City Autocomplete Logic
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, city: value }));

    if (value.length > 0) {
      const matches = AVAILABLE_CITIES.filter(c => 
        c.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(matches);
      setShowCitySuggestions(true);
    } else {
      setShowCitySuggestions(false);
    }
  };

  const handleSelectCity = (city: string) => {
    setFormData(prev => ({ ...prev, city }));
    setShowCitySuggestions(false);
    setFilteredCities([]);
  };

  const handleCityBlur = () => {
    // Delay to allow click event on suggestion to fire
    setTimeout(() => {
      setShowCitySuggestions(false);
    }, 200);
  };

  const handleSave = () => {
    // Validation logic
    if (!formData.name || !formData.phone) {
      alert('Por favor completá tu nombre y teléfono.');
      return;
    }

    // Conditional validation for wholesale
    if (showWholesale) {
      if (!formData.cuit || formData.cuit.length < 11) {
        alert('Para cuentas mayoristas, por favor ingresá un CUIT válido (11 dígitos).');
        return;
      }
      if (!formData.businessName) {
        alert('Por favor ingresá el nombre de tu comercio.');
        return;
      }
    }

    setIsSaving(true);

    // Prepare data to save
    const dataToSave = {
      ...formData,
      isWholesale: showWholesale, 
    };

    // Update global state
    updateUserProfile(dataToSave);
    
    const msg = showWholesale 
      ? 'Datos actualizados para esta sesión de la demo.'
      : 'Datos personales actualizados con éxito.';
    
    setSuccessMsg(`${msg} Volviendo al inicio...`);

    // Scroll to top to make sure the user sees the success message
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Clear fields immediately
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      cuit: '',
      businessName: '',
      isWholesale: false
    });
    setShowWholesale(false);

    // Redirect to home after delay
    setTimeout(() => {
      navigate('/');
    }, 2500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-brand-light mb-2 text-center">Mi Perfil FRS</h1>
      <p className="text-stone-400 text-center mb-8">Los datos solo viven en memoria y se borran al recargar la demo.</p>

      <div className="bg-brand-gray border border-stone-800 rounded-xl p-6 md:p-8 shadow-xl">
        
        {/* Success Message */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-800 text-green-400 rounded-lg flex items-center animate-in fade-in duration-300">
            <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className={`space-y-6 transition-opacity duration-300 ${isSaving ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Personal Data Section */}
          <div>
            <div className="flex items-center mb-4 border-b border-stone-700 pb-2">
              <User className="w-5 h-5 text-brand-gold mr-2" />
              <h2 className="text-xl font-bold text-brand-light">Datos Personales</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-stone-400 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-brand-light focus:ring-2 focus:ring-brand-gold focus:border-transparent placeholder-stone-600 disabled:bg-stone-800"
                  placeholder="Tu nombre"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-stone-400 mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-brand-light focus:ring-2 focus:ring-brand-gold focus:border-transparent placeholder-stone-600 disabled:bg-stone-800"
                    placeholder="Ej: 11 1234 5678"
                  />
                </div>
                <div>
                  <label className="block text-sm text-stone-400 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-brand-light focus:ring-2 focus:ring-brand-gold focus:border-transparent placeholder-stone-600 disabled:bg-stone-800"
                    placeholder="nombre@ejemplo.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative z-20">
                  <label className="block text-sm text-stone-400 mb-1">Ciudad</label>
                  <div className="relative">
                    <input
                      ref={cityInputRef}
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleCityChange}
                      onBlur={handleCityBlur}
                      onFocus={(e) => { if(e.target.value.length > 0) setShowCitySuggestions(true); }}
                      autoComplete="off"
                      disabled={isSaving}
                      className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-brand-light focus:ring-2 focus:ring-brand-gold focus:border-transparent placeholder-stone-600 disabled:bg-stone-800"
                      placeholder="Empezá a escribir..."
                    />
                    {formData.city && !showCitySuggestions && (
                      <div className="absolute right-3 top-3 text-brand-gold">
                        <MapPin className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  
                  {/* Autocomplete Dropdown */}
                  {showCitySuggestions && filteredCities.length > 0 && (
                    <ul className="absolute w-full mt-1 bg-stone-900 border border-stone-700 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                      {filteredCities.map((city, index) => (
                        <li
                          key={index}
                          onMouseDown={() => handleSelectCity(city)}
                          className="px-4 py-2 hover:bg-brand-gold/20 cursor-pointer text-stone-300 hover:text-brand-gold transition-colors border-b border-stone-800 last:border-0"
                        >
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div className="relative z-10">
                  <label className="block text-sm text-stone-400 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-brand-light focus:ring-2 focus:ring-brand-gold focus:border-transparent placeholder-stone-600 disabled:bg-stone-800"
                    placeholder="Calle y altura"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Wholesale Toggle */}
          <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4 relative z-0">
            <label className="flex items-start cursor-pointer">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={showWholesale}
                  onChange={handleCheckboxChange}
                  disabled={isSaving}
                  className="w-4 h-4 text-brand-gold border-stone-600 rounded focus:ring-brand-gold bg-stone-800"
                />
              </div>
              <div className="ml-3 text-sm">
                <span className="font-bold text-brand-light block flex items-center">
                  <Store className="w-4 h-4 mr-2 text-brand-gold" />
                  Soy comerciante / Solicitar cuenta mayorista
                </span>
                <span className="text-stone-500">
                  Habilitá esta opción si tenés un negocio (restaurante, fiambrería, etc.) y querés acceder a lista de precios especial.
                </span>
              </div>
            </label>
          </div>

          {/* Wholesale Data Section (Conditional) */}
          {showWholesale && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 relative z-0">
              <div className="p-4 bg-stone-900/30 rounded-lg border border-stone-800">
                <h3 className="text-brand-gold text-sm font-bold uppercase tracking-wider mb-4">Datos del Comercio</h3>
                <div className="grid grid-cols-1 gap-4">
                   <div>
                    <label className="block text-sm text-stone-400 mb-1">Nombre del Comercio / Razón Social *</label>
                    <input
                      type="text"
                      name="businessName"
                      placeholder="Ej: Restaurante El Palmar"
                      value={formData.businessName || ''}
                      onChange={handleChange}
                      disabled={isSaving}
                      className="w-full bg-brand-gray border border-stone-700 rounded p-3 text-brand-light focus:ring-2 focus:ring-brand-gold focus:border-transparent disabled:bg-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-stone-400 mb-1">CUIT *</label>
                    <input
                      type="text"
                      name="cuit"
                      placeholder="20-12345678-9"
                      value={formData.cuit || ''}
                      onChange={handleChange}
                      disabled={isSaving}
                      className="w-full bg-brand-gray border border-stone-700 rounded p-3 text-brand-light focus:ring-2 focus:ring-brand-gold focus:border-transparent disabled:bg-stone-800"
                    />
                    <p className="text-xs text-stone-500 mt-1">Ingresá los 11 dígitos sin espacios.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-stone-800 flex justify-end relative z-0">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center w-full md:w-auto min-w-[160px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Guardar Perfil
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
