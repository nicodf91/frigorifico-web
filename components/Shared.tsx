import React from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = 
  ({ children, variant = 'primary', className = '', ...props }) => {
  
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "border-transparent text-brand-black bg-brand-gold hover:bg-brand-goldLight shadow-lg shadow-amber-900/20",
    secondary: "border-transparent text-brand-gold bg-brand-gray hover:bg-stone-700",
    outline: "border-brand-gold text-brand-gold bg-transparent hover:bg-brand-gold/10"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode, color?: 'gold' | 'red' | 'green' }> = ({ children, color = 'gold' }) => {
  const colors = {
    gold: "bg-amber-900/50 text-amber-200 border-amber-700",
    red: "bg-red-900/50 text-red-200 border-red-700",
    green: "bg-green-900/50 text-green-200 border-green-700"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
};

interface StepperProps {
  value: number;
  onChange: (val: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const Stepper: React.FC<StepperProps> = ({ value, onChange, unit, min = 1, max = 99, step = 1 }) => {
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value > min) onChange(Number((value - step).toFixed(2)));
  };
  
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value < max) onChange(Number((value + step).toFixed(2)));
  };

  return (
    <div className="flex items-center border border-brand-gray rounded-md bg-brand-black" onClick={(e) => e.stopPropagation()}>
      <button onClick={handleDecrement} className="p-2 text-stone-400 hover:text-brand-gold disabled:opacity-50" disabled={value <= min} type="button">
        <Minus className="w-4 h-4" />
      </button>
      <div className="px-2 text-center min-w-[3rem] text-sm font-bold">
        {value} <span className="text-xs text-stone-500 font-normal">{unit}</span>
      </div>
      <button onClick={handleIncrement} className="p-2 text-stone-400 hover:text-brand-gold disabled:opacity-50" disabled={value >= max} type="button">
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ProductCard: React.FC<{ 
  product: any, 
  onAdd: (qty: number) => void,
  hasStock: boolean 
}> = ({ product, onAdd, hasStock }) => {
  const [qty, setQty] = React.useState(1);
  const isByWeight = product.unit === 'kg';

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(qty);
  };

  return (
    <div className="group h-full flex flex-col bg-brand-gray rounded-lg overflow-hidden shadow-lg border border-stone-800 hover:border-brand-gold/30 transition-all">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!hasStock ? 'opacity-50 grayscale' : ''}`}
        />
        {!hasStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded">SIN STOCK</span>
          </div>
        )}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.badges.map((b: string) => (
              <Badge key={b} color="gold">{b}</Badge>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-medium text-brand-light line-clamp-2 mb-1" title={product.name}>{product.name}</h3>
        <p className="text-sm text-stone-400 mb-auto">{product.category}</p>
        <div className="flex items-baseline mb-4 mt-2">
          <span className="text-xl font-bold text-brand-gold">${product.price.toLocaleString()}</span>
          <span className="text-sm text-stone-500 ml-1">/ {product.unit}</span>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <Stepper 
            value={qty} 
            onChange={setQty} 
            unit={product.unit} 
            min={isByWeight ? 0.5 : 1} 
            step={isByWeight ? 0.5 : 1}
          />
          <button 
            onClick={handleAddClick}
            disabled={!hasStock}
            type="button"
            className="p-2 bg-brand-gold text-brand-black rounded-md hover:bg-brand-goldLight disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};