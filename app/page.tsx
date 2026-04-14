import HomePage from './HomePage/page';
import { getProductos, ProductoFields } from "./lib/contentful";
import { Entry } from "contentful";
import './page.css';

export const revalidate = 60; // Revalidar cada 60 segundos

interface HomePageProps {
  productos: Entry<ProductoFields>[];
}

export default async function Home({productos}:HomePageProps) {
  const productosobt: Entry<ProductoFields>[] = await getProductos();
  

  return (
    <div className='app'>
      <HomePage productos={productosobt}/>
    </div>
  );
}
