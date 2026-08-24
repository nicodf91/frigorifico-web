import React, { useState } from 'react';
import { Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../services/state';
import { Button, Stepper } from '../components/Shared';
import { useNavigate } from 'react-router-dom';

export const Checkout: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, selectedBranch, clearCart } = useApp();
  const navigate = useNavigate();
  const [deliveryType, setDeliveryType] = useState<'shipping' | 'pickup'>('pickup');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: selectedBranch?.city || '',
    comments: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = deliveryType === 'shipping' ? 2500 : 0; // Mock cost
  const total = subtotal + shippingCost;

  if (cart.items.length === 0 && !submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-serif font-bold text-brand-light mb-4">Tu carrito está vacío</h2>
        <p className="text-stone-400 mb-8">Parece que aún no has agregado productos deliciosos.</p>
        <Button onClick={() => navigate('/productos')}>Ir al Catálogo</Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-green-900/20 border border-green-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-brand-light mb-4">Apertura de WhatsApp solicitada</h2>
        <p className="text-stone-400 mb-8">
          El mensaje para {selectedBranch?.name} quedó preparado. Revisalo y envialo desde WhatsApp para iniciar la consulta;
          esta demo no registra pedidos por sí sola.
        </p>
        <Button onClick={() => { setSubmitted(false); clearCart(); navigate('/'); }}>Volver al Inicio</Button>
      </div>
    );
  }

  const handleWhatsappOrder = () => {
    if (!selectedBranch) return;
    
    let msg = `*NUEVO PEDIDO WEB FRS*\n`;
    msg += `Cliente: ${formData.name}\n`;
    msg += `Entrega: ${deliveryType === 'shipping' ? 'Envío a domicilio' : 'Retiro en sucursal'}\n`;
    if (deliveryType === 'shipping') msg += `Dirección: ${formData.address}, ${formData.city}\n`;
    msg += `\n*Detalle del pedido:*\n`;
    
    cart.items.forEach(item => {
      msg += `- ${item.quantity} ${item.unit} x ${item.name} ($${(item.price * item.quantity).toLocaleString()})\n`;
    });
    
    msg += `\n*Total: $${total.toLocaleString()}*`;
    if(formData.comments) msg += `\nNota: ${formData.comments}`;

    window.open(
      `https://wa.me/${selectedBranch.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer',
    );
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-brand-light mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-brand-gray border border-stone-800 rounded-lg overflow-hidden">
             <div className="p-4 border-b border-stone-800 bg-stone-900/50">
               <h3 className="font-bold text-brand-light">Productos en tu carrito</h3>
             </div>
             <div className="divide-y divide-stone-800">
               {cart.items.map(item => (
                 <div key={item.productId} className="p-4 flex items-center gap-4">
                   <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover bg-stone-800" />
                   <div className="flex-1">
                     <h4 className="text-brand-light font-medium">{item.name}</h4>
                     <p className="text-sm text-brand-gold">${item.price.toLocaleString()} / {item.unit}</p>
                   </div>
                   <div className="flex items-center gap-4">
                     <Stepper 
                       value={item.quantity} 
                       onChange={(q) => updateQuantity(item.productId, q)}
                       unit={item.unit}
                       min={item.unit === 'kg' ? 0.5 : 1}
                       step={item.unit === 'kg' ? 0.5 : 1}
                     />
                     <p className="font-bold text-brand-light w-20 text-right">
                       ${(item.price * item.quantity).toLocaleString()}
                     </p>
                     <button onClick={() => removeFromCart(item.productId)} className="text-stone-500 hover:text-red-500">
                       <Trash2 className="w-5 h-5" />
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Delivery Details */}
           <div className="bg-brand-gray border border-stone-800 rounded-lg p-6">
              <h3 className="font-bold text-brand-light mb-4">Datos de Entrega</h3>
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setDeliveryType('pickup')}
                  className={`flex-1 py-3 rounded-md border ${deliveryType === 'pickup' ? 'bg-brand-gold text-brand-black border-brand-gold' : 'border-stone-700 text-stone-400'}`}
                >
                  Retiro en Sucursal
                </button>
                <button 
                  onClick={() => setDeliveryType('shipping')}
                  className={`flex-1 py-3 rounded-md border ${deliveryType === 'shipping' ? 'bg-brand-gold text-brand-black border-brand-gold' : 'border-stone-700 text-stone-400'}`}
                >
                  Envío a Domicilio
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Nombre completo *" 
                  className="bg-stone-900 border border-stone-700 rounded p-3 text-brand-light w-full"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <input 
                  type="tel" 
                  placeholder="Teléfono / WhatsApp *" 
                  className="bg-stone-900 border border-stone-700 rounded p-3 text-brand-light w-full"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
                {deliveryType === 'shipping' && (
                  <>
                    <input 
                      type="text" 
                      placeholder="Dirección exacta *" 
                      className="bg-stone-900 border border-stone-700 rounded p-3 text-brand-light w-full md:col-span-2"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                    <input 
                      type="text" 
                      placeholder="Ciudad" 
                      className="bg-stone-900 border border-stone-700 rounded p-3 text-brand-light w-full"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                  </>
                )}
                <textarea 
                  placeholder="Comentarios (piso, depto, indicaciones)" 
                  className="bg-stone-900 border border-stone-700 rounded p-3 text-brand-light w-full md:col-span-2 h-24"
                  value={formData.comments}
                  onChange={e => setFormData({...formData, comments: e.target.value})}
                ></textarea>
              </div>
           </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-brand-gray border border-stone-800 rounded-lg p-6 sticky top-24">
            <h3 className="font-bold text-brand-light mb-4">Resumen del Pedido</h3>
            <div className="space-y-2 text-sm text-stone-400 mb-4 border-b border-stone-800 pb-4">
              <div className="flex justify-between">
                <span>Sucursal</span>
                <span className="text-brand-light text-right">{selectedBranch?.name || 'No seleccionada'}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-brand-light">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="text-brand-light">${shippingCost.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between text-xl font-bold text-brand-gold mb-6">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>

            {!selectedBranch && (
              <div className="mb-4 text-red-400 text-sm bg-red-900/20 p-2 rounded flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" /> Seleccioná una sucursal para continuar
              </div>
            )}

            <div className="space-y-3">
               {/* Real payment integration would go here. For now, WhatsApp is the primary method per prompt */}
               <Button 
                 className="w-full flex items-center justify-center bg-green-600 hover:bg-green-500 text-white" 
                 onClick={handleWhatsappOrder}
                 disabled={!selectedBranch || !formData.name || !formData.phone || (deliveryType === 'shipping' && !formData.address)}
               >
                 <span className="mr-2">Confirmar por WhatsApp</span>
               </Button>
               <p className="text-xs text-stone-500 text-center mt-2">
                 Al confirmar, serás redirigido a WhatsApp para enviar el detalle de tu pedido a la sucursal.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
