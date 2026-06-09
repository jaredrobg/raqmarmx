'use client';
import '../page.css';
import Image from "next/image";
import { Button } from '../Elements/Elements';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { createPortal } from 'react-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { FaHeart } from "react-icons/fa";
import { useShoppingBag } from '../Context/ShoppingBagContext';
import { useAuth } from '../Context/AuthContext';
import {client} from '../lib/contentful';
import { ProductoFields } from '../lib/contentful';
import ModalListas from './ModalListas';
import toast from 'react-hot-toast';
import { trackEvent } from '../lib/metaPixel';

interface ModalProductoProps {
  producto: ProductoFields;
  visible: boolean;
  onClose: () => void;
  onProductSaved: (productId: string) => void;
  onProductRemoved: (productId: string) => void;
  listButton: boolean;
}

function useImageCarousel(images: string[]) {
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setIdx(0);
  }, [images[0]]);

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

  return { idx, prev, next, onTouchStart, onTouchEnd };
}

const ModalProducto = ({ producto, visible, onClose, onProductSaved, onProductRemoved, listButton }: ModalProductoProps) => {
  const { user, URL } = useAuth();
  const [productoState, setProductoState] = useState(producto);
  const [imgClassName, setImgClassName] = useState("card_image_modal");
  const [buttonVisible, setButtonVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fecha, setFecha] = useState("");
  const { addToShoppingBag, discountedTotal } = useShoppingBag();
  const [modalListasVisible, setModalListasVisible] = useState(false);
  const [selectedProductoId, setSelectedProductoId] = useState<string | null>(null);
  const [savedProducts, setSavedProducts] = useState<string[]>([]);

  const images = [
    productoState.fields?.imagen?.fields.file.url,
    productoState.fields?.imagen2?.fields.file.url,
    productoState.fields?.imagen3?.fields.file.url,
  ].filter(Boolean) as string[];

  const { idx, prev, next, onTouchStart, onTouchEnd } = useImageCarousel(images);
  const multi = images.length > 1;

  useEffect(() => {
    if (visible) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [visible, producto]);

  async function getProductByID(id: string) {
    try {
      const entry = await client.getEntry<ProductoFields>(id);
      return entry as unknown as ProductoFields;
    } catch (err) {
      console.error("Error obteniendo producto:", err);
    }
  }

  useEffect(() => {
    if (producto.contentful_product_id) {
      getProductByID(producto.contentful_product_id).then((data) => {
        if (data) setProductoState(data);
      });
    } else {
      setProductoState(producto);
    }
  }, [producto]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setFecha(new Date().toLocaleString("es-ES"));
  }, [productoState]);

  const expandImage = () => {
    setImgClassName("ExpandProductImage");
    setButtonVisible(true);
  };
  const minimizeImage = (e: React.FormEvent) => {
    e.stopPropagation();
    setImgClassName("card_image_modal");
    setButtonVisible(false);
  };

  useEffect(() => {
    if (user) {
      const fetchSavedProducts = async () => {
        try {
          const res = await fetch(`${URL}/get_user_lists.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.internal_id }),
          });
          const data = await res.json();
          if (data.success) {
            const productosGuardados = data.listas?.map((item: { product_id: string }) => item.product_id);
            setSavedProducts(productosGuardados);
          }
        } catch (err) {
          console.error(err);
          toast.error("Error al obtener productos guardados");
        }
      };
      fetchSavedProducts();
    }
  }, [user]);

  const handleProductSaved = (productId: string) => {
    setSavedProducts(prev => {
      if (prev?.includes(productId)) return prev;
      return [...prev, productId];
    });
    onProductSaved(productId);
  };

  const handleProductRemoved = (productId: string) => {
    setSavedProducts(prev => prev.filter(id => id !== productId));
    onProductRemoved(productId);
  };

  const abrirModalListas = (productoId: string) => {
    setSelectedProductoId(productoId);
    setModalListasVisible(true);
  };

  const mensaje = "Hola! vengo de la pagina de Raqmar y me gustaría obtener más información sobre la venta al mayoreo.";
  const numero = "523327652904";

  if (!productoState?.fields) return null;

  const productoId = productoState.sys ? productoState.sys.id : productoState.contentful_product_id;

  return createPortal(
    <div
      className="ModalProducto_overlay"
      style={{ display: visible ? "block" : "none" }}
    >
      {visible && (
        <div
          className="ModalProducto_closer_overlay"
          onClick={(e) => {
            minimizeImage(e);
            onClose();
          }}
        />
      )}
      <div
        className="ModalProducto_container scroll-custom"
        style={imgClassName === "ExpandProductImage" ? { backgroundColor: "#222", overflow: "hidden" } : {}}
      >
        <Button type="closeButton" onClick={(e) => { minimizeImage(e); onClose(); }}>
          X
        </Button>

        {productoState.fields ? (
          <div className="card_modal">
            <div className="card_content_modal first" onClick={expandImage}>
              <div
                className={imgClassName}
                style={{ position: "relative", overflow: "hidden" }}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                {buttonVisible && (
                  <Button
                    type="backButton"
                    onClick={(e: React.FormEvent) => minimizeImage(e)}
                  >
                    <ArrowLeft size={25} color="black" style={{backgroundColor: "white", borderRadius: "50%"}} />
                  </Button>
                )}

                {images.map((url, i) => (
                  <Image
                    key={url}
                    src={`https:${url}`}
                    alt={`${productoState.fields?.nombre} ${i + 1}`}
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
                <div className="card-dots expanded">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`card-dot expanded${i === idx ? " active" : ""}`}
                    />
                  ))}
                </div>
              )}

              <div className="card_content_modal_inner_div">
                <h3>{productoState.fields?.nombre}</h3>
                <p className="card_modelo">{productoState.fields?.modelo}</p>
                <p className="card_precio_modal_antes">
                  {Number(productoState.fields?.precio).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </p>
                <p className="card_precio_modal">
                  {Number(productoState.fields?.precio * discountedTotal).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </p>
              </div>
            </div>

            <div className="card-content_modal second">
              <span>Descripcion</span>
              <p style={{ whiteSpace: "pre-line" }}>{productoState.fields?.descripcion}</p>
              {productoState.fields?.material?.length > 0 && (
                <>
                  <span>Material:</span>
                  <p>{productoState.fields?.material?.toUpperCase()}</p>
                </>
              )}
              <span>Temporada:</span>
              <p>{productoState.fields?.temporada?.toUpperCase()}</p>
              <p><b>Disponibles:</b> {productoState.fields?.cantidad}</p>
            </div>

            <div style={styles.buttonContainer}>
              <Button
                type="addButton"
                onClick={() =>{
                  addToShoppingBag({
                    user_id: user ? user.internal_id : 0,
                    contentful_product_id: productoState.sys
                      ? productoState.sys.id
                      : productoState.contentful_product_id,
                    image_URL: productoState.fields
                      ? productoState.fields.imagen?.fields.file.url
                      : productoState.image_URL,
                    modelo: productoState.fields
                      ? productoState.fields.modelo
                      : productoState.modelo,
                    nombreProducto: productoState.fields
                      ? productoState.fields.nombre
                      : productoState.nombre,
                    precio: productoState.fields
                      ? Number(productoState.fields.precio * discountedTotal)
                      : Number(productoState.precio * discountedTotal),
                    quantity: 1,
                    added_at: fecha,
                    disponible: productoState.fields ? productoState.fields.cantidad : 0,
                    estatus_pedido: '',
                    order_date: '',
                    cantidad: 0
                  });
                  trackEvent("AddToCart", {
                    content_name: productoState.fields?.nombre,
                    value: productoState.fields?.precio,
                  });
                }
                }
              >
                <ShoppingBag size={16} />+
              </Button>

              {listButton && (
                <Button type="addButton" onClick={() => {
                  abrirModalListas(productoId);
                  trackEvent("AddToList", {
                    content_name: productoState.fields?.nombre,
                    value: productoState.fields?.precio,
                  });
                  }}>
                  {savedProducts?.includes(productoId)
                    ? <FaHeart size={15} />
                    : <Heart size={15} />
                  }
                </Button>
              )}
            </div>

            <ModalListas
              visible={modalListasVisible}
              onClose={() => setModalListasVisible(false)}
              productoId={selectedProductoId}
              onProductSaved={handleProductSaved}
              onProductRemoved={handleProductRemoved}
            />
          </div>
        ) : (
          <div className="card_modal">No hay producto disponible</div>
        )}

         <div className='mensaje_mayoreo' style={{color:"#0b8783", textAlign:"center"}} >
          <p>Contamos tambien con opciones de ventas de mayoreo.</p>
          <p style={{marginTop:"-10px"}}>
            <a 
              href={`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`}
              target='_blank'         
              rel="noopener noreferrer"
              style={{textDecoration:"underline", cursor:"pointer"}}
            >Contactanos</a> para mas informacion.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalProducto;

const styles: { buttonContainer: React.CSSProperties } = {
  buttonContainer: {
    margin: "auto",
    marginTop: "20px",
    textAlign: "center",
  }
};