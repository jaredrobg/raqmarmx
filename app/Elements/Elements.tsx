import './../page.css';
import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa6';


interface ButtonProps{
    type: string;
    children: React.ReactNode;
    onClick?: (e: React.FormEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    style?: React.CSSProperties;
}


const Button = ({type, children, ...buttonProps}: ButtonProps)=>{
    // const className= type === 'primary' ? 'PrimaryButton' : 'SecondaryButton';
    let className;
    let disabled = false;
    switch(type){
        case 'primary':
            className = 'PrimaryButton';
            break;
        case 'submit':
            className = 'PrimaryButton';
            break;
        case 'secondary':
            className = 'SecondaryButton';
            break;
        case 'green':
            className = 'GreenButton';
            break;
        case 'red':
            className = 'RedButton';
            break;
        case 'addButton':
            className = 'addButton';
            break;
        case 'azul2':
            className = 'Azul2Button';
            break;
        case 'disabled':
            className = 'DisabledButton'; 
            disabled = true;
            break;   
        case 'closeButton':
            className = 'CloseButton';
            break;
        case 'backButton':
            className = 'BackButton';
            break;  
        default:
            className = 'PrimaryButton';
    }
    return(
        <button className = {`Button ${className}`} {...buttonProps} disabled={disabled? true: false}>{children}</button>
    )
}

const LogginButton = ({type, children, ...buttonProps}: {type: string, children: React.ReactNode})=>{
    return(
        <Button 
        type = "secondary"
        {...buttonProps}
        onClick={() => alert('Login clicked!')}
        >{children}</Button>
    )
}

const WhatsAppButton = ()=>{
    const mensaje =  "Hola! vengo del boton de contacto de la pagina web";
    const numero = "523327652904"
    return (
    <a
      href={`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
    >
      <FaWhatsapp size={32} color='#fff'/>
    </a>
  );
}

export {Button, LogginButton, WhatsAppButton}