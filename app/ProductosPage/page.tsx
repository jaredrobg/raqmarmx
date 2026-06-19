import { getProductos, ProductoFields } from "../lib/contentful";
import { Entry } from "contentful";
import ProductosPage from "./ProductosPageClient";


export const revalidate = 43200; // Revalidar cada 12 horas

export const metadata = {
    title: "Productos | Raqmar — Fragancias y Lentes Solares",
    description: "Encuentra las mejores fragancias y lentes solares al mejor precio en Raqmar.",
    openGraph: {
        title: "Productos | Raqmar",
        description: "Fragancias y lentes solares de calidad.",
        url: "https://raqmarmx.com/ProductosPage",
        siteName: "Raqmar",
        images: [{ url: "https://raqmarmx.com/og-image.jpg" }],
        type: "website",
    },
};


export default async function ProductosPageServer() {
  const productos: Entry<ProductoFields>[] = await getProductos();

  return (
    <div className="ProductosPage">
      <ProductosPage productos={productos} />
    </div>
  );
}