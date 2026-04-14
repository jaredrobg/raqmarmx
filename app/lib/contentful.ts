import { createClient, Entry } from "contentful";

// Cliente de Contentful
export const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,    // tu Space ID
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!, // token de entrega
});

// Tipado de tu Content Type "Producto"
export interface ProductoFields {
  modelo: string;
  nombre: string;
  marca: string;
  cantidad: number;
  descripcion: string;
  temporada: string;
  categoria: string;
  color: string;
  material: string;
  precio: number;
  imagen?: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  contentful_product_id: string;
  quantity: number;

  fields?:{
    modelo: string;
    nombre: string;
    marca: string;
    cantidad: number;
    descripcion: string;
    temporada: string;
    categoria: string;
    color: string;
    material: string;
    precio: number;
    imagen?: {
      fields: {
        file: {
          url: string;
        };
      };
    };
    contentful_product_id: string;
    quantity: number;
  }
  sys?:{
    id: string;
  }
  image_URL?: string;
}

// Función para obtener productos SIN usar el genérico en getEntries
export async function getProductos(): Promise<Entry<ProductoFields>[]> {
  const entries = await client.getEntries({
    content_type: "producto",
    order: ['fields.modelo'], // array de strings
  });


  // Hacemos el cast a Entry<ProductoFields>[]
  return entries.items as Entry<ProductoFields>[];
}



