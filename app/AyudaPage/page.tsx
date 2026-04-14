'use client';
import '../page.css';
import { ChevronDown, ChevronUp, CircleQuestionMark, CreditCard, Truck, Scroll, File } from 'lucide-react';
import {useState } from 'react';




export default function AyudaPage(){
    const [seccionAbierta, setSeccionAbierta] = useState<string | null>(null);
    
    const toggleSeccion = (seccion: string) => {
        setSeccionAbierta(prev => prev === seccion ? null : seccion);
    };

    return(
        <div className='AydaPage'>
            <div className='AyudaPage_secciones_container'>
                <div className='AyudaPage_seccion'>
                    <div className='AyudaPage_seccion_icon'><CircleQuestionMark size={30} strokeWidth={1} /></div>
                    <h4 onClick={()=>toggleSeccion("faq")}>Preguntas Frecuentes <span>{seccionAbierta == 'faq'? <ChevronUp /> : <ChevronDown />}</span></h4>
                    {seccionAbierta == 'faq' && <ExpandedInfo section={seccionAbierta} />}
                </div>

                <div className='AyudaPage_seccion'>
                    <div className='AyudaPage_seccion_icon'><CreditCard  size={30} strokeWidth={1} /></div>
                    <h4 onClick={()=>toggleSeccion("pagos")}>Pagos <span>{seccionAbierta == 'pagos'? <ChevronUp /> : <ChevronDown />}</span></h4>
                    {seccionAbierta == 'pagos' && <ExpandedInfo section={seccionAbierta} />}
                </div>

                <div className='AyudaPage_seccion'>
                    <div className='AyudaPage_seccion_icon'><Truck  size={30} strokeWidth={1} /></div>
                    <h4 onClick={()=>toggleSeccion("envios")}>Envios <span>{seccionAbierta == 'envios'? <ChevronUp /> : <ChevronDown />}</span></h4>
                    {seccionAbierta == 'envios' && <ExpandedInfo section={seccionAbierta} />}
                </div>

                <div className='AyudaPage_seccion'>
                    <div className='AyudaPage_seccion_icon'><Scroll  size={30} strokeWidth={1} /></div>
                    <h4 onClick={()=>toggleSeccion("terminos")}>Terminos y Condiciones <span>{seccionAbierta == 'terminos'? <ChevronUp /> : <ChevronDown />}</span></h4>
                    {seccionAbierta == 'terminos' && <ExpandedInfo section={seccionAbierta} />}
                </div>

                <div className='AyudaPage_seccion'>
                    <div className='AyudaPage_seccion_icon'><File   size={30} strokeWidth={1} /></div>
                    <h4 onClick={()=>toggleSeccion("politica")}>Politica de Privacidad<span>{seccionAbierta == 'politica'? <ChevronUp /> : <ChevronDown />}</span></h4>
                    {seccionAbierta == 'politica' && <ExpandedInfo section={seccionAbierta} />}
                </div>
            </div>   
        </div>
    )
}

const ExpandedInfo = ({section} : {section: string})=>{

    const numero = "523327652904";


    const handleSection = (arg:string)=>{

        switch(arg){
            case "faq":
                return(
                    <FAQ />
                );
                break;
            case "pagos":
                return(
                    <p>Todos nuestros pagos son manejados por medio de Stripe. Para mas informacion visitar 
                        la <a style={{color:"#229"}} href='https://stripe.com/mx/privacy' target='_blank'>Politica de Privacidad de Stripe</a></p>
                );
                break;
            case "envios":
                return(
                    <>
                    <p>Nuestros productos son enviados por medio de (proveedor de paqueteria).</p>
                    <p>Los tiempos de entrega pueden variar según la ubicación y la paquetería. El tiempo de entrega estimado es de 5 a 10 dias habiles</p>
                    <p>Si ya han pasado los 10 dias habiles desde que reslizaste el pago de tus articulos y estoes aun no han llegado, o si tienes 
                        alguna duda acerca del proceso de envio no dudes 
                        en <a style={{color:"#229"}} 
                            href={`https://wa.me/${numero}?text=${encodeURIComponent("Hola, me gustaria obtener informacion de mi pedido que hice a traves de raqmarmx.com")}`}
                            target='_blank'         
                            rel="noopener noreferrer"
                        >Contactarnos</a>
                    </p>
                    </>
                );
                break;
            case "terminos":
                return(
                    <TerminosYCondiciones />
                );
                break;
            case "politica":
                return(
                    <PoliticaDePrivacidad />
                );
                break;
        }

        return(
            <p></p>
        )
    }
    
    return(
        <div className='AyudaPage_expanded_info'>
            {
                handleSection(section)
            }
        </div>
    )
}

