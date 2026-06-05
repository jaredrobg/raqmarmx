"use client";
import '../page.css';
import Productos from '../Components/Productos';
import { ProductoFields } from "../lib/contentful";
import { Entry } from "contentful";
import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface HomePageProps {
    productos: Entry<ProductoFields>[];
}

interface Filtros {
    categorias: string[];
    genero: string[];
    precioDesde: string;
    precioHasta: string;
    material: string[];
}

function ProductosPageInner({ productos }: HomePageProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const [searchTerm, setSearchTerm] = useState(
        searchParams.get("search") || ""
    );

    const [modalFiltros, setModalFiltros] = useState(false);
    const [filtros, setFiltros] = useState<Filtros>({
        categorias: [],
        genero: [],
        precioDesde: "",
        precioHasta: "",
        material: [],
    });

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    useEffect(() => {
        if (searchParams.get("focus") === "search") {
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [searchParams]);

    const toggleFiltro = (key: keyof Pick<Filtros, 'categorias' | 'genero' | 'material'>, value: string) => {
        setFiltros(prev => {
            const arr = prev[key];
            return {
                ...prev,
                [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
            };
        });
    };

    const limpiarFiltros = () => {
        setFiltros({ categorias: [], genero: [], precioDesde: "", precioHasta: "", material: [] });
    };

    const hayFiltrosActivos =
        filtros.categorias.length > 0 ||
        filtros.genero.length > 0 ||
        filtros.precioDesde !== "" ||
        filtros.precioHasta !== "" ||
        filtros.material.length > 0;

    const filtered = productos?.filter((producto) => {
        const nombre    = producto.fields.nombre?.toLocaleLowerCase();
        const modelo    = producto.fields.modelo?.toLocaleLowerCase();
        const material  = producto.fields.material?.toLocaleLowerCase();
        const categoria = producto.fields.categoria?.toLocaleLowerCase();
        const marca     = producto.fields.marca?.toLocaleLowerCase();
        const color     = producto.fields.color?.toLocaleLowerCase();
        const term      = searchTerm.toLocaleLowerCase();

        const matchSearch =
            nombre?.includes(term) ||
            modelo?.includes(term) ||
            categoria?.includes(term) ||
            marca?.includes(term) ||
            material?.includes(term) ||
            color?.includes(term);

        if (!matchSearch) return false;

        // Filtro categorias
        if (filtros.categorias.length > 0) {
            const matchCat = filtros.categorias.some(c =>
                categoria?.includes(c.toLocaleLowerCase()) ||
                nombre?.includes(c.toLocaleLowerCase())
            );
            if (!matchCat) return false;
        }

        // Filtro genero
        if (filtros.genero.length > 0) {
            const matchGen = filtros.genero.some(g =>
                categoria?.includes(g.toLocaleLowerCase()) ||
                nombre?.includes(g.toLocaleLowerCase()) ||
                modelo?.includes(g.toLocaleLowerCase())
            );
            if (!matchGen) return false;
        }

        // Filtro precio
        const precio = Number(producto.fields.precio);
        if (filtros.precioDesde !== "" && precio < Number(filtros.precioDesde)) return false;
        if (filtros.precioHasta !== "" && precio > Number(filtros.precioHasta)) return false;

        // Filtro material (solo si Lente Solar está seleccionado)
        if (filtros.categorias.includes("Lente Solar") && filtros.material.length > 0) {
            const matchMat = filtros.material.some(m =>
                material?.includes(m.toLocaleLowerCase())
            );
            if (!matchMat) return false;
        }

        return true;
    });

    const chip = (label: string, selected: boolean, onClick: () => void) => (
        <button
            key={label}
            onClick={onClick}
            style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: selected ? "1.5px solid #0b8783" : "1px solid #ccc",
                background: selected ? "#0b878315" : "transparent",
                color: selected ? "#0b8783" : "inherit",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: selected ? 500 : 400,
                transition: "all 0.15s",
            }}
        >
            {label}
        </button>
    );

    return (
        <div className='ProductosPage'>
            <div style={{ position: "relative" }}>
                <div className='buscador_container'>
                    <input
                        ref={inputRef}
                        type="text"
                        id='buscador'
                        placeholder="Buscar producto..."
                        value={searchTerm}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearchTerm(value);
                            if (debounceRef.current) clearTimeout(debounceRef.current);
                            debounceRef.current = setTimeout(() => {
                                if (value) {
                                    router.replace(`/ProductosPage?search=${encodeURIComponent(value)}`);
                                } else {
                                    router.replace('/ProductosPage');
                                }
                            }, 300);
                        }}
                        className="buscador"
                    />
                    <label htmlFor='buscador' className='buscador_icon'><Search /></label>
                </div>
                {/* Botón filtros */}
                <button
                    className='filtros_btn'
                    onClick={() => setModalFiltros(true)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 14px",
                        borderRadius: "20px",
                        border: hayFiltrosActivos ? "1.5px solid #0b8783" : "1px solid #ccc",
                        background: hayFiltrosActivos ? "#0b878315" : "transparent",
                        color: hayFiltrosActivos ? "#0b8783" : "inherit",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                    }}
                >
                    <SlidersHorizontal size={15} />
                    Filtros
                    {hayFiltrosActivos && (
                        <span style={{
                            background: "#0b8783",
                            color: "white",
                            borderRadius: "50%",
                            width: "18px",
                            height: "18px",
                            fontSize: "11px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            {[...filtros.categorias, ...filtros.genero, ...filtros.material].length +
                                (filtros.precioDesde || filtros.precioHasta ? 1 : 0)}
                        </span>
                    )}
                </button>
            </div>

            {/* Modal filtros */}
            {modalFiltros && (
                <>
                    <div
                        onClick={() => setModalFiltros(false)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.35)",
                            zIndex: 1000,
                        }}
                    />
                    <div style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "white",
                        borderRadius: "16px",
                        padding: "24px",
                        width: "min(420px, 90vw)",
                        zIndex: 1001,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}>
                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: 500, fontSize: "16px" }}>Filtros</span>
                            <button onClick={() => setModalFiltros(false)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Categoría */}
                        <div>
                            <p style={{ fontSize: "12px", color: "#888", marginBottom: "8px", fontWeight: 500 }}>CATEGORÍA</p>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {chip("Fragancia",    filtros.categorias.includes("Fragancia"),    () => toggleFiltro("categorias", "Fragancia"))}
                                {chip("Lente Solar", filtros.categorias.includes("Lente Solar"), () => toggleFiltro("categorias", "Lente Solar"))}
                            </div>
                        </div>

                        {/* Material — solo si Lente Solar está seleccionado */}
                        {filtros.categorias.includes("Lente Solar") && (
                            <div>
                                <p style={{ fontSize: "12px", color: "#888", marginBottom: "8px", fontWeight: 500 }}>MATERIAL</p>
                                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                    {chip("Acetato",  filtros.material.includes("Acetato"),  () => toggleFiltro("material", "Acetato"))}
                                    {chip("Metal", filtros.material.includes("Metal"), () => toggleFiltro("material", "Metal"))}
                                </div>
                            </div>
                        )}

                        {/* Género */}
                        <div>
                            <p style={{ fontSize: "12px", color: "#888", marginBottom: "8px", fontWeight: 500 }}>GÉNERO</p>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {chip("Dama",      filtros.genero.includes("Dama"),      () => toggleFiltro("genero", "Dama"))}
                                {chip("Caballero", filtros.genero.includes("Caballero"), () => toggleFiltro("genero", "Caballero"))}
                            </div>
                        </div>

                        {/* Rango de precio */}
                        <div>
                            <p style={{ fontSize: "12px", color: "#888", marginBottom: "8px", fontWeight: 500 }}>RANGO DE PRECIO</p>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <input
                                    type="number"
                                    placeholder="Desde"
                                    value={filtros.precioDesde}
                                    onChange={e => setFiltros(prev => ({ ...prev, precioDesde: e.target.value }))}
                                    style={{
                                        flex: 1,
                                        padding: "8px 10px",
                                        borderRadius: "8px",
                                        border: "1px solid #ccc",
                                        fontSize: "13px",
                                        outline: "none",
                                    }}
                                />
                                <span style={{ color: "#aaa", fontSize: "13px" }}>—</span>
                                <input
                                    type="number"
                                    placeholder="Hasta"
                                    value={filtros.precioHasta}
                                    onChange={e => setFiltros(prev => ({ ...prev, precioHasta: e.target.value }))}
                                    style={{
                                        flex: 1,
                                        padding: "8px 10px",
                                        borderRadius: "8px",
                                        border: "1px solid #ccc",
                                        fontSize: "13px",
                                        outline: "none",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                            <button
                                onClick={limpiarFiltros}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#888",
                                    fontSize: "13px",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                }}
                            >
                                Limpiar filtros
                            </button>
                            <button
                                onClick={() => setModalFiltros(false)}
                                style={{
                                    padding: "9px 22px",
                                    borderRadius: "20px",
                                    background: "#0b8783",
                                    color: "white",
                                    border: "none",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                }}
                            >
                                Aplicar
                            </button>
                        </div>
                    </div>
                </>
            )}

            <Productos productos={filtered} />
        </div>
    );
}

export default function ProductosPage({ productos }: HomePageProps) {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ProductosPageInner productos={productos} />
        </Suspense>
    );
}