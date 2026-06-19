import '../page.css';

export const metadata = {
    title: "Sucursales | Raqmar — Fragancias y Lentes Solares",
    description: "Encuentra las mejores fragancias y lentes solares al mejor precio en Raqmar.",
    openGraph: {
        title: "Sucursales | Raqmar",
        description: "Fragancias y lentes solares de calidad.",
        url: "https://raqmarmx.com/Sucursales",
        siteName: "Raqmar",
        images: [{ url: "https://raqmarmx.com/og-image.jpg" }],
        type: "website",
    },
};


export default function Sucursales(){

    return(
        <div className='SucursalesPage_container'>
            <h3 className='bubble_text'>Sucursal Plaza del Sol GDL</h3>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3733.436151515471!2d-103.4013543!3d20.6518274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428adb9473b0375%3A0x1f924ec72d784fa8!2sRAQMAR!5e0!3m2!1ses-419!2smx!4v1779220955531!5m2!1ses-419!2smx" 
                style={{border:"0px"}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            <a className="link-ubicacion" href="https://maps.app.goo.gl/uCz1myZU5JcSBHyC7" target="_blank">Lopez Mateos Sur 2375 Zona B, Local 14 A</a>
        </div>
    );
}