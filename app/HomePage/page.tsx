import '../page.css';
import HeadImages from '../Components/HeadImages';
import Favoritos from '../Components/Favoritos';
import Productos from '../Components/Productos';
import FadeIn from '../Components/FadeIn';
import { getProductos, ProductoFields } from "../lib/contentful";
import { Entry } from "contentful";
import {Glasses} from 'lucide-react';
import { LuAward } from "react-icons/lu";
import Link from 'next/link';


export const revalidate = 60; // Revalidar cada 60 segundos

interface HomePageProps {
  productos: Entry<ProductoFields>[];
}

export default async function HomePage({ productos }: HomePageProps) {
    const productosobt: Entry<ProductoFields>[] = await getProductos();
    
    
    return(
        <div>
            <FadeIn direction='down'>
                <HeadImages />
            </FadeIn>
            <FadeIn >
                <div className="raqmar-info first">
                    <h4>POR QUE ELEGIRNOS?</h4>
                    <LuAward className='glasses icon'/>
                    <p style={{textAlign: 'center'}}>
                        Porque tenemos los mejores productos, las fragancias mas ricas, los lentes con el mejor diseño y 
                        calidad y un servicio excepcional.
                    </p>
                </div>
            </FadeIn>
            <FadeIn direction='up'>
                <div className="raqmar-info second">
                    <h4>QUIENES SOMOS?</h4>
                    <p>
                        En RAQMAR somos una empresa dedicada a encotrar el balance perfecto entre calidad y precio,
                         ofreciendo una amplia variedad de productos de las mejores marcas a precios accesibles.
                    </p>
                </div>
            </FadeIn>
            <FadeIn direction='up'>
                <Favoritos />
            </FadeIn>
            <FadeIn direction='up'>
                <div className='bubble_text'>Nuestros productos</div>
            </FadeIn>
            <Productos productos={productosobt} limit={11}/>

            <div className='ver_mas'>
                 <Link href="/ProductosPage">
                    Todos los Productos
                </Link>
            </div>
            
        </div>
    );
}

