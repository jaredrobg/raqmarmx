import { getProductos, ProductoFields } from "../lib/contentful";
import { Entry } from "contentful";
import ComprarNuevamente from "../Components/ComprarNuevamente";

export const revalidate = 60; // Revalidar cada 60 segundos


export default async function ProductosPageServer() {
  const productos: Entry<ProductoFields>[] = await getProductos();

  return (
    <div className="ProductosPage">
      <ComprarNuevamente productos={productos} />
    </div>
  );
}