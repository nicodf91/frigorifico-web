import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { Product, Category } from '../types';
import { useApp } from '../services/state';
import { ProductCard, Button } from '../components/Shared';

export const Catalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedBranch, addToCart } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = searchParams.get('category') || 'Todos';

  useEffect(() => {
    setLoading(true);
    api.getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const categories = ['Todos', ...Object.values(Category)];

  const filteredProducts = products.filter(p => {
    if (activeCategory !== 'Todos' && p.category !== activeCategory) return false;
    return true;
  });

  const handleAddToCart = (product: Product, qty: number) => {
    if (!selectedBranch) {
      navigate('/sucursales/seleccionar');
    } else {
      addToCart(product, qty);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header & Branch Warning */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-brand-light mb-4">Catálogo de Productos</h1>
        
        {!selectedBranch ? (
          <div className="bg-amber-900/20 border border-amber-700 p-4 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-brand-gold mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-brand-gold font-bold">Precios y stock referenciales</h3>
              <p className="text-stone-400 text-sm mb-2">Seleccioná una sucursal para ver la disponibilidad exacta y realizar tu pedido.</p>
              <button onClick={() => navigate('/sucursales/seleccionar')} className="text-sm underline text-brand-light hover:text-brand-gold">
                Seleccionar sucursal ahora
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center text-stone-400 text-sm">
            <span className="bg-brand-gray px-3 py-1 rounded border border-stone-700 text-brand-light">
              Sucursal: <span className="font-bold text-brand-gold">{selectedBranch.name}</span>
            </span>
            <span className="ml-3">Precios y stock actualizados.</span>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex space-x-2 min-w-max">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSearchParams({ category: cat })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-brand-gold text-brand-black shadow-lg'
                  : 'bg-brand-gray text-stone-400 hover:text-brand-light hover:bg-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Bar */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-stone-500 text-sm">Mostrando {filteredProducts.length} productos</p>
        <Button variant="outline" className="px-4 py-2 text-sm">
          <SlidersHorizontal className="w-4 h-4 mr-2" /> Filtros
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-stone-500">Cargando productos...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-brand-gray rounded-lg border border-stone-800">
          <p className="text-xl font-serif text-brand-light mb-2">No se encontraron productos</p>
          <p className="text-stone-500">Intenta cambiar la categoría o los filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            const hasStock = selectedBranch 
              ? product.stockByBranch[selectedBranch.id] 
              : true; 

            return (
              <div 
                key={product.id} 
                onClick={() => navigate(`/productos/${product.id}`)} 
                className="cursor-pointer"
              >
                 <ProductCard 
                    product={product} 
                    hasStock={hasStock} 
                    onAdd={(qty) => handleAddToCart(product, qty)}
                 />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};