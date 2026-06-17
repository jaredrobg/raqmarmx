'use client';
import '../page.css';
import Image from "next/image";
import {ProductoFields } from "../lib/contentful";
import { Entry } from "contentful";
import FadeIn from './FadeIn';
import { Button } from '../Elements/Elements';
import { ShoppingBag, Heart } from 'lucide-react';
import { FaHeart } from "react-icons/fa";
import { useAuth } from '../Context/AuthContext';
import { useShoppingBag } from '../Context/ShoppingBagContext';
import { useEffect, useState, useRef } from 'react';
import ModalProducto from './ModalProducto'
import ModalListas from './ModalListas';
import toast from 'react-hot-toast';
import { trackEvent } from '../lib/metaPixel';

interface ProductosProps {
    productos: Entry<ProductoFields>[];
    limit?: number;
}

function useImageCarousel(images: string[], isMobile: boolean) {
    const [idx, setIdx] = useState(0);
    const touchStartX = useRef<number | null>(null);

    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIdx(i => (i - 1 + images.length) % images.length);
    };
    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIdx(i => (i + 1) % images.length);
    };

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            setIdx(i => diff > 0
                ? (i + 1) % images.length
                : (i - 1 + images.length) % images.length
            );
        }
        touchStartX.current = null;
    };

    return {
        idx,
        prev,
        next,
        onTouchStart: isMobile ? onTouchStart : undefined,
        onTouchEnd: isMobile ? onTouchEnd : undefined,
    };
}

function CardImage({ producto, isMobile, onClick }: {
    producto: Entry<ProductoFields>;
    isMobile: boolean;
    onClick: () => void;
}) {
    const images = [
        producto.fields.imagen?.fields.file.url,
        producto.fields.imagen2?.fields.file.url,
        producto.fields.imagen3?.fields.file.url,
    ].filter(Boolean) as string[];

    const { idx, prev, next, onTouchStart, onTouchEnd } = useImageCarousel(images, isMobile);
    const multi = images.length > 1;

    return (
        <>
            <div
                className="card-image"
                onClick={onClick}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                style={{ position: "relative", overflow: "hidden" }}
            >
                {images.map((url, i) => (
                    <Image
                        key={url}
                        src={`https:${url}`}
                        alt={`${producto.fields.nombre} ${i + 1}`}
                        fill
                        sizes="max-width: 100%; height: auto;"
                        style={{
                            objectFit: "cover",
                            borderRadius: "7px",
                            transition: "transform 0.25s ease",
                            transform: `translateX(${(i - idx) * 100}%)`,
                        }}
                    />
                ))}

                {multi && !isMobile && (
                    <>
                        <button
                            onClick={prev}
                            className="card-arrow card-arrow-left"
                            aria-label="Imagen anterior"
                        >‹</button>
                        <button
                            onClick={next}
                            className="card-arrow card-arrow-right"
                            aria-label="Siguiente imagen"
                        >›</button>
                    </>
                )}
            </div>

            {multi && (
                <div className="card-dots">
                    {images.map((_, i) => (
                        <span
                            key={i}
                            className={`card-dot${i === idx ? " active" : ""}`
                        }/>
                    ))}
                </div>
            )}
        </>
    );
}

