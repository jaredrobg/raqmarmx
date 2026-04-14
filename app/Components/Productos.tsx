'use client';
import '../page.css';
import Image from "next/image";
import {ProductoFields } from "../lib/contentful";
import { Entry } from "contentful";
import FadeIn from './FadeIn';
import { Button } from '../Elements/Elements';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useShoppingBag } from '../Context/ShoppingBagContext';
import { useEffect, useState, useRef } from 'react';
import ModalProducto from './ModalProducto'

interface ProductosProps {
    productos: Entry<ProductoFields>[];
    limit?: number;
}

export default function Productos({productos = [], limit}: ProductosProps){
    const safeProductos = Array.isArray(productos) ? productos : [];
    const {addToShoppingBag} = useShoppingBag();
    const {user, URL} = useAuth();
    const [fecha, setFecha] = useState("");
    const [visible, setVisible] = useState(false);
    const [producto, setProducto] = useState<ProductoFields>({} as ProductoFields);
    const [isMobile, setIsMobile] = useState(false);
    const [visibleCount, setVisibleCount] = useState(8);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    
    //verificacion de movil
    useEffect(()=>{
        const handleResize = ()=>{
            setIsMobile(window.innerWidth < 768);
        }
        handleResize();
        window.addEventListener("resize", handleResize);

        return ()=> window.removeEventListener("resize", handleResize);
    },[]);

    const onClose = ()=>{
        setVisible(false);
        setProducto({} as ProductoFields);
    }

    useEffect(()=>{
        setFecha(new Date().toLocaleString('es-ES'));
    },[]);


    // useEffect(() => {
    //     if (!user) return;

    //     const handler = async () => {
    //         console.log("Productos mandados a registrar_productos: ");
    //         console.log(productos);
    //         try {
    //             const response = await fetch(`${URL}/registrar_productos_raqmar.php`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ user_id: user.internal_id, productos }),
    //             });

    //             // const text = response.text();
    //             // console.log("Respuesta de carga de productos:");
    //             // console.log(text);
                
    //             const data = await response.json();
    //             if (!data.success) console.error("Error sold products:", data.message);
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }

    //     handler();
    // }, []);

    let lista = safeProductos;
    if(limit){  
        lista = lista.slice(0, limit);
    }
    const disponibles = lista.filter(producto => producto.fields.cantidad > 0);

    
    // 👇 Scroll infinito: carga 8 más al llegar al final
    useEffect(() => {
        const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
            setVisibleCount((prev) => Math.min(prev + 8, disponibles.length));
            }
        },
        { threshold: 1 }
        );
        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [disponibles.length]);

    const productosVisibles: Entry<ProductoFields>[] = disponibles.slice(0, visibleCount);
    
    useEffect(() => {
        const timer = setTimeout(() => {
        import("./ModalProducto");
        }, 2000);
        return () => clearTimeout(timer);
    }, []);


    if (disponibles.length === 0) {
        return <p style={{ textAlign: "center" }}>No hay productos disponibles</p>;
    }
    
    return(
        <div className="productosContainer">
            { productosVisibles?.map((producto)=>(
                <div key={producto.sys.id}>
                <FadeIn direction='up'>    
                    <div key={producto.sys.id} className="card" >
                        <div className="card-image" onClick={()=>{ setProducto({...producto.fields, contentful_product_id: producto.sys.id}); setVisible(true);}}>
                            <Image 
                                src={`https:${producto.fields.imagen?.fields.file.url}`}
                                alt={producto.fields.nombre}
                                fill
                                sizes='max-width: 100%; height: auto;'
                                style={{objectFit: "cover", borderRadius:"7px"}}
                            />
                        </div>    
                        <div className="card-content">
                            <h3>{producto.fields.modelo}</h3>
                            <p className="card_nombre">{producto.fields.nombre}</p>
                            <p className="card_precio">{Number(producto.fields.precio).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                            <Button type='addButton' 
                                onClick={()=>addToShoppingBag({
                                    user_id: user ? user.internal_id : 0,
                                    contentful_product_id: producto.sys.id,
                                    image_URL: producto.fields.imagen?.fields.file.url,
                                    modelo: producto.fields.modelo,
                                    nombreProducto: producto.fields.nombre,
                                    precio: producto.fields.precio,
                                    quantity: 1,
                                    added_at: fecha,
                                    disponible: producto.fields.cantidad,
                                    estatus_pedido: '',
                                    order_date: '',
                                    cantidad: 0
                                })} 
                            ><ShoppingBag size={isMobile ? 9 : 15} />+</Button>
                        </div>
                    </div>
                </FadeIn>
                </div>
            ))}

            {visibleCount < disponibles.length && (
                <div ref={loadMoreRef} style={{textAlign:"center", marginTop:"50px", marginBottom:"-70px", paddingBottom:"70px", gridColumn:"1/-1", fontSize:"15px" }}>
                <p>Cargando más productos...</p>
                </div>
            )}
            <ModalProducto visible={visible} onClose={onClose} producto={producto} />
        </div>
    )
}




