import { getProductos, ProductoFields } from "../lib/contentful";
import { Entry } from "contentful";
import ComprarNuevamente from "../Components/ComprarNuevamente";

export const revalidate = 43200; // Revalidar cada 12 horas


export default async function ProductosPageServer() {
  const productos: Entry<ProductoFields>[] = await getProductos();

  return (
    <div className="ProductosPage">
      <ComprarNuevamente productos={productos} />
    </div>
  );
}