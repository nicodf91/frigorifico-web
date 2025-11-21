import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Check, Search, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { Branch } from '../types';
import { useApp } from '../services/state';
import { Button } from '../components/Shared';

export const BranchSelector: React.FC = () => {
  const navigate = useNavigate();
  const { selectBranch, selectedBranch } = useApp();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSelected, setTempSelected] = useState<Branch | null>(selectedBranch);

  useEffect(() => {
    api.getBranches().then(setBranches);
  }, []);

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirm = () => {
    if (tempSelected) {
      selectBranch(tempSelected);
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      {/* Header simplified for this view */}
      <div className="p-4 border-b border-stone-800 flex items-center">
        <button onClick={() => navigate('/')} className="text-stone-400 hover:text-brand-light mr-4">
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-serif font-bold text-brand-light">Elegí tu sucursal</h1>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-gold mb-2">¿Dónde querés recibir tu pedido?</h2>
          <p className="text-stone-400">Seleccioná una sucursal para ver los precios, stock y promociones de tu zona.</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-stone-500 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Buscar por ciudad, barrio o dirección..." 
            className="w-full bg-brand-gray border border-stone-700 rounded-lg py-3 pl-10 pr-4 text-brand-light focus:ring-2 focus:ring-brand-gold focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="space-y-4 mb-8">
          {filteredBranches.map(branch => {
            const isSelected = tempSelected?.id === branch.id;
            return (
              <div 
                key={branch.id}
                onClick={() => setTempSelected(branch)}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-brand-gold bg-brand-gold/10' 
                    : 'border-stone-800 bg-brand-gray hover:border-stone-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full mr-4 ${isSelected ? 'bg-brand-gold text-brand-black' : 'bg-stone-800 text-stone-400'}`}>
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-brand-light">{branch.name}</h3>
                      <p className="text-stone-400 text-sm mb-1">{branch.address}, {branch.city}</p>
                      <div className="flex items-center text-xs text-stone-500">
                        <Clock className="h-3 w-3 mr-1" /> {branch.hours}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {branch.services.map(s => (
                           <span key={s} className="px-2 py-0.5 rounded bg-stone-800 text-xs text-stone-300 capitalize border border-stone-700">
                             {s === 'whatsapp' ? 'WhatsApp' : s}
                           </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="bg-brand-gold rounded-full p-1">
                      <Check className="h-4 w-4 text-brand-black" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="sticky bottom-4 bg-brand-dark/95 backdrop-blur p-4 border border-stone-800 rounded-lg shadow-xl">
          <Button 
            className="w-full" 
            disabled={!tempSelected}
            onClick={handleConfirm}
          >
            Confirmar Sucursal
          </Button>
        </div>
      </div>
    </div>
  );
};