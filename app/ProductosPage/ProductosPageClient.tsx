"use client";
import '../page.css';
import Productos from '../Components/Productos';
import { ProductoFields } from "../lib/contentful";
import { Entry } from "contentful";
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useSearchParams } from 'next/navigation';



interface HomePageProps {
  productos: Entry<ProductoFields>[];
}

export default function ProductosPage({ productos }: HomePageProps){

    const [searchTerm, setSearchTerm] = useState(() => {
        if (typeof window === "undefined") return "";
        const params = new URLSearchParams(window.location.search);
        return params.get("search") || "";
    });
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const searchParams = useSearchParams();

    useEffect(() => {
        const focus = searchParams.get("focus");
        if (focus === "search") {
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [searchParams]);

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const filtered = productos?.filter((producto)=>{
        const nombre= producto.fields.nombre?.toLocaleLowerCase();
        const modelo = producto.fields.modelo?.toLocaleLowerCase();
        const material = producto.fields.material?.toLocaleLowerCase();
        const categoria = producto.fields.categoria?.toLocaleLowerCase();
        const marca = producto.fields.marca?.toLocaleLowerCase();
        const color = producto.fields.color?.toLocaleLowerCase();
        const term = searchTerm.toLocaleLowerCase();
        return nombre?.includes(term) || modelo?.includes(term) || categoria?.includes(term) || marca?.includes(term) || material?.includes(term) ||color?.includes(term);
    });
    
    
    return(
        <div className='ProductosPage'>
            <div className='buscador_container'>
                <input
                    type="text"
                    ref={inputRef}
                    id='buscador'
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearchTerm(value);

                        // Debounce para no actualizar URL en cada tecla inmediata
                        if (debounceRef.current) {
                            clearTimeout(debounceRef.current);
                        }

                        debounceRef.current = setTimeout(() => {
                            const params = new URLSearchParams(window.location.search);

                            if (value) {
                                params.set("search", value);
                            } else {
                                params.delete("search");
                            }

                            const newUrl =
                                value
                                    ? `${window.location.pathname}?${params.toString()}`
                                    : window.location.pathname;

                            window.history.replaceState({}, "", newUrl);
                        }, 300);
                    }}
                    className="buscador"
                />
                <label htmlFor='buscador' className='buscador_icon'><Search /></label>
            </div>

            <Productos productos={filtered}/>
        </div>
    )
}