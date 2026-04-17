'use client';
import "../page.css";
import { ImCross } from "react-icons/im";
import { CSSProperties } from "react";


export default function AvisoMantenimiento(){

    const closeAviso = () => {
        const aviso = document.querySelector('.avisoMantenimiento') as HTMLElement;
        if (aviso) {
            aviso.style.display = 'none';
        }
    }

    return(
        <div className="avisoMantenimiento liquid-glass-red" style={{display:"none"}}>
            <ImCross style={styles.icon} size={11} onClick={closeAviso}/>
            ¡AVISO! Esta pagina actualmente se encuentra en mantenimiento. Los precios e informacion de productos pueden no ser correctos.
        </div>
    )
}

const styles = {
    icon: {
        position: 'absolute',
        right: '5px',
        top: '5px',
        cursor: 'pointer',
    } as CSSProperties,
};