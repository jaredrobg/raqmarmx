'use client';
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { Button } from "../Elements/Elements";
import { LoginPage, SignupPage } from '../Profile/page';
import toast from 'react-hot-toast';


interface Props {
    visible: boolean;
    onClose: () => void;
    productoId: string | null;
    onProductSaved: (productId: string) => void;
    onProductRemoved: (productId: string) => void;
}

export default function ModalListas({ visible, onClose, productoId, onProductSaved, onProductRemoved }: Props) {
    const { user, URL } = useAuth();

    const [listas, setListas] = useState<string[]>(["Favoritos"]);
    const [selectedList, setSelectedList] = useState<string | null>(null);
    const [nuevaLista, setNuevaLista] = useState("");
    const [crearModo, setCrearModo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [savedProducts, setSavedProducts] = useState<string[]>([]);

    const [loginVisible, setLoginVisible] = useState(false);
    const [signupVisible, setSignupVisible] = useState(false);

    // Obtener listas
    useEffect(() => {
        if (!user || !visible) return;

        const fetchListas = async () => {
            try {
                const res = await fetch(`${URL}/get_user_lists.php`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: user.internal_id })
                });

                const data = await res.json();
                
                if (data.success) {
                    // Asegurar favoritos siempre
                    const listasUsuario: string[] = [...new Set(
                        ((data.listas as { list_name: string }[]) || []).map((item) => item.list_name)
                    )];
                    if (!listasUsuario.includes("Favoritos")) {
                        listasUsuario.unshift("Favoritos");
                    }
                    setListas(listasUsuario);
                    const producosGuardados: string[] = [...new Set(
                        ((data.listas as { product_id: string }[]) || []).map((item) => item.product_id)
                    )];
                    setSavedProducts(producosGuardados);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchListas();
    }, [user, visible]);

    // Crear nueva lista
    const crearLista = async () => {
        if (!nuevaLista.trim() || !productoId) return;

        setLoading(true);

        try {

            // Agregar producto a esa lista
            const resProducto = await fetch(`${URL}/add_list_product.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user?.internal_id,
                    list_name: nuevaLista,
                    product_id: productoId
                })
            });

            const dataProducto = await resProducto.json();

            if (dataProducto.success) {
                toast.success(`Guardado en "${nuevaLista}"`);
                setNuevaLista("");
                setCrearModo(false);
                onProductSaved(productoId);
                onClose();
            }

        } catch (err) {
            console.error(err);
            toast.error("Error al crear la lista");
        }

        setLoading(false);
    };

    // Agregar producto a lista
    const agregarProducto = async () => {
        if (!selectedList || !productoId) return;

        try {
            const res = await fetch(`${URL}/add_list_product.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user?.internal_id,
                    list_name: selectedList,
                    product_id: productoId
                })
            });

            const data = await res.json();
            if (data.success) {
                onProductSaved(productoId);
                onClose();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const eliminarProducto = async () =>{
        if (!productoId) return;
        try{
            const res = await fetch(`${URL}/remove_list_product.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user?.internal_id,
                    product_id: productoId
                })
            });
            
            const data = await res.json();
            if (data.success){
                setSavedProducts(prev => prev.filter(id => id !== productoId));
                onProductRemoved(productoId); // Para actualizar el estado en Productos
                toast.success("Producto eliminado de guardados");
                onClose();
            }
            else{
                console.error("Error al eliminar producto de guardados:", data.message);
                toast.error("Error al eliminar producto de guardados");
            }

        } catch (err){
            console.error(err);
            toast.error("Error al eliminar producto de guardados");
        }
    }

    if (!visible) return null;

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>

                {/* NO LOGUEADO */}
                {!user && (
                    <div style={{ textAlign: "center" }}>
                        <div style={{display: loginVisible ? 'none' : signupVisible? 'none' : 'block'}}>
                            <h3>Inicia sesión</h3>
                            {/* Aquí metes tu componente de login */}
                            {/* Ejemplo: */}
                            <p>Para guardar un producto debes iniciar sesión o registrarte</p>
                            <Button type='primary' onClick={() => setLoginVisible(true)}>
                                Iniciar sesión
                            </Button>
                            <Button type='secondary' onClick={() => setSignupVisible(true)}>
                                Registrarse
                            </Button>
                        </div>

                        <SignupPage visible={signupVisible} setVisible={setSignupVisible} />
                        <LoginPage visible={loginVisible} setVisible={setLoginVisible} setSignupVisible={setSignupVisible} />
                    </div>
                )}

                {/* LOGUEADO */}
                {user && (
                    <>
                        <h3 className="modalTitle">Selecciona una lista</h3>

                        {!crearModo && (
                            <>
                                <div>
                                    {listas.map((lista) => (
                                       <div
                                            key={lista}
                                            onClick={() => setSelectedList(lista)}
                                            className={`listaItem ${selectedList === lista ? "active" : ""}`}
                                        >
                                            {lista}
                                        </div>
                                    ))}
                                </div>

                                <div className="modalActions">
                                    <Button type='secondary' onClick={() => {setCrearModo(true); setNuevaLista("");}}>
                                        + Crear lista
                                    </Button>

                                    <Button
                                        type='primary'
                                        onClick={agregarProducto}
                                        disabled={!selectedList}
                                    >
                                        Aceptar
                                    </Button>
                                </div>
                            </>
                        )}

                        {/* 🆕 CREAR LISTA */}
                        {crearModo && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Nombre de la lista"
                                    value={nuevaLista}
                                    onChange={(e) => setNuevaLista(e.target.value)}
                                    className="inputLista"
                                />

                                <Button type='primary' onClick={crearLista} disabled={loading}>
                                    Crear y guardar
                                </Button>

                                <Button type='red' onClick={() => setCrearModo(false)}>
                                    Cancelar
                                </Button>
                            </>
                        )}
                    </>
                )}

                {productoId && savedProducts.includes(productoId)&&(
                    <p style={{color:'#e11c1c', cursor: 'pointer', fontSize:"14px"}} onClick={eliminarProducto} >
                        Eliminar Producto de Guardados
                    </p>
                )}

                <Button type='red' onClick={onClose}>
                    Cerrar
                </Button>
            </div>
        </div>
    );
}