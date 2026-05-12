'use client';
import './ventasLocalesPage.css';

import { useEffect, useState } from 'react';
import { client } from '../lib/contentful';
import { useAuth } from '../Context/AuthContext';
import Swal from 'sweetalert2';

type Producto = {
    modelo: string;
    nombre: string;
    marca: string;
    cantidad: number;
    precio: number;
    sys: {
        id: string;
    };
};

const VentasLocalesPage = () => {

    const { user, URL } = useAuth();

    const [productos, setProductos] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerProductos();
    }, [user]);

    const obtenerProductos = async () => {
        try {

            const res = await client.getEntries({
                content_type: "producto",
                limit: 1000
            });

            let items = res.items.map((item: any) => ({
                ...item.fields,
                sys: item.sys
            }));

            items = items.sort((a: any, b: any) =>
                (a.modelo || "").localeCompare(
                    b.modelo || "",
                    'es',
                    { numeric: true }
                )
            );

            setProductos(items);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const productosFiltrados = productos.filter((p) => {

        const texto = busqueda.toLowerCase();

        return (
            (p.modelo || '').toLowerCase().includes(texto) ||
            (p.nombre || '').toLowerCase().includes(texto) ||
            (p.marca || '').toLowerCase().includes(texto)
        );
    });

    const marcarVenta = async (p: Producto) => {

        const result = await Swal.fire({
            title: '¿Confirmar venta?',
            text: p.modelo,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {

            // actualizar stock
            await fetch('/api/actualizar_stock_VL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    entryId: p.sys.id,
                    cantidad: p.cantidad - 1
                })
            });

            // registrar venta
            await fetch(`${URL}/registrar_venta_local.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user?.internal_id,
                    contentful_product_id: p.sys.id,
                    nombre_producto: p.nombre,
                    modelo: p.modelo,
                    precio: p.precio,
                    quantity: 1
                })
            });

            // actualizar UI
            setProductos(prev =>
                prev.map(item =>
                    item.sys.id === p.sys.id
                        ? { ...item, cantidad: item.cantidad - 1 }
                        : item
                )
            );

            Swal.fire({
                title: 'Venta realizada',
                icon: 'success'
            });

        } catch (err) {

            console.error(err);

            Swal.fire({
                title: 'Error',
                text: 'No se pudo registrar la venta',
                icon: 'error'
            });
        }
    };

    const marcarDevolucion = async (p: Producto) => {

        const result = await Swal.fire({
            title: '¿Aplicar devolución?',
            text: p.modelo,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {

            const res = await fetch(`${URL}/aplicar_devolucion_local.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contentful_product_id: p.sys.id
                })
            });

            const data = await res.json();
            // const data = await res.text();
            console.log("Respuesta de devolucion: ", data);

            if (!data.success) {

                Swal.fire({
                    title: 'Error',
                    text: 'No hay compras registradas para este producto',
                    icon: 'error'
                });

                return;
            }

            // regresar stock
            await fetch('/api/actualizar_stock_VL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    entryId: p.sys.id,
                    cantidad: p.cantidad + 1
                })
            });

            // actualizar UI
            setProductos(prev =>
                prev.map(item =>
                    item.sys.id === p.sys.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            );

            Swal.fire({
                title: 'Devolución aplicada correctamente',
                icon: 'success'
            });

        } catch (err) {

            console.error(err);

            Swal.fire({
                title: 'Error',
                text: 'No se pudo aplicar devolución',
                icon: 'error'
            });
        }
    };

    if (loading) {
        return (
            <div className="loadingContainer">
                Cargando...
            </div>
        );
    }

    if (!user){
        return(
            <div>

                Error!
                Usuario sin Login, favor de contactar a Gerente.
            </div>
        )
    }   

    return (
        <div className="VentasLocalesPage">

            <h1 className="ventasTitle">
                Ventas Locales
            </h1>

            <div className="buscadorContainer">
                <input
                    type="text"
                    placeholder="Buscar por modelo, nombre o marca..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="inputBuscador"
                />
            </div>

            {productosFiltrados.length === 0 ? (
                <div className="noResultados">
                    No se encontró ningún resultado según la búsqueda.
                </div>
            ) : (

                <div className="VentasLocalesTable">

                    <div className="columna">MODELO</div>
                    <div className="columna">DESCRIPCIÓN</div>
                    <div className="columna">MARCA</div>
                    <div className="columna">CANTIDAD</div>
                    <div className="columna">PRECIO</div>
                    <div className="columna">ACCIONES</div>

                    {productosFiltrados.map((p, i) => (

                        <div key={i} style={{ display: 'contents' }}>

                            <div className="celda">{p.modelo}</div>

                            <div className="celda">{p.nombre}</div>

                            <div className="celda">{p.marca}</div>

                            <div className="celda">
                                {p.cantidad}
                            </div>

                            <div className="celda">
                                {Number(p.precio).toLocaleString('es-MX', {
                                    style: 'currency',
                                    currency: 'MXN'
                                })}
                            </div>

                            <div className="celda">

                                <div className="accionesCell">

                                    <button
                                        className="btnVenta"
                                        disabled={p.cantidad <= 0}
                                        onClick={() => marcarVenta(p)}
                                    >
                                        Marcar Venta
                                    </button>

                                    <button
                                        className="btnDevolucion"
                                        onClick={() => marcarDevolucion(p)}
                                    >
                                        Marcar Devolución
                                    </button>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
};

export default VentasLocalesPage;