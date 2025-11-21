import { Branch, Category, Product } from '../types';

const BRANCHES: Branch[] = [
  {
    id: 'b1',
    name: 'Saladillo Centro',
    address: 'Av. Rivadavia 2500',
    city: 'Saladillo',
    phone: '+54 2344 123456',
    hours: 'Lun-Sab 09:00 - 21:00',
    services: ['delivery', 'pickup', 'whatsapp'],
    coords: { lat: -35.63, lng: -59.78 }
  },
  {
    id: 'b2',
    name: 'Capital Federal - Palermo',
    address: 'Humboldt 1800',
    city: 'CABA',
    phone: '+54 11 4567 8901',
    hours: 'Lun-Dom 10:00 - 22:00',
    services: ['delivery', 'pickup'],
    coords: { lat: -34.58, lng: -58.43 }
  },
  {
    id: 'b3',
    name: 'La Plata Norte',
    address: 'Calle 7 esq 32',
    city: 'La Plata',
    phone: '+54 221 555 6666',
    hours: 'Lun-Sab 09:00 - 20:00',
    services: ['pickup', 'whatsapp'],
    coords: { lat: -34.90, lng: -57.95 }
  }
];

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Bondiola de Cerdo Premium',
    category: Category.PORK_PACKAGED,
    description: 'Corte premium de cerdo envasado al vacío. Ideal para horno o parrilla.',
    unit: 'kg',
    price: 8500,
    image: 'https://images.pexels.com/photos/11898915/pexels-photo-11898915.jpeg',
    badges: ['Premium', 'Sin TACC'],
    stockByBranch: { 'b1': true, 'b2': true, 'b3': false },
    usage: 'Cocción lenta al horno con mostaza y miel.',
    isFeatured: true
  },
  {
    id: 'p2',
    name: 'Jamón Crudo Reserva 12 Meses',
    category: Category.DELI_MEATS,
    description: 'Estacionamiento natural. Sabor intenso y textura suave.',
    unit: 'kg',
    price: 22000,
    image: 'https://images.pexels.com/photos/4871277/pexels-photo-4871277.jpeg',
    badges: ['Oferta', 'Selección FRS'],
    stockByBranch: { 'b1': true, 'b2': true, 'b3': true },
    usage: 'Ideal para tablas de fiambres acompañado de queso brie.',
    isFeatured: true
  },
  {
    id: 'p3',
    name: 'Queso Sardo Estacionado',
    category: Category.CHEESE,
    description: 'Queso duro de rayar, sabor picante y definido.',
    unit: 'kg',
    price: 14000,
    image: 'https://images.pexels.com/photos/3758132/pexels-photo-3758132.jpeg',
    badges: [],
    stockByBranch: { 'b1': true, 'b2': false, 'b3': true },
    usage: 'Rallar sobre pastas o comer en trozos con vino tinto.'
  },
  {
    id: 'p4',
    name: 'Chorizo de Cerdo Puro',
    category: Category.PORK_SAUSAGE,
    description: 'Elaboración propia 100% cerdo. Sin conservantes.',
    unit: 'kg',
    price: 6500,
    image: 'https://images.pexels.com/photos/27643034/pexels-photo-27643034.jpeg',
    badges: ['Artesanal'],
    stockByBranch: { 'b1': true, 'b2': true, 'b3': true },
    usage: 'Parrilla a fuego medio durante 40 minutos.'
  },
  {
    id: 'p5',
    name: 'Aceite de Oliva Virgen Extra',
    category: Category.OLIVE_OIL_OLIVES,
    description: 'Primera prensada en frío. Acidez menor a 0.5%.',
    unit: 'botella',
    price: 9000,
    image: 'https://images.pexels.com/photos/25745487/pexels-photo-25745487.jpeg',
    badges: [],
    stockByBranch: { 'b1': true, 'b2': true, 'b3': true },
    usage: 'Ideal para ensaladas y terminación de platos.'
  },
  {
    id: 'p6',
    name: 'Picada FRS Especial (4 Personas)',
    category: Category.PICADAS,
    description: 'Selección de jamón, bondiola, queso sardo, fontina, aceitunas y salame.',
    unit: 'unidad',
    price: 35000,
    image: 'https://images.pexels.com/photos/10867061/pexels-photo-10867061.jpeg',
    badges: ['Pack Familiar', 'Listo para comer'],
    stockByBranch: { 'b1': true, 'b2': true, 'b3': false },
    usage: 'Sacar de la heladera 30 minutos antes de consumir.'
  },
  {
    id: 'p7',
    name: 'Malbec Reserva 2021',
    category: Category.WINES,
    description: 'Vino tinto de gran cuerpo, notas a frutos rojos y madera.',
    unit: 'botella',
    price: 8500,
    image: 'https://images.pexels.com/photos/18723006/pexels-photo-18723006.jpeg',
    badges: ['Recomendado'],
    stockByBranch: { 'b1': true, 'b2': true, 'b3': true },
    usage: 'Maridaje perfecto con carnes rojas y quesos duros.'
  },
  {
    id: 'p8',
    name: 'Mortadela con Pistachos',
    category: Category.DELI_MEATS,
    description: 'Mortadela italiana con pistachos naturales. Feteada fina.',
    unit: 'kg',
    price: 9800,
    image: 'https://images.pexels.com/photos/20351630/pexels-photo-20351630.jpeg',
    badges: [],
    stockByBranch: { 'b1': true, 'b2': true, 'b3': true }
  },
  {
    id: 'p9',
    name: 'Aceitunas Negras Griegas',
    category: Category.OLIVE_OIL_OLIVES,
    description: 'Aceitunas negras carnosas y especiadas.',
    unit: 'kg',
    price: 7500,
    image: 'https://images.pexels.com/photos/4109909/pexels-photo-4109909.jpeg',
    badges: [],
    stockByBranch: { 'b1': false, 'b2': true, 'b3': true }
  },
  {
    id: 'p10',
    name: 'Pack Parrillero Full',
    category: Category.PORK_PACKAGED,
    description: 'Incluye pechito de cerdo, matambrito y chorizos.',
    unit: 'pack',
    price: 28000,
    image: 'https://images.pexels.com/photos/12592498/pexels-photo-12592498.jpeg',
    badges: ['Pack Familiar', 'Oferta'],
    stockByBranch: { 'b1': true, 'b2': true, 'b3': true },
    isFeatured: true
  }
];

export const api = {
  getBranches: async (): Promise<Branch[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(BRANCHES), 500));
  },
  getProducts: async (): Promise<Product[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(PRODUCTS), 600));
  },
  getProductById: async (id: string): Promise<Product | undefined> => {
    return new Promise((resolve) => setTimeout(() => resolve(PRODUCTS.find(p => p.id === id)), 400));
  }
};