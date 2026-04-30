'use client';
import '../page.css';
import { useState, useEffect } from 'react';
import { client } from '../lib/contentful'; // ajusta ruta si cambia
import {ArrowLeft, ArrowUpRightFromSquare, Loader2Icon, Edit3 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuth } from '../Context/AuthContext';
import toast from 'react-hot-toast';
import { Button } from '../Elements/Elements';

const Inventario = () => {
    const [marcas, setMarcas] = useState<string[]>([]);
    const [soloConExistencia, setSoloConExistencia] = useState(false);
    const [vistaSeleccionada, setVistaSeleccionada] = useState<string | null>(null);
    const [productos, setProductos] = useState<any[]>([]);
    const [exportando, setExportando] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [productoEditar, setProductoEditar] = useState<any | null>(null);
    const [nuevaCantidad, setNuevaCantidad] = useState<number>(0);
    const [updateCantSuccess, setUpdateCantSuccess] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const { user } = useAuth();


    // 🔹 Obtener marcas
    useEffect(() => {
        async function getMarcas() {
            try {
                const res = await client.getEntries({
                    content_type: "producto",
                    select: ["fields.marca"],
                    limit: 1000
                });

                const marcasUnicas = Array.from(
                    new Set(
                        res.items
                            .map((item: any) => item.fields.marca)
                            .filter(Boolean)
                    )
                );

                setMarcas(marcasUnicas.sort());
            } catch (err) {
                console.error("Error obteniendo marcas:", err);
            }
        }

        getMarcas();
    }, []);

    // 🔹 Obtener productos según filtro
    useEffect(() => {
        if (!vistaSeleccionada) return;

        async function getProductos() {
            const res = await client.getEntries({
                content_type: "producto",
                limit: 1000
            });

            let items = res.items.map((item: any) => item);

            if (vistaSeleccionada !== 'GENERAL') {
                items = items.filter(p => p.fields.marca === vistaSeleccionada);
            }

            if (soloConExistencia) {
                items = items.filter(p => p.fields.cantidad > 0);
            }

            items = items.sort((a, b) =>
                (a.modelo || "").localeCompare(b.modelo || "", 'es', { numeric: true })
            );


            setProductos(items);
        }

        getProductos();
    }, [vistaSeleccionada, soloConExistencia, updateCantSuccess]);

    const handleExport = async () => {
        if (exportando) return;

        setExportando(true);

        try {
            exportToExcel(
                productos,
                vistaSeleccionada === 'GENERAL'
                    ? 'Inventario_General'
                    : `Inventario_${vistaSeleccionada}`
            );
        } catch (err) {
            console.error(err);
        } finally {
            setExportando(false);
        }
    };

    const handleExportAll = async () => {
        if (exportando) return;

        setExportando(true);

        try {
            const res = await client.getEntries({
                content_type: "producto",
                limit: 1000
            });

            const items = res.items.map((item: any) => item.fields);

            exportToExcel(items, 'Inventario_Completo');
        } catch (err) {
            console.error(err);
        } finally {
            setExportando(false);
        }
    };

    const exportToExcel = (data: any[], nombreArchivo: string) => {
        if (!data || data.length === 0) return;

        // Formatear datos
        const datosFormateados = data.map((p) => ({
            Modelo: p.fields.modelo,
            Descripción: p.fields.nombre,
            Marca: p.fields.marca,
            Cantidad: p.fields.cantidad,
            Precio: p.fields.precio,
        }));

        // Crear hoja
        const worksheet = XLSX.utils.json_to_sheet(datosFormateados);

        worksheet["!cols"] = [
            { wch: 15 },
            { wch: 30 },
            { wch: 20 },
            { wch: 10 },
            { wch: 12 },
        ];

        // Crear libro
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
        XLSX.utils.sheet_add_aoa(worksheet, [
            ["MODELO", "DESCRIPCIÓN", "MARCA", "CANTIDAD", "PRECIO"]
        ], { origin: "A1" });

        

        // Descargar
        XLSX.writeFile(workbook, `${nombreArchivo}.xlsx`);
    };



    // 🔹 VISTA CARDS
    if (!vistaSeleccionada) {
        return (
            <div>

                <div className="cardsContainer">

                    {marcas.map((marca) => (
                        <div
                            key={marca}
                            className="cardAdmin"
                            onClick={() => setVistaSeleccionada(marca)}
                        >
                            <h3>{marca}</h3>
                        </div>
                    ))}
                </div>
                <div className="inventarioBottomActions">

                    <div 
                        className="cardAdmin generalCard"
                        onClick={() => setVistaSeleccionada('GENERAL')}
                    >
                        <h3>Inventario General</h3>
                    </div>

                     

                    <div 
                        className={`cardAdmin exportCard ${exportando ? 'loading' : ''}`}
                        onClick={handleExportAll}
                    >
                        <div className="icono">
                            {exportando ? (
                                <Loader2Icon className="spinner" />
                            ) : (
                                <ArrowUpRightFromSquare />
                            )}
                        </div>

                        <h3>
                            {exportando ? 'Exportando...' : 'Exportar Excel'}
                        </h3>
                    </div>
                </div>
            </div>
        );
    }


    const productosFiltrados = productos.filter((p) => {
        const texto = busqueda.toLowerCase();

        return (
            (p.fields.modelo || '').toLowerCase().includes(texto) ||
            (p.fields.nombre || '').toLowerCase().includes(texto) ||
            (p.fields.marca || '').toLowerCase().includes(texto)
        );
    });

    // 🔹 VISTA TABLA
    return (
        <div className="InventarioTabla">

            <div style={{display:'flex', justifyContent:'center', margin:'10px 20px', marginTop:"50px"}}>
                <button
                    className={soloConExistencia ? 'toggle active' : 'toggle'}
                    onClick={() => setSoloConExistencia(!soloConExistencia)}
                >
                    Mostrar solo productos con existencia
                </button>
            </div>

            <div className="tablaHeader">
                <button 
                    className="btnHeader btnBack"
                    onClick={() => setVistaSeleccionada(null)}
                >
                    <ArrowLeft size={18} />
                    Volver
                </button>

                <h2 className="tituloTabla">
                    {vistaSeleccionada === 'GENERAL'
                        ? 'Inventario General'
                        : vistaSeleccionada}
                </h2>

                

                <button 
                    className={`btnHeader btnExport ${exportando ? 'loading' : ''}`}
                    onClick={handleExport}
                    disabled={exportando}
                >
                    {exportando ? (
                        <>
                            <span className="spinner"></span>
                            Exportando...
                        </>
                    ) : (
                        <>
                            Exportar {vistaSeleccionada}
                            <ArrowUpRightFromSquare size={18} />
                        </>
                    )}
                    
                </button>
                
            </div>

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
                <div className="InventarioList">
                    {/* columnas */}

                    {productosFiltrados.map((p, i) => (
                        <div key={i} style={{ display: 'contents' }}>
                            <div className="celda">{p.fields.modelo}</div>
                            <div className="celda">{p.fields.nombre}</div>
                            <div className="celda">{p.fields.marca}</div>

                            {/* 👇 aquí cambiaremos cantidad */}
                            <div className="celda cantidadCelda">
                                {p.fields.cantidad}

                                {user?.level === 5 && (
                                    <div className='editCantidadBtn'
                                        onClick={() => {
                                            setProductoEditar(p);
                                            console.log("Producto a editar:", p);
                                            setNuevaCantidad(p.fields.cantidad);
                                        }}
                                    >
                                        <Edit3 size={16} />
                                    </div >
                                )}
                            </div>

                            <div className="celda">
                                {Number(p.fields.precio).toLocaleString('es-MX', {
                                    style: 'currency',
                                    currency: 'MXN'
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {productoEditar && (
                <div className="modalOverlay" onClick={() => setProductoEditar(null)}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        
                        <h3>Actualizar cantidad</h3>

                        <p><b>{productoEditar.modelo}</b></p>

                        <input
                            type="number"
                            value={nuevaCantidad}
                            onChange={(e) => setNuevaCantidad(Number(e.target.value))}
                            className="inputCantidad"
                        />

                        <div className="modalActions">
                            <button
                                className="btnCancel"
                                onClick={() => setProductoEditar(null)}
                            >
                                Cancelar
                            </button>

                            <button
                                className="btnConfirm"
                                onClick={async () => {
                                    if (guardando) return;

                                    // 👉 confirmación con toast
                                    toast((t) => (
                                        <div>
                                            <p>¿Actualizar cantidad a "{nuevaCantidad}"?</p>

                                            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                                                <button
                                                    onClick={async () => {
                                                        toast.dismiss(t.id);
                                                        setGuardando(true);

                                                        try {
                                                            const res = await fetch('/api/actualizar_stock', {
                                                                method: 'POST',
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({
                                                                    entryId: productoEditar.sys.id,
                                                                    cantidad: nuevaCantidad
                                                                })
                                                            });

                                                            const data = await res.json();

                                                            if (data.success) {
                                                                toast.success("Actualizado");
                                                                setProductoEditar(null);
                                                                setUpdateCantSuccess(!updateCantSuccess);
                                                            }

                                                        } catch (err) {
                                                            console.error(err);
                                                            toast.error("Error");
                                                        } finally {
                                                            setGuardando(false);
                                                        }
                                                    }}
                                                >
                                                    Confirmar
                                                </button>

                                                <button onClick={() => toast.dismiss(t.id)}>
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    ));
                                }}
                            >
                                {guardando ? "Guardando..." : "Guardar"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
        
    );
};



export default Inventario;