const FAQ = ()=>{
    const numero = "523327652904";

    return(
        <>
        <p><strong>¿Cómo puedo realizar una compra en línea?</strong></p>
        <p>
            Es muy sencillo: elige el producto, agrégalo al carrito, llena tus datos de envío
            y seras llevado a la plataforma de pago de Stripe. Una vez confirmado, recibirás un correo con los
            detalles de tu compra.
        </p>

        <p><strong>¿Qué métodos de pago aceptan?</strong></p>
        <p>
            Aceptamos tarjetas de crédito y débito, transferencias bancarias y otros
            métodos según disponibilidad.
        </p>

        <p><strong>¿Puedo pedir factura?</strong></p>
        <p>
            Sí, puedes solicitar tu factura al momento de la compra o enviando tus datos
            fiscales a nuestro <a style={{color:"#229"}} 
                            href={`https://wa.me/${numero}?text=${encodeURIComponent("Hola, me gustaria solicitar una factura para mi compra que hice a traves de raqmarmx.com")}`}
                            target='_blank'         
                            rel="noopener noreferrer"
                        >Whatsapp</a>.
        </p>

        {/* Envíos y entregas */}
        <p><strong>¿Hacen envíos a toda la República Mexicana?</strong></p>
        <p>
            Sí, realizamos envíos a todo el país mediante paqueterías nacionales confiables.
        </p>

        <p><strong>¿Cuánto tarda en llegar mi pedido?</strong></p>
        <p>
            El tiempo de entrega es de entre 5 y 10 días hábiles, dependiendo de la zona en la que te encuentres.
        </p>

        <p><strong>¿Cuál es el costo del envío?</strong></p>
        <p>
            El costo varía según el destino. Contamos con promociones de envío gratis en compras a partir de $ 1,500.00 MXN.
        </p>

        <p><strong>¿Puedo recoger mi pedido en sucursal?</strong></p>
        <p>
            Sí, puedes elegir la opción de recogida en sucursal. Nuestra dirección y horarios están disponibles en la sección de contacto.
        </p>

        {/* Garantía y servicio */}
        <p><strong>¿Los productos tienen garantía?</strong></p>
        <p>
            Sí, todos nuestros productos cuentan con garantía contra defectos de fábrica.
        </p>

        <p><strong>¿Hacen ajustes o reparaciones?</strong></p>
        <p>
            Sí, ofrecemos servicio de ajustes básicos en armazones y reparaciones menores.
        </p>

        {/* Contacto */}
        <p><strong>¿Cómo puedo ponerme en contacto con ustedes?</strong></p>
        <p>
            Puedes escribirnos a nuestro WhatsApp, llamarnos por teléfono o enviarnos un correo electrónico.
        </p>

        <p><strong>¿Cuáles son sus horarios de atención?</strong></p>
        <p>
            Nuestro horario de atención es de lunes a viernes de 10:00 am a 5:00 pm y sábados de 10:00 am a 2:00 pm.
        </p>
        </>
    )
}

const TerminosYCondiciones = ()=>{
    return(
        <>
        <p><strong>Última actualización:</strong> 03/10/2025</p>

      <section>
        <p><strong>1. Información del titular</strong></p>
        <p>
          Este sitio web es operado por <strong>Raqmar S.A. de C.V.</strong>, con domicilio en [Guadalajara, México].
        </p>
      </section>

      <section>
        <p><strong>2. Aceptación de los términos</strong></p>
        <p>
          Al usar nuestra página web, realizar compras o registrarte en nuestros formularios, confirmas que has leído,
          entendido y aceptado estos Términos y Condiciones.
        </p>
      </section>

      <section>
        <p><strong>3. Uso permitido del sitio</strong></p>
        <p>
          El usuario se compromete a no usar este sitio para actividades ilegales, no alterar ni distribuir el contenido
          sin permiso escrito de <strong>Raqmar S.A. de C.V.</strong>, y no intentar dañar la seguridad o el funcionamiento
          del sitio.
        </p>
      </section>

      <section>
        <p><strong>4. Propiedad intelectual</strong></p>
        <p>
          Todo el contenido del sitio (logotipos, textos, imágenes, catálogos, software) es propiedad de
          <strong> Raqmar S.A. de C.V.</strong> o de sus licenciantes. Queda prohibida su reproducción sin autorización.
        </p>
      </section>

      <section>
        <p><strong>5. Productos y precios</strong></p>
        <p>
          Los precios de nuestros productos están expresados en pesos mexicanos (MXN). Nos reservamos el derecho de
          modificar precios o descontinuar productos sin previo aviso. Hacemos todo lo posible por mostrar imágenes fieles
          a la realidad, pero los colores y presentaciones pueden variar.
        </p>
      </section>

      <section>
        <p><strong>6. Proceso de compra</strong></p>
        <p>
          1. Elige tus productos y añádelos al carrito.<br />
          2. Completa tus datos de envío y método de pago.<br />
          3. Recibirás una confirmación de tu pedido por correo electrónico.<br />
          4. Nos reservamos el derecho a rechazar pedidos en caso de falta de stock o problemas de pago.
        </p>
      </section>

      <section>
        <p><strong>7. Envíos y entregas</strong></p>
        <p>
          Realizamos envíos dentro de la República Mexicana. Los tiempos de entrega pueden variar según la ubicación y la
          paquetería. Una vez entregado el pedido al servicio de mensajería, <strong>Raqmar S.A. de C.V.</strong> no se hace
          responsable por retrasos, pérdidas o daños ocasionados por terceros.
        </p>
      </section>

      <section>
        <p><strong>8. Devoluciones y cambios</strong></p>
        <p>
          Aceptamos devoluciones dentro de los 7 días naturales posteriores a la entrega, siempre que el producto esté en
          su empaque original, sin uso y en perfecto estado. No aplican cambios ni devoluciones en lentes de contacto,
          lentes graduados personalizados o productos de higiene. Los costos de envío por devoluciones correrán a cargo
          del cliente, salvo en casos de error de nuestra parte.
        </p>
      </section>

      <section>
        <p><strong>9. Garantías</strong></p>
        <p>
          Nuestros productos cuentan con la garantía legal y/o del fabricante. En caso de defecto de fabricación, podrás
          solicitar la reparación, cambio o devolución conforme a la ley aplicable.
        </p>
      </section>

      <section>
        <p><strong>10. Limitación de responsabilidad</strong></p>
        <p>
          No garantizamos que el sitio web esté libre de interrupciones, errores o virus. No nos hacemos responsables por
          mal uso de los productos adquiridos. El usuario utiliza este sitio bajo su propia responsabilidad.
        </p>
      </section>

      <section>
        <p><strong>11. Protección de datos personales</strong></p>
        <p>
          El uso de tus datos se regula por nuestra <strong>Política de Privacidad</strong>, disponible en este sitio.
          Nos comprometemos a proteger tu información conforme a la Ley Federal de Protección de Datos Personales en
          Posesión de los Particulares (México).
        </p>
      </section>

      <section>
        <p><strong>12. Ley aplicable y jurisdicción</strong></p>
        <p>
          Estos Términos y Condiciones se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia
          será resuelta ante los tribunales competentes de [tu ciudad/estado].
        </p>
      </section>

      <section>
        <p><strong>13. Modificaciones</strong></p>
        <p>
          <strong>Raqmar S.A. de C.V.</strong> se reserva el derecho de modificar estos Términos y Condiciones en
          cualquier momento. Las versiones actualizadas estarán disponibles en esta página, indicando la fecha de última
          actualización.
        </p>
      </section>
        </>
    )
}

