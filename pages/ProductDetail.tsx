import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, ShieldCheck, ChefHat, Info } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useApp } from '../services/state';
import { Button, Badge, Stepper } from '../components/Shared';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedBranch, addToCart } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'nutri' | 'usage'>('desc');

  useEffect(() => {
    if (id) {
      api.getProductById(id).then(setProduct);
    }
  }, [id]);

  if (!product) return <div className="p-10 text-center text-stone-500">Cargando...</div>;

  const hasStock = selectedBranch ? product.stockByBranch[selectedBranch.id] : true;
  const isByWeight = product.unit === 'kg';

  const handleAddToCart = () => {
    if (!selectedBranch) {
      navigate('/sucursales/seleccionar');
      return;
    }
    addToCart(product, qty);
  };

  const handleWhatsapp = () => {
    const text = `Hola FRS! Me interesa el producto: ${product.name}. ¿Tienen disponibilidad en ${selectedBranch?.name || 'la sucursal'}?`;
    window.open(`https://wa.me/${selectedBranch ? selectedBranch.phone.replace(/\D/g,'') : ''}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-stone-400 hover:text-brand-gold mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-brand-gray border border-stone-800">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
             <Badge>{product.category}</Badge>
             {product.badges?.map(b => <Badge key={b} color="red">{b}</Badge>)}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-light mb-2">{product.name}</h1>
          
          <div className="flex items-end gap-2 mb-6">
            <span className="text-3xl font-bold text-brand-gold">${product.price.toLocaleString()}</span>
            <span className="text-stone-500 mb-1">x {product.unit}</span>
          </div>

          {/* Stock Status */}
          <div className={`mb-6 p-3 rounded-lg border ${hasStock ? 'bg-green-900/20 border-green-800 text-green-400' : 'bg-red-900/20 border-red-800 text-red-400'}`}>
            {selectedBranch 
              ? (hasStock ? `✓ Disponible en ${selectedBranch.name}` : `✕ Sin stock en ${selectedBranch.name}`) 
              : "Seleccioná una sucursal para ver disponibilidad exacta"
            }
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="w-32">
               <Stepper 
                 value={qty} 
                 onChange={setQty} 
                 unit={product.unit} 
                 min={isByWeight ? 0.5 : 1} 
                 step={isByWeight ? 0.5 : 1}
               />
            </div>
            <Button 
              disabled={!hasStock && !!selectedBranch}
              onClick={handleAddToCart}
              className="flex-1"
            >
              Agregar al Pedido
            </Button>
            <Button variant="secondary" onClick={handleWhatsapp}>
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-t border-stone-800 pt-6">
            <div className="flex gap-6 border-b border-stone-800 mb-4">
              {[
                { id: 'desc', label: 'Descripción', icon: Info },
                { id: 'usage', label: 'Uso / Maridaje', icon: ChefHat },
                { id: 'nutri', label: 'Nutrición', icon: ShieldCheck },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-2 flex items-center text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id 
                      ? 'border-brand-gold text-brand-gold' 
                      : 'border-transparent text-stone-500 hover:text-brand-light'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
                </button>
              ))}
            </div>
            
            <div className="text-stone-300 text-sm leading-relaxed min-h-[100px]">
              {activeTab === 'desc' && <p>{product.description}</p>}
              {activeTab === 'usage' && <p>{product.usage || "Consultar sugerencias de consumo."}</p>}
              {activeTab === 'nutri' && <p>{product.infoNutricional || "Información nutricional no disponible online. Ver envase."}</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};