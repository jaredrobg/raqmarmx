'use client';
import '../page.css';
import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import Image from 'next/image';
import { ChevronDown, ChevronUp, ArrowLeft, ChevronRight, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '../Elements/Elements';
import toast from 'react-hot-toast';
import { client, ProductoFields } from '../lib/contentful';
import { Entry } from "contentful";
import { useShoppingBag } from '../Context/ShoppingBagContext';
import ModalProducto from '../Components/ModalProducto';
import { useGlobal} from '../Context/GlobalContext';


export default function ListasPage(){
    const {user, URL} = useAuth();
    const {isMobile} = useGlobal();
    const [listas, setListas] = useState<string[]>(["Favoritos"]);
    const [visible, setVisible] = useState(false);
    const [selectedList, setSelectedList] = useState<string | null>(null);
    


    useEffect(()=>{
        const obtenerListas = async ()=>{
            if(!user) return;
            try{
                const res = await fetch(`${URL}/get_user_lists.php`, {
                    method: 'POST',
                    headers:{ 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        user_id: user.internal_id
                    })
                });
                const data = await res.json();
                if(data.success){
                     const listasUsuario: string[] = [...new Set(
                        ((data.listas as { list_name: string }[]) || []).map((item) => item.list_name)
                    )];
                    if (!listasUsuario.includes("Favoritos")) {
                        listasUsuario.unshift("Favoritos");
                    }
                    setListas(listasUsuario);
                }
            }catch(err){
                console.error(err);
                toast.error("Error al obtener las listas");
            }
        }
        obtenerListas();
    },[user]);

    const handleListaClick = (lista: string)=>{
        setSelectedList(lista);
        setVisible(true);
    };



    return(
        <div className='listasPageContainer'>
            <div className='listasPage' style={{display: !visible ? "block" : "none"}}>
                <h3>Mis Listas</h3>

                <div className='listas_container' >
                    {listas.length === 0 ? (
                        <p>No tienes listas guardadas.</p>
                    ) : (
                        listas.map((lista, index) => (
                            <div key={index} className='lista_item' onClick={()=>handleListaClick(lista)}>
                                <h4>{lista}</h4>
                                <ChevronRight className='icon' size={25} />
                            </div>
                        ))
                    )}
                </div>
            </div>
            <SelectedListComponent
                visible={visible}
                onClose={()=>setVisible(false)}
                listName={selectedList || ""}
            />
        </div>
    )
}

interface Props {
    visible: boolean;
    onClose: () => void;
    listName: string;
}
interface ListItem {
    product_id: string;
}

interface GetListsResponse {
    success: boolean;
    listas?: ListItem[];
}


