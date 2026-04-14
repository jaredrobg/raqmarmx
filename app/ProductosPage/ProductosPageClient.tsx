"use client";
import '../page.css';
import Productos from '../Components/Productos';
import { ProductoFields } from "../lib/contentful";
import { Entry } from "contentful";
import { useState } from 'react';
import { Search } from 'lucide-react';
import { SearchX } from 'lucide-react';



interface HomePageProps {
  productos: Entry<ProductoFields>[];
}

export default function ProductosPage({ productos }: HomePageProps){

    const[searchTerm, setSearchTerm] = useState("");

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
                    id='buscador'
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="buscador"
                />
                <label htmlFor='buscador' className='buscador_icon'><Search /></label>
            </div>

            <Productos productos={filtered}/>
        </div>
    )
}