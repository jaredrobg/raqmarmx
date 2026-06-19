import { MetadataRoute } from 'next';
import { getProductos } from './lib/contentful';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const productos = await getProductos();

    const productoUrls = productos.map(p => ({
        url: `https://raqmarmx.com/ProductosPage?search=${encodeURIComponent(p.fields.modelo)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [
        { url: 'https://raqmarmx.com', priority: 1 },
        { url: 'https://raqmarmx.com/ProductosPage', priority: 0.9 },
        { url: 'https://raqmarmx.com/Sucursales', priority: 0.8 },
        { url: 'https://raqmarmx.com/AyudaPage', priority: 0.7 },
        { url: 'https://raqmarmx.com/Profile', priority: 0.7 },
        ...productoUrls,
    ];
}