export function SelectedListComponent({visible, onClose, listName}:Props){
    const [productos, setProductos] = useState<Entry<ProductoFields>[]>([]);
    const {user, URL} = useAuth();
    const [loading, setLoading] = useState(false);
    const {addToShoppingBag, discountedTotal} = useShoppingBag();
    const [producto, setProducto] = useState<ProductoFields>({} as ProductoFields);
    const [modalVisible, setModalVisible] = useState(false);
    const [fecha, setFecha] = useState("");
    const [isMobile, setIsMobile] = useState(false);


    //verificacion de movil
    useEffect(()=>{
        const handleResize = ()=>{
            setIsMobile(window.innerWidth < 768);
        }
        handleResize();
        window.addEventListener("resize", handleResize);

        return ()=> window.removeEventListener("resize", handleResize);
    },[]);


    useEffect(()=>{
        setFecha(new Date().toLocaleString('es-ES'));
    },[]);

   

    useEffect(() => {
        setLoading(true);
        const obtenerProductos = async () => {
            if (!user || !listName) {
                setLoading(false);
                return;
            }

            try {
                // 🔹 1. Traer IDs desde tu backend
                const res = await fetch(`${URL}/get_user_lists.php`, {
                    method: 'POST',
                    headers:{ 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        user_id: user.internal_id,
                        list_name: listName
                    })
                });

                const data: GetListsResponse = await res.json();
                setLoading(false);


                if (!data.success) return;

                const ids: string[] = [...new Set(
                    (data.listas || []).map((item: { product_id: string }) => item.product_id)
                )];

                if (ids.length === 0) {
                    setProductos([]);

                    return;
                }

                // 🔹 2. Traer TODOS los productos de contentful
                const entries = await client.getEntries<ProductoFields>({
                    content_type: 'producto',
                    'sys.id[in]': ids.join(',')
                });

                // 🔹 3. Filtrar solo los que están en la lista
                const filtrados = entries.items.filter(item =>
                    ids.includes(item.sys.id)
                );

                setProductos(filtrados);

            } catch (err) {
                console.error(err);
                toast.error("Error al obtener productos");
                setLoading(false);

            }
            setLoading(false);
        };

        obtenerProductos();
    }, [user, listName, visible]);

    const handleProductSaved = ()=>{};
    const handleProductRemoved = ()=>{};

    const handleDeleteClick = (product_id: string, type: "producto" | "lista") => {
        if (!user) return;

        toast((t) => (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {type === "producto" ? (
                    <span>¿Eliminar este producto de la lista?</span>
                ) : (
                    <span>¿Eliminar esta lista?</span>
                )}

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                        }}
                        style={{
                            padding: "5px 10px",
                            background: "#ccc",
                            borderRadius: "5px",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);

                            // 🔥 AQUÍ haces el delete
                            if (type === "producto") {
                                await eliminarProducto(product_id);
                                toast.success("Producto eliminado");
                            } else {
                                await eliminarLista();
                            }
                        }}
                        style={{
                            padding: "5px 10px",
                            background: "#e53935",
                            color: "#fff",
                            borderRadius: "5px",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        ), {
            duration: 6000
        });
    };
    
    const eliminarProducto = async (product_id: string) => {
        try {
            const res = await fetch(`${URL}/remove_list_product.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user?.internal_id,
                    list_name: listName,
                    product_id
                })
            });

            const data = await res.json();

            if (data.success) {
                // quitarlo del estado (UX instantáneo)
                setProductos(prev => prev.filter(p => p.sys.id !== product_id));
            }
        } catch (err) {
            console.error(err);
            toast.error("Error al eliminar");
        }
    };

    const eliminarLista = async ()=>{
        try {
            const res = await fetch(`${URL}/remove_list_product.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user?.internal_id,
                    list_name: listName
                })
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Lista eliminada");
                setProductos([]);
                onClose();
            }
        } catch (err) {
            console.error(err);
            toast.error("Error al eliminar");
        }
    };


    return(
        <div className='listasPage' style={{display: visible ? "block" : "none"}}>
            <Button type='backButton' style={{color:"#666", top:"10px"}} onClick={()=>{setProductos([]); onClose(); }}>
                <ArrowLeft />
            </Button>
            <h3>{listName}</h3>

            <div className='lista_productos_container' >
                {loading && <p>Cargando productos...</p>}
                {productos.length === 0 && !loading ? (
                    <p>No tienes productos guardados.</p>
                ) : (
                    productos.map((producto, index) => (
                        <div key={producto.sys.id} className="card" >
                    <div className="card-image" onClick={()=>{ setProducto({...producto.fields, contentful_product_id: producto.sys.id}); setModalVisible(true);}}>
                        <Image 
                            src={`https:${producto.fields.imagen?.fields.file.url}`}
                            alt={producto.fields.nombre}
                            fill
                            sizes='max-width: 100%; height: auto;'
                            style={{objectFit: "cover", borderRadius:"7px"}}
                        />
                    </div>    
                    <div className="card-content">
                        <h3>{producto.fields.nombre}</h3>
                        <p className="card_nombre">{producto.fields.modelo}</p>
                        <p className="card_precio_antes">{Number(producto.fields.precio).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                        <p className="card_precio">{Number((producto.fields.precio) * discountedTotal).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                        <Button type='addButton' 
                            onClick={()=>addToShoppingBag({
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
                            })} 
                        ><ShoppingBag size={isMobile ? 9 : 15} />+</Button>
                        <Button type='addButton' style={{backgroundColor:"#d71616"}} 
                            onClick={()=>handleDeleteClick(producto.sys.id, "producto")}
                        ><Trash2 size={isMobile ? 12 : 20} /></Button>
                    </div>
                </div>
                    ))
                )}
           
            </div>

            <div  style={{display:"flex", justifyContent:"center", marginTop: isMobile?"30px":"80px"}}>
                <p style={{color:"#ef1a1a"}} onClick={()=>handleDeleteClick("", "lista")}>
                    Eliminar Lista?
                </p>
            </div>

            

            <ModalProducto 
                visible={modalVisible} 
                onClose={()=>setModalVisible(false)} 
                producto={producto} 
                onProductSaved={handleProductSaved}
                onProductRemoved={handleProductRemoved}
                listButton={false}
            />
        </div>
    )
}