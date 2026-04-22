'use client';
import '../page.css';
import Image from "next/image";
import { Button } from '../Elements/Elements';
import { useState, useEffect, use } from 'react';
import { ArrowLeft } from 'lucide-react';
import { createPortal } from 'react-dom';
import { ShoppingBag } from 'lucide-react';
import { useShoppingBag } from '../Context/ShoppingBagContext';
import { useAuth } from '../Context/AuthContext';
import {client} from '../lib/contentful';
import { ProductoFields } from '../lib/contentful';
import{ Producto } from '../Elements/interface';

interface ModalProductoProps {
  producto: ProductoFields;
  visible: boolean;
  onClose: () => void;
}

const ModalProducto = ({ producto, visible, onClose }: ModalProductoProps) => {
  const { user } = useAuth();
  const [productoState, setProductoState] = useState(producto); // ✅ estado local
  const [imgClassName, setImgClassName] = useState("card_image_modal");
  const [buttonVisible, setButtonVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fecha, setFecha] = useState("");
  const { addToShoppingBag, discountedTotal } = useShoppingBag();

  useEffect(() => {
    if(visible){
      // console.log("Producto recibido en modal: ", producto);
      document.body.classList.add("no-scroll");
    }
    if(!visible){
      document.body.classList.remove("no-scroll");
    }

  }, [visible, producto]);

  // Traer producto desde Contentful
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
        if (data) setProductoState(data); // ✅ usar setState
      });
    } else {
      setProductoState(producto); // fallback
    }
  }, [producto]); // 👈 se vuelve a ejecutar si cambia "producto"

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // console.log("Producto en modal actualizado: ", productoState);
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

  if (!productoState?.fields) return null;

  return createPortal(
    <div
      className="ModalProducto_overlay"
      style={{ display: visible ? "block" : "none" }}
    >
      {visible && (
        <div className="ModalProducto_closer_overlay" onClick={onClose}></div>
      )}
      <div
        className="ModalProducto_container scroll-custom"
        style={imgClassName === "ExpandProductImage" ? { backgroundColor: "#222" } : {}}
      >
        <Button type="closeButton" onClick={onClose}>
          X
        </Button>
        {(productoState.fields) ? (
          <div className="card_modal">
            <div className="card_content_modal first" onClick={expandImage}>
              <div className={imgClassName}>
                {buttonVisible && (
                  <Button
                    type="backButton"
                    onClick={(e: React.FormEvent) => minimizeImage(e)}
                  >
                    <ArrowLeft size={30} />
                  </Button>
                )}
                <Image
                  src={`https:${productoState.fields?.imagen?.fields.file.url}`}
                  alt={productoState.fields?.nombre}
                  fill
                  sizes='max-width: 100%; height: auto;'
                  style={{ objectFit: "cover", borderRadius: "7px" }}
                />
              </div>
              <div className="card_content_modal_inner_div">
                <h3>{productoState.fields?.nombre}</h3>
                <p className="card_modelo">
                  {productoState.fields?.modelo}
                </p>
                <p className="card_precio_modal_antes">
                  {Number(productoState.fields?.precio).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </p>
                <p className="card_precio_modal">
                  {Number((productoState.fields?.precio)* discountedTotal).toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </p>
              </div>
            </div>
            <div className="card-content_modal second">
              <span>Descripcion</span>
              <p style={{ whiteSpace: "pre-line" }}>{productoState.fields?.descripcion}</p>
              <span>Material:</span>
              <p>
                {productoState.fields?.material?.toUpperCase()}
              </p>
              <span>Temporada:</span>
              <p>
                {productoState.fields?.temporada?.toUpperCase()}
              </p>
              <p>
                <b>Disponibles:</b> {productoState.fields?.cantidad}
              </p>
            </div>
            <Button
              type="addButton"
              onClick={() =>
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
                })
              }
              style={{
                margin: "auto",
                marginTop: "-40px",
                transform: "translateX(-50%)",
                position: isMobile ? "absolute" : "static",
                left: "50%",
              }}
            >
              <ShoppingBag size={16} />+
            </Button>
          </div>
        ) : (
          <div className="card_modal">No hay producto disponible</div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ModalProducto;




// const ModalProducto = ({producto, visible, onClose}: any)=>{
//     const {user} = useAuth();
//     const [imgClassName, setImgClassName] = useState("card_image_modal");
//     const [buttonVisible, setButtonVisible] = useState(false);
//     const [isMobile, setIsMobile] = useState(false);
//     const [fecha, setFecha] = useState("");
//     const {addToShoppingBag} = useShoppingBag();

   

//     //Para traer el producto especifico desde contentful
    
//     async function getProductByID(id: string) {
//         try {
//             const entry = await client.getEntry(id);
//             return entry;
//         } catch (err) {
//             console.error('Error obteniendo producto:', err);
//         }
//     }

//     useEffect(()=>{
//         if(producto.contentful_product_id){
//             getProductByID(producto.contentful_product_id).then((data)=>{
//                 producto = data;
//             });
//         }
//     },[])

    

//     useEffect(()=>{
//         const handleResize = ()=>{
//             setIsMobile(window.innerWidth < 768);
//         }
//         handleResize();
//         window.addEventListener("resize", handleResize);

//         return ()=> window.removeEventListener("resize", handleResize);
//     },[]);

//     useEffect(()=>{
//         console.log("Producto en modal: ");
//         console.log(producto);

//         setFecha(new Date().toLocaleString('es-ES'));
//     },[producto]);

    
    


//     const expandImage = ()=>{
//         setImgClassName("ExpandProductImage");
//         setButtonVisible(true);
//     }
//     const minimizeImage = (e:any)=>{
//         e.stopPropagation();
//         setImgClassName("card_image_modal");
//         setButtonVisible(false);
//     }

//     if(!producto.fields) return null;

//     return createPortal(
//         <div className='ModalProducto_overlay' style={{display: visible? 'block': 'none'}} >
//             {visible && <div className="ModalProducto_closer_overlay" onClick={onClose}></div>}
//             <div className='ModalProducto_container' style={imgClassName==="ExpandProductImage"?{backgroundColor:"#222"}:{}}>
//                 <Button type='closeButton' onClick={onClose}>X</Button>
//                 {(producto.fields || producto.image_URL) ?
//                 <div className='card_modal'>
//                     <div className='card_content_modal first' onClick={expandImage}>
//                         <div className={imgClassName}>
//                         {buttonVisible && <Button type='backButton' onClick={(e:any)=>minimizeImage(e)}><ArrowLeft size={30}/></Button>}
//                             <Image 
//                                 src={`https:${producto.fields?.imagen?.fields.file.url || producto.image_URL}`}
//                                 alt={producto.fields?.nombre || producto.nombre}
//                                 fill
//                                 style={{objectFit: "cover", borderRadius:"7px"}}
//                             />
//                         </div>
//                         <div className='card_content_modal_inner_div'>
//                             <h3>{producto.fields?.nombre || producto.nombre}</h3>
//                             <p className="card_modelo">{producto.fields?.modelo || producto.modelo}</p>
//                             <p className="card_precio_modal">
//                                 {Number(producto.fields?.precio || producto.precio).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="card-content_modal second">
//                         <span>Descripcion</span>
//                         <p>{producto.fields?.descripcion|| producto.descripcion}</p>
//                         <span>Material:</span>
//                         <p>{producto.fields?.material?.toUpperCase() || producto.material?.toUpperCase()}</p>
//                         <span>Temporada:</span>
//                         <p>{producto.fields?.temporada?.toUpperCase()|| producto.temporada?.toUpperCase()}</p>
//                         <p><b>Disponibles:</b> {producto.fields?.cantidad}</p>
//                     </div>
//                      <Button type='addButton' 
//                         onClick={()=>addToShoppingBag({
//                             user_id: user?.internal_id,
//                             contentful_product_id: producto.sys? producto.sys.id : producto.contentful_product_id,
//                             image_URL: producto.fields? producto.fields.imagen?.fields.file.url : producto.image_URL,
//                             modelo: producto.fields? producto.fields.modelo : producto.modelo,
//                             nombreProducto: producto.fields? producto.fields.nombre : producto.nombre,
//                             precio: producto.fields? producto.fields.precio : producto.precio,  
//                             quantity: 1,
//                             added_at: fecha,
//                             disponible:producto.fields?.cantidad
//                         })}
//                         style={{
//                             margin:"auto", 
//                             marginTop:"-40px", 
//                             transform: "translateX(-50%)",
//                             position: isMobile? "absolute": '',
//                             left: "50%",
//                         }} 
//                     ><ShoppingBag size={16} />+</Button>
//                 </div>
//                 :
//                 <div className='card_modal'>No hay priducto disponible</div>
//                 }
//             </div>
//         </div>,
//         document.body
//     );
// }

// export default ModalProducto;

//Aqui estamos en el que funcionaba