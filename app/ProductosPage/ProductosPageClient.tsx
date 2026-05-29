"use client";
import '../page.css';
import Productos from '../Components/Productos';
import { ProductoFields } from "../lib/contentful";
import { Entry } from "contentful";
import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface HomePageProps {
    productos: Entry<ProductoFields>[];
}

function ProductosPageInner({ productos }: HomePageProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const [searchTerm, setSearchTerm] = useState(
        searchParams.get("search") || ""
    );

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

    const filtered = productos?.filter((producto) => {
        const nombre = producto.fields.nombre?.toLocaleLowerCase();
        const modelo = producto.fields.modelo?.toLocaleLowerCase();
        const material = producto.fields.material?.toLocaleLowerCase();
        const categoria = producto.fields.categoria?.toLocaleLowerCase();
        const marca = producto.fields.marca?.toLocaleLowerCase();
        const color = producto.fields.color?.toLocaleLowerCase();
        const term = searchTerm.toLocaleLowerCase();
        return nombre?.includes(term) || modelo?.includes(term) || categoria?.includes(term) || marca?.includes(term) || material?.includes(term) || color?.includes(term);
    });

    return (
        <div className='ProductosPage'>
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