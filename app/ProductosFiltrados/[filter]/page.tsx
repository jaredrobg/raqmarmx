import '../../page.css';
import Productos from "../../Components/Productos";
import { getProductos, ProductoFields } from '../../lib/contentful'; 
import { Entry } from "contentful";

export const dynamic = 'force-dynamic';

export const revalidate = 60; // Revalidar cada 60 segundos

interface Props {
  params: Promise<{ filter: string }>;
}

export default async function ProductosFiltrados({ params }: Props) {
  const { filter } = await params;
  let filtro = filter || "todos";
  filtro = filtro.replace(/-/g, " ");

  const productos: Entry<ProductoFields>[] = await getProductos();

  

  const productosFiltrados =
    filtro === 'todos'
      ? productos
      : productos.filter(
          (p) =>
            p.fields.marca?.toLowerCase().includes(filtro.toLowerCase()) ||
            p.fields.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
            p.fields.temporada?.toLowerCase().includes(filtro.toLowerCase())
        );

  return (
    <div className='ProductosFiltradosPage_container'>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "10px",
          marginTop: "30px",
          fontSize: "19px"
        }}
        className='bubble_text'
      >
        {filtro.toUpperCase()}
      </h2>
      <Productos productos={productosFiltrados} />
    </div>
  );
}



export async function generateMetadata({ params }: Props) {
  const { filter } = await params;

  return {
    title: `Productos ${filter} | Raqmar`,
  };
}