import * as fs from 'fs';
import * as path from 'path';

// Note: In a real environment, we'd import these.
// For this script, we'll manually define or extract them to avoid TS/ESM issues in a simple script.

const BASE_URL = 'https://masembe.vercel.app';

const staticRoutes = [
  '/',
  '/cars',
  '/cars/showroom',
  '/cars/inventory',
  '/cars/workshop',
  '/cars/import',
  '/property',
  '/property/portfolio',
  '/property/projects',
  '/about',
  '/contact',
];

// Mocking data since we can't easily import TS files with ESM/TS-Node without extra setup
// We'll read the files as text and extract IDs if needed, but for now I'll just use the ones I saw.

const carIds = [
  'rolls-royce-cullinan',
  'mercedes-sprinter',
  'gle-350d',
  'bentley-gt',
  'bmw-7-series',
  'bmw-7-mansory',
  'range-rover-vogue',
  'gle-63-amg',
  'mercedes-g-class',
  'mercedes-gle',
  'nissan-fuga',
  'toyota-lc300',
  'mercedes-e-class',
  'mercedes-ml350',
  'mercedes-glc',
  'ford-raptor-r',
  'mazda-cx5-2017',
  'lexus-is250',
  'lexus-lx570',
  'porsche-cayenne-2013',
  'porsche-panamera',
  'subaru-forester',
  'toyota-harrier',
  'toyota-prado',
  'toyota-vellfire'
];

const propertyIds = [
  'smart-tower-one',
  'green-residence'
];

const generateSitemap = () => {
  const lastmod = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Static routes
  staticRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });

  // Car routes
  carIds.forEach(id => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}/cars/inventory/${id}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.9</priority>\n';
    xml += '  </url>\n';
  });

  // Property routes
  propertyIds.forEach(id => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}/property/portfolio/${id}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.9</priority>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), xml);
  console.log('Sitemap generated successfully!');
};

generateSitemap();
