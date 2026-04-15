"use client";
import {useState, useEffect} from 'react';
import './../page.css';
import Image from 'next/image';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { UserRound } from 'lucide-react';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useShoppingBag } from '../Context/ShoppingBagContext';
import SideMenu from './SideMenu'; 
import { ShoppingBagModule} from '../ShoppingBag/page';
import { useGlobal } from '../Context/GlobalContext';

const Header = ()=>{
    const {user} = useAuth(); 
    const {cartList} = useShoppingBag();
    const {SMVisible, setSMVisible, SBvisible, setSBVisible, isMobile} = useGlobal();

    const totalCartItems = cartList.reduce((acc, item) => acc + item.quantity, 0);


    //verificacion de movil
    

    return(
        <div className="Header_Container">
            <div className="nav_link">
                {isMobile ? (
                    <button onClick={()=>setSMVisible(!SMVisible)}
                        className="boton_Header"   
                        style={{padding: "10px"}}
                    ><Menu className="icon" size={20}/></button>
                ): (
                    <div className="sub_nav_link">
                        <button onClick={()=>setSMVisible(!SMVisible)}
                            className="boton_Header"   
                            style={{padding: "10px"}}
                        ><Menu className="icon" size={20}/></button>
                        <Link href='/ProductosPage' className='boton_Header'  style={{marginLeft:"10px", width:"fit-content"}} >PRODUCTOS</Link>

                    </div>
                )}
            </div>
            <Link href='/HomePage'  className="nav_link">
                    <Image
                        className="logo_image"
                        src="/Images/logo.png"
                        alt="logo"
                        fill
                        sizes='max-width: 100%; height: auto;'
                        style={{ objectFit: "contain" }}
                        priority
                    />
            </Link>

            <div className="nav_link">
                <button className='boton_Header_icon cart' onClick={()=>setSBVisible(true)} >
                    <ShoppingBag size={20} />
                    <span className="cart-badge" style={{display: totalCartItems > 0? '':'none'}}>{totalCartItems}</span>
                </button>
                <Link className={isMobile?'boton_Header_icon' : "boton_Header"} href='/Profile' style={isMobile?{marginRight:"10px"}:{}}>
                    {isMobile? <UserRound className='icon' size={20} /> : user? "PERFIL": "LOGIN"  }
                </Link>
            </div>
            
        </div>
    )
}

export default Header;