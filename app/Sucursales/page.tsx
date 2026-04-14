import '../page.css';


export default function Sucursales(){

    return(
        <div className='SucursalesPage_container'>
            <h3 className='bubble_text'>Sucursal Santa Teresita</h3>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.638504936327!2d-103.3710022262341!3d20.684280999523967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428adb9473b0375%3A0x1f924ec72d784fa8!2s%C3%93ptica%20RAQMAR!5e0!3m2!1ses-419!2smx!4v1745939965067!5m2!1ses-419!2smx" 
                style={{border:"0px"}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            <a className="link-ubicacion" href="https://maps.app.goo.gl/hPHhygXujLmsUsno6" target="_blank">Calle Manuel Acuña #1512, Santa Teresita</a>
        </div>
    );
}