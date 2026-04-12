export interface Property {
  id: string;
  name: string;
  location: string;
  type: 'Villa' | 'Apartment' | 'Commercial';
  price: string;
  bedrooms: number;
  area: string;
  completionDate: string;
  watermarkText: string;
  image: string;
  gallery: string[];
}

export const properties: Property[] = [
  {
    id: 'smart-tower-one',
    name: 'Eco-Vertical Tower',
    location: 'Kampala Central',
    type: 'Commercial',
    price: '$12,000,000',
    bedrooms: 0,
    area: '45,000 sqft',
    completionDate: 'Q4 2027',
    watermarkText: 'VERTICAL',
    image: '/assets/new_re/IMG-20260408-WA0010.jpg',
    gallery: [
      '/assets/new_re/IMG-20260408-WA0007.jpg',
      '/assets/new_re/IMG-20260408-WA0010.jpg',
      '/assets/new_re/IMG-20260408-WA0011.jpg',
      '/assets/new_re/IMG-20260408-WA0012.jpg',
      '/assets/new_re/IMG-20260408-WA0012(1).jpg',
      '/assets/new_re/IMG-20260408-WA0013.jpg',
      '/assets/new_re/IMG-20260408-WA0014.jpg',
      '/assets/new_re/IMG-20260408-WA0014(1).jpg',
      '/assets/new_re/IMG-20260408-WA0015.jpg',
      '/assets/new_re/IMG-20260408-WA0024.jpg',
      '/assets/new_re/IMG-20260408-WA0025.jpg',
      '/assets/new_re/IMG-20260408-WA0026.jpg',
      '/assets/new_re/MASEMBE-RE_logo.jpg'
    ]
  },
  {
    id: 'green-residence',
    name: 'The Green Residence',
    location: 'Kololo',
    type: 'Villa',
    price: '$3,500,000',
    bedrooms: 5,
    area: '8,500 sqft',
    completionDate: 'Completed',
    watermarkText: 'ECO',
    image: '/assets/new_re/IMG-20260408-WA0013.jpg',
    gallery: [
      '/assets/new_re/IMG-20260408-WA0013.jpg',
      '/assets/new_re/IMG-20260408-WA0014.jpg',
      '/assets/new_re/IMG-20260408-WA0014(1).jpg',
      '/assets/new_re/VID-20260408-WA0019.mp4',
      '/assets/new_re/VID-20260408-WA0020.mp4',
      '/assets/new_re/VID-20260408-WA0021.mp4',
      '/assets/new_re/VID-20260408-WA0022.mp4',
      '/assets/new_re/VID-20260408-WA0023.mp4'
    ]
  }
];
