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
    id: 'luxury-apartments',
    name: 'Luxury Residential Collection',
    location: 'Prime Locations',
    type: 'Apartment',
    price: 'Starting from $500,000',
    bedrooms: 3,
    area: '2,500 - 4,000 sqft',
    completionDate: 'Available Now',
    watermarkText: 'LUXURY',
    image: '/assets/realestate/apartments/IMG-20260408-WA0007 (1).jpg',
    gallery: [
      '/assets/realestate/apartments/IMG-20260408-WA0007 (1).jpg',
      '/assets/realestate/apartments/IMG-20260408-WA0015 (1).jpg',
      '/assets/realestate/apartments/IMG-20260408-WA0024.jpg',
      '/assets/realestate/apartments/IMG-20260408-WA0026.jpg',
      '/assets/realestate/apartments/TikVideo.App_7631224490906619156.mp4',
      '/assets/realestate/apartments/TikVideo.App_7631370759411207444.mp4'
    ]
  },
  {
    id: 'construction-portfolio',
    name: 'Ongoing Developments',
    location: 'Metropolitan Area',
    type: 'Commercial',
    price: 'Portfolio',
    bedrooms: 0,
    area: 'Various Sizes',
    completionDate: 'In Progress',
    watermarkText: 'BUILD',
    image: '/assets/realestate/construction/IMG-20260408-WA0010 (1).jpg',
    gallery: [
      '/assets/realestate/construction/IMG-20260408-WA0010 (1).jpg',
      '/assets/realestate/construction/IMG-20260408-WA0011 (1).jpg',
      '/assets/realestate/construction/IMG-20260408-WA0012 (1).jpg',
      '/assets/realestate/construction/IMG-20260408-WA0012(1) (1).jpg',
      '/assets/realestate/construction/IMG-20260408-WA0013 (1).jpg',
      '/assets/realestate/construction/IMG-20260408-WA0014 (1).jpg',
      '/assets/realestate/construction/IMG-20260408-WA0014(1) (1).jpg',
      '/assets/realestate/construction/TikVideo.App_7609107844629056786.mp4',
      '/assets/realestate/construction/VID-20260408-WA0005 (1).mp4',
      '/assets/realestate/construction/VID-20260408-WA0006 (1).mp4',
      '/assets/realestate/construction/VID-20260408-WA0009 (1).mp4',
      '/assets/realestate/construction/VID-20260408-WA0019.mp4',
      '/assets/realestate/construction/VID-20260408-WA0020.mp4',
      '/assets/realestate/construction/VID-20260408-WA0021.mp4',
      '/assets/realestate/construction/VID-20260408-WA0022.mp4',
      '/assets/realestate/construction/VID-20260408-WA0023.mp4'
    ]
  },
  {
    id: 'innovation-plans',
    name: 'Future Concepts & Plans',
    location: 'Design Studio',
    type: 'Villa',
    price: 'Conceptual',
    bedrooms: 4,
    area: 'Architectural Renders',
    completionDate: 'Q1 2028',
    watermarkText: 'FUTURE',
    image: '/assets/realestate/innovation/TikVideo.App_7618342743051390216_1.jpeg',
    gallery: [
      '/assets/realestate/innovation/TikVideo.App_7618342743051390216_1.jpeg',
      '/assets/realestate/innovation/TikVideo.App_7618342743051390216_2.jpeg',
      '/assets/realestate/innovation/TikVideo.App_7618342743051390216_3.jpeg',
      '/assets/realestate/innovation/TikVideo.App_7618342743051390216_4.jpeg',
      '/assets/realestate/innovation/TikVideo.App_7618342743051390216_5.jpeg',
      '/assets/realestate/innovation/TikVideo.App_7604206572641799442_1.jpeg',
      '/assets/realestate/innovation/TikVideo.App_7616838031080705288.mp4',
      '/assets/realestate/innovation/TikVideo.App_7629038189721963797.mp4'
    ]
  },
  {
    id: 'commercial-plaza',
    name: 'Modern Business Plaza',
    location: 'Business District',
    type: 'Commercial',
    price: 'Inquiry Only',
    bedrooms: 0,
    area: '100,000+ sqft',
    completionDate: 'Completed',
    watermarkText: 'PLAZA',
    image: '/assets/realestate/plaza/TikVideo.App_7604206572641799442_2.jpeg',
    gallery: [
      '/assets/realestate/plaza/TikVideo.App_7604206572641799442_2.jpeg',
      '/assets/realestate/plaza/TikVideo.App_7616759741858991368.mp4',
      '/assets/realestate/plaza/TikVideo.App_7616763110204001554.mp4',
      '/assets/realestate/plaza/TikVideo.App_7622467322074156296.mp4',
      '/assets/realestate/plaza/TikVideo.App_7622467583370972423.mp4',
      '/assets/realestate/plaza/TikVideo.app-7604206572641799442-(1080p).mp4'
    ]
  }
];
