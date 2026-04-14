"use client";
import './../page.css';
import Link from 'next/link';
import { useAuth } from '../Context/AuthContext';
import { ImFacebook2 } from "react-icons/im";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";





export default function Footer(){
    const {user} = useAuth();

    const mensaje =  "Hola! vengo del boton de contacto de la pagina web";
    const numero = "523327652904";


    return(
        <div className="Footer_Container">
            <div className='footer_top footer_section'>
                <Link href='/Profile' className='footer_option'>{user? 'Perfil': 'Iniciar Sesion'}</Link>
                <Link href='/ShoppingBag' className='footer_option'>Tu Carrito</Link>
            </div>
            <div className='footer_section_group'>
                <div className='footer_middle footer_section'>
                    <Link href='/Sucursales' className='footer_option'><p>Sucursales</p></Link>
                    <Link href='/AyudaPage' className='footer_option'><p>Pago</p></Link>
                    <Link  
                        href={`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`} className='footer_option'
                        target='_blank'
                    >
                        <p>Contacto</p>
                    </Link>
                    <Link href='/AyudaPage' className='footer_option'><p>Dudas Frecuentes</p></Link>
                    <Link href='/AyudaPage' className='footer_option'><p>Envio</p></Link>
                    <Link href='/AyudaPage' className='footer_option'><p>Terminos y Condiciones</p></Link>
                </div>
                <div className='footer_redes footer_section'>
                    <h3>Siguenos</h3>
                    <a href='https://www.facebook.com/share/1C7wS3djLk/?mibextid=wwXIfr' target='_blank' className='footer_option'>
                        <ImFacebook2 size={25} />
                    </a>
                    <a href='https://www.instagram.com/opticos.raqmargdl?igsh=MXU0MG9hczIwMThhNg==' target='_blank' className='footer_option'>
                        <FaInstagram size={25} />
                    </a>
                    <a href='https://www.tiktok.com/@opticagdl?_t=ZS-8zycpOf6OAR&_r=1' target='_blank' className='footer_option'>
                        <FaTiktok size={25} />
                    </a>
                </div>
            </div>
            <div className='footer_bottom footer_section'>2026 Raqmar / Todos los derechos reservados D.R. ®</div>
        </div>
    )
}