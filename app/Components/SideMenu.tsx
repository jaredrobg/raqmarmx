'use client';
import '../page.css';
import Link from 'next/link';
import { useAuth } from '../Context/AuthContext';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect, Children } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobal } from '../Context/GlobalContext';



type SubMenuProps = {
    visible: boolean;
    onClose: () => void;
}

export default function SideMenu(){
    const {user, logout} = useAuth();  
    const [openMarcas, setOpenMarcas] = useState(false);
    const [openCategorias, setOpenCategorias] = useState(false);
    const [openTemporadas, setOpenTemporadas] = useState(false);
    const {SMVisible, setSMVisible, isMobile} = useGlobal();

    const onClose = ()=>{
        setSMVisible(false);
    }


    
    const mensaje =  "Hola! vengo del boton de contacto de la pagina web";
    const numero = "523327652904";

    useEffect(()=>{
        if(!SMVisible){
            setOpenMarcas(false);
            setOpenCategorias(false);
            setOpenTemporadas(false);
            document.body.classList.remove("no-scroll");

        }
        if(SMVisible){
            document.body.classList.add("no-scroll");
        }
    },[SMVisible])

    const onOpen= (arg:string)=>{
        switch(arg){
            case 'marca':
                setOpenMarcas(true);
                setOpenCategorias(false);
                setOpenTemporadas(false);
                break;
            case 'temporada':
                setOpenTemporadas(true);
                setOpenMarcas(false);
                setOpenCategorias(false);
                break;
            case 'categoria':
                setOpenCategorias(true);
                setOpenMarcas(false);
                setOpenTemporadas(false);
                break;
        }
    }

    
    


    return(
        <div className={'SideMenu_container_container'}>
            {SMVisible && <div className="SideMenu_overlay" onClick={onClose}></div>}
            
            {isMobile === true ? (
                <div className={'SideMenu_container'} style={SMVisible? {transform: "translateX(55vw)"}: {transform: "translateX(-55vw)"}}>
                    <div className='SideMenu_section'>
                        <Link href='/Profile' className='SideMenu_option' onClick={onClose}  style={{fontWeight:"bold", fontSize:"19px"}}>
                            {user? `${user.name} ${user.lastname}` : "Iniciar Sesion"}
                        </Link>
                        {user && user.internal_id < 50 && <Link href='/AdminPage' onClick={onClose} prefetch={false} className='SideMenu_option'>Admin</Link>}
                        <Link href='/ShoppingBag' className='SideMenu_option' onClick={onClose}>Carrito</Link>
                        <div className='line'></div>
                    </div>
                    <div className='SideMenu_section'>
                        <Link href='/HomePage' className='SideMenu_option' onClick={onClose}>Inicio</Link>
                        <Link href='/ProductosPage' className='SideMenu_option' onClick={onClose}>Todos Los Productos</Link>
                        <div className='SideMenu_option' onClick={()=>onOpen('marca')}>
                            Marca <span><ChevronRight size={15} /></span>
                            <MenuMarca visible={openMarcas} onClose={onClose}/>
                        </div>
                        <div className='SideMenu_option' onClick={()=>onOpen('categoria')}>
                            Categoria <span><ChevronRight size={15} /></span>
                            <MenuCategoria visible={openCategorias} onClose={onClose}/>
                        </div>
                        <div className='SideMenu_option' onClick={()=>onOpen('temporada')}>
                            Temporada <span><ChevronRight size={15} /></span>
                            <MenuTemporada visible={openTemporadas} onClose={onClose}/>
                        </div>
                    </div>
                    <div className='SideMenu_section'>
                        <Link href='/Sucursales' className='SideMenu_option' onClick={onClose}>Sucursales</Link>
                        <a className='SideMenu_option' 
                            href={`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`}
                            target='_blank'         
                            rel="noopener noreferrer"
                            onClick={onClose}
                        >
                            Contacto
                        </a>
                        {user &&
                            <div className='SideMenu_option'
                                onClick={()=>logout()}
                            >Cerrar Sesion</div>
                        }
                    </div>
                </div>
            ):(
                <div className={'SideMenu_container'} style={SMVisible? {transform: "translateX(55vw)"}: {transform: "translateX(-55vw)"}}>
                    <div className='SideMenu_section'>
                        <Link href='/Profile' className='SideMenu_option' onClick={onClose}  style={{fontWeight:"bold", fontSize:"19px"}}>
                            {user? `${user.name} ${user.lastname}` : "Iniciar Sesion"}
                        </Link>
                        {user && user.internal_id < 50 && <Link href='/AdminPage' onClick={onClose} prefetch={false} className='SideMenu_option'>Admin</Link>}
                        <Link href='/ShoppingBag' className='SideMenu_option' onClick={onClose}>Carrito</Link>
                        <div className='line'></div>
                    </div>
                    <div className='SideMenu_section'>
                        <Link href='/HomePage' className='SideMenu_option' onClick={onClose}>Inicio</Link>
                        <Link href='/ProductosPage' className='SideMenu_option' onClick={onClose}>Todos Los Productos</Link>
                        <div className='SideMenu_option' onClick={()=>onOpen('marca')}>
                            Marca <span><ChevronRight size={15} /></span>
                            <MenuMarca visible={openMarcas} onClose={onClose}/>
                        </div>
                        <div className='SideMenu_option' onClick={()=>onOpen('categoria')}>
                            Categoria <span><ChevronRight size={15} /></span>
                            <MenuCategoria visible={openCategorias} onClose={onClose}/>
                        </div>
                        <div className='SideMenu_option' onClick={()=>onOpen('temporada')}>
                            Temporada <span><ChevronRight size={15} /></span>
                            <MenuTemporada visible={openTemporadas} onClose={onClose}/>
                        </div>
                    </div>
                    <div className='SideMenu_section'>
                        <Link href='/Sucursales' className='SideMenu_option' onClick={onClose}>Sucursales</Link>
                        <a className='SideMenu_option' 
                            href={`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`}
                            target='_blank'         
                            rel="noopener noreferrer"
                            onClick={onClose}
                        >
                            Contacto
                        </a>
                        {user &&
                            <div className='SideMenu_option'
                                onClick={()=>logout()}
                            >Cerrar Sesion</div>
                        }
                    </div>
                </div>
            ) }
        </div>
    )
}

