
export enum Category {
  PORK_PACKAGED = "Productos de cerdo envasados",
  DELI_MEATS = "Fiambres",
  CHEESE = "Quesos de rayar y cremosos",
  PORK_SAUSAGE = "Chacinados de cerdo",
  OLIVE_OIL_OLIVES = "Aceites de oliva y aceitunas",
  PICADAS = "Picadas",
  WINES = "Vinos"
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  services: ('delivery' | 'pickup' | 'whatsapp')[];
  coords: { lat: number; lng: number };
  isFavorite?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string;
  infoNutricional?: string;
  usage?: string;
  unit: 'kg' | 'unidad' | 'botella' | 'pack';
  price: number;
  image: string;
  badges?: string[];
  stockByBranch: Record<string, boolean>; // branchId -> inStock
  isFeatured?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  unit: string;
  price: number;
  name: string;
  image: string;
}

export interface Cart {
  items: CartItem[];
  branchId: string | null;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  // Wholesale / Merchant data
  cuit?: string;
  businessName?: string;
  isWholesale?: boolean;
}
