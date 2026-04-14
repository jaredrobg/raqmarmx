import '../../page.css';
import Productos from "../../Components/Productos";
import { getProductos, ProductoFields } from '../../lib/contentful'; 
import { Entry } from "contentful";


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

export async function generateStaticParams() {
  return [
    // Marcas
    { filter: "al-haramain" },
    { filter: "armani" },
    { filter: "bharara" },
    { filter: "cacharel" },
    { filter: "calvin-klein" },
    { filter: "carolina-herrera" },
    { filter: "dolce-gabbana" },
    { filter: "ferrari" },
    { filter: "givenchy" },
    { filter: "hugo-boss" },
    { filter: "lacoste" },
    { filter: "lancome" },
    { filter: "lattafa" },
    { filter: "love-moschino" },
    { filter: "michel-kors" },
    { filter: "montblanc" },
    { filter: "olive-people" },
    { filter: "paco-rabanne" },
    { filter: "paris-hilton" },
    { filter: "polo" },
    { filter: "ralph-lauren" },
    { filter: "rasasi" },
    { filter: "rayban" },
    { filter: "versace" },
    { filter: "victorias-secret" },
    { filter: "yves-saint-laurent" },

    // Temporadas
    { filter: "primavera" },
    { filter: "verano" },
    { filter: "otono" },
    { filter: "invierno" },

    // Categorías
    { filter: "lente-solar" },
    { filter: "lente-oftalmico" },
    { filter: "fragancia" },
    { filter: "fragancia-arabe" },
    { filter: "accesorio" },

    // Opción general
    { filter: "todos" },
  ];
}

export async function generateMetadata({ params }: Props) {
  const { filter } = await params;

  return {
    title: `Productos ${filter} | Raqmar`,
  };
}