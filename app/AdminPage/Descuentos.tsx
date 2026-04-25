'use client';
import './adminPage.css';
import { useState, useEffect, use } from 'react';
import { useAuth } from '../Context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { useShoppingBag } from '../Context/ShoppingBagContext';

export default function Descuentos() {
    const { user, URL } = useAuth();
    const { setGlobalDiscount} = useShoppingBag();

    const [descuentoActual, setDescuentoActual] = useState(0);
    const [nuevoDescuento, setNuevoDescuento] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    if(!user || user.level !== 5) return null;

    useEffect(() => {
        
        const obtenerDescuento = async () => {
            
            try {
                const res = await fetch(`${URL}/obtener_descuento.php`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        descuento_name: "descuento_Global"
                    })
                });
                const data = await res.json();
                if (data.success) {
                    setDescuentoActual(data.descuento);
                }else{
                    console.log("Error obteniendo descuento:", data.message);
                }
            } catch (err) {
                console.error(err);
            }
        };

        obtenerDescuento();
    }, []);

    useEffect(() => {}, [descuentoActual]);

    const actualizarDescuento = async () => {
        if (!nuevoDescuento || !password) {
            alert("Completa todos los campos");
            return;
        }

        setLoading(true);

        try {
            // 1. validar contraseña
            const validar = await fetch(`${URL}/validar_raqmar.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: user.internal_id,
                    email: user.email,
                    password
                })
            });

            const validData = await validar.json();
            console.log("Respuesta validación:", validData);

            if (!validData.success) {
                alert("Contraseña incorrecta");
                setLoading(false);
                return;
            }

            // 2. actualizar descuento
            const update = await fetch(`${URL}/actualizar_descuento.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nuevo_descuento: Number(nuevoDescuento),
                    descuento_name: 'descuento_Global'
                })
            });

            const updateData = await update.json();

            if (updateData.success) {
                setDescuentoActual(Number(nuevoDescuento));
                setGlobalDiscount(Number(nuevoDescuento));
                setNuevoDescuento("");
                setPassword("");
                alert("Descuento actualizado");
            } else {
                alert("Error al actualizar");
            }

        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div className='DescuentosPage'>

            <h1 className='titulo'>Página de Descuentos</h1>

            {/* CARD DESCUENTO ACTUAL */}
            <div className='cardDescuento'>
                <h3>Descuento Actual</h3>
                <p className='valor'>{descuentoActual}%</p>
            </div>

            {/* FORMULARIO */}
            <div className='cardForm'>
                <h3>Actualizar Descuento</h3>

                <input
                    type="number"
                    placeholder="Nuevo descuento (%)"
                    value={nuevoDescuento}
                    onChange={(e) => setNuevoDescuento(e.target.value)}
                />

                <div className="passwordContainer">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <span 
                        className="eyeIcon"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </span>
                </div>

                <button onClick={actualizarDescuento} disabled={loading}>
                    {loading ? "Actualizando..." : "Guardar"}
                </button>
            </div>

        </div>
    );
}