export default function Productos({productos = [], limit}: ProductosProps){
    const safeProductos = Array.isArray(productos) ? productos : [];
    const {addToShoppingBag, discountedTotal} = useShoppingBag();
    const {user, URL} = useAuth();
    const [fecha, setFecha] = useState("");
    const [visible, setVisible] = useState(false);
    const [producto, setProducto] = useState<ProductoFields>({} as ProductoFields);
    const [isMobile, setIsMobile] = useState(false);
    const [smallDesk, setSmallDesk] = useState(false);
    const [visibleCount, setVisibleCount] = useState(0); // 0 = "aún no inicializado"
    const [modalListasVisible, setModalListasVisible] = useState(false);
    const [selectedProductoId, setSelectedProductoId] = useState<string | null>(null);
    const [savedProducts, setSavedProducts] = useState<string[]>([]);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const pageSize = isMobile ? 8 : smallDesk ? 12 : 15;

    // Calcula tamaño de pantalla Y visibleCount juntos, en el mismo efecto
    useEffect(() => {
        const mobile = window.innerWidth < 768;
        const small = window.innerWidth < 1200;
        setIsMobile(mobile);
        setSmallDesk(small);
        setVisibleCount(mobile ? 8 : small ? 12 : 15);

        let timeout: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setIsMobile(window.innerWidth < 768);
                setSmallDesk(window.innerWidth < 1200);
            }, 150);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(timeout);
        };
    }, []);

    const onClose = ()=>{
        setVisible(false);
        setProducto({} as ProductoFields);
    }

    useEffect(()=>{
        setFecha(new Date().toLocaleString('es-ES'));
    },[]);

    let lista = safeProductos;
    if(limit){
        lista = lista.slice(0, isMobile ? limit: smallDesk ? limit + 5 : limit + 9);
    }
    const disponibles = lista.filter(producto => producto.fields.cantidad > 0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + pageSize, disponibles.length));
                }
            },
            { threshold: 1 }
        );
        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [disponibles.length, pageSize]);

    // Si visibleCount aún no se calculó (0), no renderiza nada todavía
    const productosVisibles: Entry<ProductoFields>[] = visibleCount > 0 
        ? disponibles.slice(0, visibleCount) 
        : [];

    // ... resto igual

    useEffect(() => {
        const timer = setTimeout(() => {
            import("./ModalProducto");
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (user){
            const fetchSavedProducts = async () =>{
                try{
                    const res = await fetch(`${URL}/get_user_lists.php`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ user_id: user.internal_id }),
                    });
                    const data = await res.json();
                    if (data.success){
                        const productosGuardados = data.listas?.map((item: { product_id: string }) => item.product_id);
                        setSavedProducts(productosGuardados);
                    }
                } catch (err){
                    console.error(err);
                    toast.error("Error al obtener productos guardados");
                }
            }
            fetchSavedProducts();
        }
    },[user]);

    const handleProductSaved = (productId: string) => {
        if(!savedProducts) return;
        setSavedProducts(prev => {
            if (prev?.includes(productId)) return prev;
            return [...prev, productId];
        });
    };

    const handleProductRemoved = (productId: string) => {
        setSavedProducts(prev => prev.filter(id => id !== productId));
    };

    if (disponibles.length === 0) {
        return <p style={{ textAlign: "center" }}>No hay productos disponibles</p>;
    }

    const abrirModalListas = (productoId: string) => {
        setSelectedProductoId(productoId);
        setModalListasVisible(true);
    }

    return(
        <div className="productosContainer">
            { productosVisibles?.map((producto)=>(
                <div key={producto.sys.id}>
                <FadeIn direction='up'>
                    <div key={producto.sys.id} className="card">
                        <CardImage
                            producto={producto}
                            isMobile={isMobile}
                            onClick={() => {
                                setProducto({...producto.fields, contentful_product_id: producto.sys.id});
                                setVisible(true);
                                trackEvent("ExpandProduct", {
                                    content_name: producto.fields?.nombre,
                                });
                            }}
                        />
                        <div className="card-content">
                            <h3>{producto.fields.nombre}</h3>
                            <p className="card_nombre">{producto.fields.modelo}</p>
                            <p className="card_precio_antes">{Number(producto.fields.precio).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                            <p className="card_precio">{Number((producto.fields.precio) * discountedTotal).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                            <Button type='addButton'
                                onClick={()=>{
                                    addToShoppingBag({
                                    user_id: user ? user.internal_id : 0,
                                    contentful_product_id: producto.sys.id,
                                    image_URL: producto.fields.imagen?.fields.file.url,
                                    modelo: producto.fields.modelo,
                                    nombreProducto: producto.fields.nombre,
                                    precio: Number(producto.fields.precio) * discountedTotal,
                                    quantity: 1,
                                    added_at: fecha,
                                    disponible: producto.fields.cantidad,
                                    estatus_pedido: '',
                                    order_date: '',
                                    cantidad: 0
                                });
                                trackEvent("AddToCart", {
                                    content_name: producto.fields.nombre,
                                    value: producto.fields.precio,
                                    currency: "MXN",
                                });
                            }}
                            ><ShoppingBag size={isMobile ? 9 : 15} />+</Button>
                            <Button type='addButton'
                                onClick={()=>{
                                    abrirModalListas(producto.sys.id);
                                    trackEvent("AddToList", {
                                        content_name: producto.fields.nombre,
                                        value: producto.fields.precio,
                                    });
                                }}
                            >
                                {savedProducts?.includes(producto.sys.id) ? <FaHeart size={isMobile ? 9 : 15}/> : <Heart size={isMobile ? 9 : 15} />}
                            </Button>
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
            <ModalProducto
                visible={visible}
                onClose={onClose}
                producto={producto}
                onProductSaved={handleProductSaved}
                onProductRemoved={handleProductRemoved}
                listButton={true}
            />
            <ModalListas
                visible={modalListasVisible}
                onClose={() => setModalListasVisible(false)}
                productoId={selectedProductoId}
                onProductSaved={handleProductSaved}
                onProductRemoved={handleProductRemoved}
            />
        </div>
    )
}