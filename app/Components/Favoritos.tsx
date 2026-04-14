'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import './../page.css';
import Image from 'next/image';
import ModalProducto from './ModalProducto';
import { ProductoFields } from '../lib/contentful';


type Producto ={
    contentful_product_id: string;
    nombreProducto: string;
    modelo: string;
    precio: number;
    image_URL: string;
    descripcion: string;
    material: string;
    temporada: string;
    marca: string;
    categoria: string;
}

export default function Favoritos(){
    const {URL} = useAuth();
    const [productos, setProductos] = useState<ProductoFields[]>([]);
    const [productoModal, setProductoModal] = useState<ProductoFields>({} as ProductoFields);
    const [visible, setVisible] = useState(false);

    const onClose = ()=>{
        setVisible(false);
        setProductoModal({} as ProductoFields);
    }

    useEffect(()=>{
        const obtenerFavoritos = async()=>{
            try{
                const response = await fetch(`${URL}/mas_vendidos_raqmar.php`);
                const data = await response.json();
                if(data.success){
                    console.log("Obtencion Favoritos:");
                    console.log(data.productos);

                    setProductos(data.productos);
                }else{
                    console.error("Error en la obtencion de Favoritos:", data.message);
                }
            }catch{

            }
        }
        obtenerFavoritos();
    },[])



    
    return(
        <div className='Favoritos_container'>
            <div className='sub_fav Principal' onClick={()=>{setVisible(true); setProductoModal(productos[0])}}>
                {productos[0]&&(
                    <Image className='fav_image' 
                    src={`https:${productos[0]?.image_URL}`} 
                    alt="fav-big" 
                    fill 
                    sizes='max-width: 100%; height: auto;'
                    style={{ objectFit: "cover" }}
                    />
                )}
            </div>
            <div className='sub_fav favText'>NUESTROS FAVORITOS</div>
            {productos?.map((producto, index)=>{
                if(index>0){
                return (
                <div className='sub_fav fav1' key={producto.contentful_product_id} onClick={()=>{setVisible(true); setProductoModal(producto)}}>
                    <Image 
                        className='fav_image' 
                        src={`https:${producto.image_URL}`}  
                        alt="fav-img" 
                        sizes='max-width: 100%; height: auto;' 
                        fill 
                        style={{ objectFit: "cover" }}/>
                </div>
                )
                }
            }
            )}
            <ModalProducto onClose={onClose} visible={visible} producto={productoModal} />
        </div>
    )
}