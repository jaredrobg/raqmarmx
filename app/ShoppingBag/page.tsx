'use client';
import '../page.css';
import { Button } from '../Elements/Elements';
import { useShoppingBag } from '../Context/ShoppingBagContext';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DireccionesComponent } from '../DireccionesPage/page';
import { useAuth } from '../Context/AuthContext';
import { LoginPage, SignupPage } from '../Profile/page';
import { Direccion } from '../Elements/interface';
import { useGlobal } from '../Context/GlobalContext';




// ------------------ Modal reutilizable ------------------
export const ShoppingBagModule = () => {
  const {user} = useAuth();
  const { cartList, updateQuantity, removeFromShoppingBag, clearShoppingBag, totalCarrito } = useShoppingBag();
  const [direccionesVisible, setDireccionesVisible] = useState(false);
  const [direccionSelected, setDireccionSelected] = useState({}as Direccion);
  const [mockVisible, setMockVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);
  const {SBvisible, setSBVisible} = useGlobal();

  const onClose = () => {
    setSBVisible(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(()=>{
    if(!SBvisible){
      document.body.classList.remove("no-scroll");
    }
    if(SBvisible){
      document.body.classList.add("no-scroll");
    }
  }, [SBvisible]);
  


  useEffect(()=>{
    console.log("Direccion seleccionada: ", direccionSelected);
  },[direccionSelected]);
  
  const cartItems = [
    ...cartList.map(item => ({
      name: item.nombreProducto,
      price: item.precio,
      quantity: item.quantity,
    })),
    ...(totalCarrito.costoEnvio > 0
      ? [{ name: "Costo de envío", price: totalCarrito.costoEnvio, quantity: 1 }]
      : [])
  ];

  const handleCheckout = async () => {
    console.log("Iniciando checkout con items:", cartItems);
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // redirige al Checkout de Stripe
    } else {
      alert("Error al crear checkout");
    }
  };

  
  if (!mounted) return null;

  return (
    <div className='ShoppingBag_module' style={{ display: SBvisible ? 'flex' : 'none' }} >
      <div className='ShoppingBag_module_container'>
        <Button type='closeButton' onClick={onClose}>X</Button>
        {!loginVisible || !signupVisible &&<h3 style={{marginTop:"30px", textAlign:"center"}}>{direccionesVisible?"Selecciona Direccion":"Mi Carrito"}</h3>}
        {direccionesVisible &&
        <DireccionesComponent 
          selector={true} 
          visible={direccionesVisible} 
          direccionSelected={direccionSelected} 
          setDireccionSelected={setDireccionSelected}
          setVisible={setMockVisible}
        />}
        <SignupPage visible={signupVisible} setVisible={setSignupVisible} />
        <LoginPage visible={loginVisible} setVisible={setLoginVisible} setSignupVisible={setSignupVisible} />
        
        <div className='ShoppingBag_product_list' 
        style={{
          display: direccionesVisible ? "none" :
                   loginVisible ? "none" :
                   signupVisible ? "none" : "block"
          }}>
          {cartList.length === 0 ? <p style={{textAlign:"center", height:"100%", alignContent:"center"}}>Carrito Vacio</p> : 
          cartList.map((item) => (
            <div key={item.contentful_product_id} className="ShoppingBagModule_card">
              {(Number(item.quantity) > Number(item.disponible)) &&
                <div className='shoppingBag_warning'>
                  <p>¡ CANTIDAD O PRODUCTO NO DISPONIBLE ! <br></br> (disponibles: {item.disponible}).</p>
                </div>
              }
              <div className="ShoppingBagModule_card-image">
                  <Image 
                      src={`https:${item.image_URL}`}
                      alt={item.nombreProducto}
                      fill
                      sizes='max-width: 100%; height: auto;'
                      style={{objectFit: "cover", borderRadius:"7px"}}
                  />
              </div>    
              <div className="ShoppingBagModule_card-content">
                  <h3>{item.modelo}</h3>
                  <p className="ShoppingBagModule_card_nombre">{item.nombreProducto}</p>
                  <p className="ShoppingBagModule_card_precio">{Number(item.precio).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                  <div className='quant_button_container'>
                    <button className='quant_button' onClick={()=>updateQuantity(item.contentful_product_id, (item.quantity) - 1)}>-</button>
                    <p>{item.quantity}</p>
                    <button className='quant_button' onClick={()=>updateQuantity(item.contentful_product_id, (item.quantity) + 1)}>+</button>
                    <Button type='closeButton' 
                      style={{position:"relative", top:"-10px"}}
                      onClick={()=>removeFromShoppingBag(item.contentful_product_id)}
                    ><Trash2 size={15}/></Button>
                  </div>
              </div>
          </div>
          ))}
          <div className='ShoppingBag_total_info' style={{display:cartList.length>0? "block": "none"}}>
            <h3>
              Total de Carrito: 
            </h3>
            <p>
              Subtotal: {
                totalCarrito.costoEnvio > 100 ?
              (totalCarrito.totalPrecio - 150).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) :
              totalCarrito.totalPrecio
              .toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
              }
            </p>
            <p>
              Costo de Envio: {
                totalCarrito.costoEnvio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
              }
            </p>
            {totalCarrito.costoEnvio > 100 && 
            <span style={{display: "block", color:"#292", fontSize:"10px", textAlign:"center"}}>
              Realiza un pedido de $1,500 para tener envio GRATIS!
              </span>}
            <p>
              Total a Pagar: {totalCarrito.totalPrecio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
            </p>
            <p>
              Total de Productos: {totalCarrito.totalCantidad}
            </p>
          </div>
        </div>
          
        

        <div style={{textAlign:"center", display: loginVisible ? "none" : signupVisible ? "none" : "block"}}>
          <Button type={cartList.length===0? 'disabled':'red'} onClick={
            ()=>{
              if(direccionesVisible){
                setDireccionesVisible(false);
              } else {
                confirm("¿Seguro que quieres vaciar el carrito?") &&
                clearShoppingBag();
              }
            }}
            >{direccionesVisible?"Volver":"Vaciar Carrito"}</Button>
          <Button type={(cartList.length===0 || cartList.some(item => item.quantity > item.disponible)) ? 'disabled':'green'} 
            onClick={
              ()=>{
                if(!user){
                  setLoginVisible(true);
                }
                else if(!direccionesVisible && user){
                  setDireccionesVisible(true);
                } else {
                  if(Object.keys(direccionSelected).length === 0){
                    alert("Selecciona una direccion para continuar");
                    return;
                  }
                  handleCheckout();
                }
              }
            }
            >
            {direccionesVisible?"Ir a Pago":"Comprar Carrito"}
          </Button>
        </div>
        
      </div>
    </div>
  );
};

// ------------------ Página / screen ------------------
const ShoppingBag = () => {
  const {user} = useAuth();
  const { cartList, updateQuantity, removeFromShoppingBag, clearShoppingBag, totalCarrito } = useShoppingBag();
  const [direccionesVisible, setDireccionesVisible] = useState(false);
  const [direccionSelected, setDireccionSelected] = useState({} as Direccion);
  const [mockVisible, setMockVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);
  


  useEffect(()=>{
    console.log("Direccion seleccionada: ", direccionSelected);
  },[direccionSelected]);
  
  const cartItems = cartList.map(item => ({
    name: item.nombreProducto,
    price: item.precio,
    quantity: item.quantity,
  }));

  const handleCheckout = async () => {
    console.log("Iniciando checkout con items:", cartItems);
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // redirige al Checkout de Stripe
    } else {
      alert("Error al crear checkout");
    }
  };

  
  if (!mounted) return null;

  return (
    <div style={{ padding: '20px' }}>
      {!loginVisible && !signupVisible &&<h3 style={{marginTop:"30px", textAlign:"center"}}>{direccionesVisible?"Selecciona Direccion":"Mi Carrito"}</h3>}
        {direccionesVisible &&
        <DireccionesComponent 
          selector={true} 
          visible={direccionesVisible} 
          direccionSelected={direccionSelected} 
          setDireccionSelected={setDireccionSelected}
          setVisible={setMockVisible}
        />}
        <SignupPage visible={signupVisible} setVisible={setSignupVisible} />
        <LoginPage visible={loginVisible} setVisible={setLoginVisible} setSignupVisible={setSignupVisible} />
        <div className='ShoppingBag_product_list' 
        style={{
          display: direccionesVisible ? "none" :
                   loginVisible ? "none" :
                   signupVisible ? "none" : "block"
          }}>
          {cartList.length === 0 ? <p style={{textAlign:"center", height:"100%", alignContent:"center"}}>Carrito Vacio</p> : 
          cartList.map((item) => (
            <div key={item.contentful_product_id} className="ShoppingBagModule_card">
              {(item.quantity > item.disponible) &&
                <div className='shoppingBag_warning'>
                  <p>¡ CANTIDAD O PRODUCTO NO DISPONIBLE ! <br></br> (disponibles: {item.disponible}).</p>
                </div>
              }
              <div className="ShoppingBagModule_card-image">
                  <Image 
                      src={`https:${item.image_URL}`}
                      alt={item.nombreProducto}
                      fill
                      sizes='max-width: 100%; height: auto;'
                      style={{objectFit: "cover", borderRadius:"7px"}}
                  />
              </div>    
              <div className="ShoppingBagModule_card-content">
                  <h3>{item.modelo}</h3>
                  <p className="ShoppingBagModule_card_nombre">{item.nombreProducto}</p>
                  <p className="ShoppingBagModule_card_precio">{Number(item.precio).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                  <div className='quant_button_container'>
                    <button className='quant_button' onClick={()=>updateQuantity(item.contentful_product_id, (item.quantity) - 1)}>-</button>
                    <p>{item.quantity}</p>
                    <button className='quant_button' onClick={()=>updateQuantity(item.contentful_product_id, (item.quantity) + 1)}>+</button>
                    <Button type='closeButton' 
                      style={{position:"relative", top:"-10px"}}
                      onClick={()=>removeFromShoppingBag(item.contentful_product_id)}
                    ><Trash2 size={15}/></Button>
                  </div>
              </div>
          </div>
          ))}
          <div className='ShoppingBag_total_info' style={{display:cartList.length>0? "block": "none"}}>
            <h3>
              Total de Carrito: 
            </h3>
            <p>
              Subtotal: {
                totalCarrito.costoEnvio > 100 ?
              (totalCarrito.totalPrecio - 150).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) :
              totalCarrito.totalPrecio
              .toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
              }
            </p>
            <p>
              Costo de Envio: {
                totalCarrito.costoEnvio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
              }
            </p>
            {totalCarrito.costoEnvio > 100 && 
            <span style={{display: "block", color:"#292", fontSize:"10px", textAlign:"center"}}>
              Realiza un pedido de $1,500 para tener envio GRATIS!
              </span>}
            <p>
              Total a Pagar: {totalCarrito.totalPrecio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
            </p>
            <p>
              Total de Productos: {totalCarrito.totalCantidad}
            </p>
          </div>
        </div>
          
        

        <div style={{textAlign:"center", display: loginVisible ? "none" : signupVisible ? "none" : "block"}}>
          <Button type={cartList.length===0? 'disabled':'red'} onClick={
            ()=>{
              if(direccionesVisible){
                setDireccionesVisible(false);
                window.scrollTo({ top: 0, behavior: 'smooth' })
              } else {
                confirm("¿Seguro que quieres vaciar el carrito?") &&
                clearShoppingBag();
              }
            }}
            >{direccionesVisible?"Volver":"Vaciar Carrito"}</Button>
          <Button type={(cartList.length===0 || cartList.some(item => item.quantity > item.disponible)) ? 'disabled':'green'} 
            onClick={
              ()=>{
                if(!user){
                  setLoginVisible(true);
                }
                else if(!direccionesVisible && user){
                  setDireccionesVisible(true);
                } else {
                  if(Object.keys(direccionSelected).length === 0){
                    alert("Selecciona una direccion para continuar");
                    return;
                  }
                  handleCheckout();
                }
              }
            }
            >
            {direccionesVisible?"Ir a Pago":"Comprar Carrito"}
          </Button>
        </div>
    </div>
  );
};

export default ShoppingBag;