const PoliticaDePrivacidad = ()=>{
    return(
    <>
     <p><strong>Última actualización:</strong> 03/10/2025</p>

      <section>
        <p><strong>1. Responsable del tratamiento de datos</strong></p>
        <p>
          El responsable del tratamiento de tus datos personales es <strong>Raqmar S.A. de C.V.</strong>, con domicilio en
          [ciudad, México].
        </p>
      </section>

      <section>
        <p><strong>2. Datos que recopilamos</strong></p>
        <p>
          Recopilamos datos como nombre, correo electrónico, teléfono, dirección de envío/facturación, datos de pago y
          preferencias. También podemos recopilar datos no personales mediante cookies y tecnologías similares.
        </p>
      </section>

      <section>
        <p><strong>3. Finalidad del uso de datos</strong></p>
        <p>
          Tus datos se usan para procesar pedidos, enviar notificaciones, brindar atención al cliente, cumplir con
          obligaciones legales, mejorar nuestros servicios y, con tu consentimiento, enviarte promociones.
        </p>
      </section>

      <section>
        <p><strong>4. Transferencia de datos</strong></p>
        <p>
          No vendemos ni compartimos tu información personal con terceros sin tu consentimiento. Únicamente compartiremos
          tus datos con proveedores de servicios (ej. paquetería, procesadores de pago) cuando sea necesario para completar
          tu pedido. Podemos divulgar información si es requerida por autoridades conforme a la ley aplicable.
        </p>
      </section>

      <section>
        <p><strong>5. Derechos ARCO</strong></p>
        <p>
          Puedes ejercer tus derechos de Acceso, Rectificación, Cancelación y Oposición enviando una solicitud a
          📧 [correo de privacidad].
        </p>
      </section>

      <section>
        <p><strong>6. Uso de cookies</strong></p>
        <p>
          Nuestro sitio web utiliza cookies para mejorar tu experiencia de navegación y personalizar el contenido. Puedes
          deshabilitarlas en la configuración de tu navegador, aunque algunas funciones del sitio podrían verse afectadas.
        </p>
      </section>

      <section>
        <p><strong>7. Seguridad de la información</strong></p>
        <p>
          Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger tus datos contra pérdida,
          acceso no autorizado, alteración o divulgación indebida.
        </p>
      </section>

      <section>
        <p><strong>8. Cambios en la política</strong></p>
        <p>
          <strong>Raqmar S.A. de C.V.</strong> se reserva el derecho de actualizar esta Política de Privacidad en cualquier
          momento. Cualquier cambio será publicado en este sitio web, indicando la fecha de última actualización.
        </p>
      </section>

      <section>
        <p><strong>9. Aceptación</strong></p>
        <p>
          Al usar nuestro sitio web y proporcionar tus datos personales, aceptas los términos de esta Política de
          Privacidad.
        </p>
      </section>
    </>
    )
}