const MenuMarca = ({visible, onClose}: SubMenuProps)=>{
    const router = useRouter();

    const slugify = (text: string) =>
    text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // quita acentos
        .replace(/&/g, "and")
        .replace(/'/g, "")
        .replace(/\s+/g, "-");



    const handleFilter = (filter:string)=>{
        const slug = slugify(filter);
        router.push(`/ProductosFiltrados/${slug}`);
    }

    const lista = [
        "Al Haramain",
        "Armani",
        "Bharara",
        "Cacharel",
        "Calvin Klein",
        "Carolina Herrera",
        "Dolce & Gabbana",
        "Ferrari",
        "Givenchy",
        "Hugo Boss",
        "Lacoste",
        "Lancome",
        "Lattafa",
        "Love Moschino",
        "Michel Kors",
        "Montblanc",
        "Olive People",
        "Paco Rabanne",
        "Paris Hilton",
        "Polo",
        "Ralph Lauren",
        "Rasasi",
        "RayBan",
        "Versace",
        "Victoria's Secret",
        "Yves Saint Laurent"
    ];

    return(
            <div className='SubMenu_container' style={{display: visible? 'flex': 'none'}}>
                {lista.map((item, index)=>(
                    <div 
                        key={index} 
                        className='SubMenu_option' 
                        onClick={()=>{handleFilter(item); onClose()}}
                    >
                        {item}
                    </div>
                ))}
            </div>
    )
}

const MenuTemporada = ({visible, onClose}: SubMenuProps)=>{
    const router = useRouter();

    const slugify = (text: string) =>
    text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // quita acentos
        .replace(/&/g, "and")
        .replace(/'/g, "")
        .replace(/\s+/g, "-");



    const handleFilter = (filter:string)=>{
        const slug = slugify(filter);
        router.push(`/ProductosFiltrados/${slug}`);
    }

    const lista = [
        "Primavera",
        "Verano",
        "Otoño",
        "Invierno"
    ];
    return(
            <div className='SubMenu_container' style={{display: visible? 'flex': 'none'}}>
                {lista.map((item, index)=>(
                    <div 
                        key={index} 
                        className='SubMenu_option' 
                        onClick={()=>{handleFilter(item); onClose()}}
                    >
                        {item}
                    </div>
                ))}
            </div>
    )
}

const MenuCategoria = ({visible, onClose}: SubMenuProps)=>{
    const router = useRouter();

    const slugify = (text: string) =>
    text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // quita acentos
        .replace(/&/g, "and")
        .replace(/'/g, "")
        .replace(/\s+/g, "-");



    const handleFilter = (filter:string)=>{
        const slug = slugify(filter);
        router.push(`/ProductosFiltrados/${slug}`);
    }

    const lista = [
        "Lente Solar",
        "Lente Oftalmico",
        "Fragancia",
        "Fregancia Arabe",
        "Accesorio",
    ];

    return(
            <div className='SubMenu_container' style={{display: visible? 'flex': 'none'}}>
                {lista.map((item, index)=>(
                    <div 
                        key={index} 
                        className='SubMenu_option' 
                        onClick={()=>{handleFilter(item); onClose()}}
                    >
                        {item}
                    </div>
                ))}
            </div>
    )
}