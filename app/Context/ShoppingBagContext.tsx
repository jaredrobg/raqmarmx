'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { useAuth } from "./AuthContext";
import { client } from "../lib/contentful";
import { PedidoItem } from "../Elements/interface";


interface totalCarrito {
  totalPrecio: number;
  totalCantidad: number;
  costoEnvio: number;
};

interface ShoppingBagContextType {
  cartList: PedidoItem[];
  addToShoppingBag: (data: PedidoItem) => void;
  removeFromShoppingBag: (id: string) => void;
  clearShoppingBag: () => void;
  updateQuantity: (id: string, quantity: number)=>void;
  totalCarrito: totalCarrito;
  discountedTotal: number;
  setGlobalDiscount: (discount: number) => void;
};

const ShoppingBagContext = createContext<ShoppingBagContextType | undefined>(undefined);

export const ShoppingBagProvider = ({ children }: { children: ReactNode }) => {
  const [cartList, setCartList] = useState<PedidoItem[]>([]);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const {user, URL} =useAuth();

  // Cargar carrito del cache al montar
  useEffect(() => {
    if(user) return;
      const storedCart = sessionStorage.getItem("cart");
      if (storedCart) setCartList(JSON.parse(storedCart));  
  }, []);

   useEffect(() => {
        
        const obtenerDescuento = async () => {
            
            try {
                const res = await fetch(`${URL}/obtener_descuento.php`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        descuento_name: "descuento_Global"
                    })
                });
                const data = await res.json();
                if (data.success) {
                    setGlobalDiscount(data.descuento);
                }else{
                    console.log("Error obteniendo descuento:", data.message);
                }
            } catch (err) {
                console.error(err);
            }
        };

        obtenerDescuento();
    }, []);

  useEffect(()=>{
    if(!user) return;

    const handler = setTimeout( async ()=>{

      const getCartItems = async()=>{
        try{
          const response = await fetch(`${URL}/obtener_carrito_raqmar.php`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: user.internal_id
              }),
            });

            const data = await response.json();
            if (data.success) {
              setCartList(data.cart);
              // console.log("Carrito obtenido:", data.cart);
            } else {
              console.log("Error obteniendo carrito:", data.message);
              // const storedCart = sessionStorage.getItem("cart");
              // if (storedCart) setCartList(JSON.parse(storedCart));  
            }
          } catch (err) {
            console.error("Error de red:", err);
          }
      }
      getCartItems();

    }, 400)

    return () => clearTimeout(handler);
  },[user]);
  

  useEffect(() => {
    if (!user) return;

    const handler = setTimeout(async () => {

      const updatedCart = await Promise.all(
        cartList.map(async (item: PedidoItem) => {
          try {
            const entry: {fields: PedidoItem} = await client.getEntry(item.contentful_product_id);
            return {
              ...item,
              disponible: entry?.fields?.cantidad, // 👈 agrega el campo
            };
          } catch (err) {
            console.error("Error obteniendo producto:", err);
            return { ...item, disponible: 0 };
          }
        })
      );

      try {
        const response = await fetch(`${URL}/registrar_carrito_raqmar.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.internal_id, cart: updatedCart }),
        });
        const data = await response.json();
        if (!data.success) console.error("Error carrito:", data.message);
      } catch (err) {
        console.error(err);
      }
    }, 500); // espera 500ms después del último cambio

    return () => clearTimeout(handler); // limpiar timeout si cartList cambia antes
  }, [cartList, user]);



  

  const addToShoppingBag = (data: PedidoItem) => {

    // console.log("producto a carrito:", data);
    // Verificar si el producto ya existe
    const exists = cartList.some(
      (item) => item.contentful_product_id === data.contentful_product_id
    );

    let updatedCart;
    if (exists) {
      // Si existe, incrementamos la cantidad
      updatedCart = cartList.map((item) =>
        item.contentful_product_id === data.contentful_product_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Si no existe, simplemente lo añadimos tal cual
      updatedCart = [...cartList, data];
    }

    setCartList(updatedCart);

    syncStorage(updatedCart);
  };


  const syncStorage = (updatedCart: PedidoItem[]) => {
    setCartList(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromShoppingBag = (id: string) => {
    const updatedCart = cartList.filter(item => item.contentful_product_id !== id);
    syncStorage(updatedCart);
  };

  const clearShoppingBag = () => {
    syncStorage([]);
  };

  const updateQuantity = (id: string, quantity: number) => {
    const updatedCart = cartList.map(item =>
      item.contentful_product_id === id ? { ...item, quantity: quantity < 1 ? 1 : quantity } : item
    );
    syncStorage(updatedCart);
  };

  const totalCarrito = cartList.reduce((acc, item)=> {
    acc.totalCantidad += item.quantity;
    acc.totalPrecio += Number(item.precio) * item.quantity;
    return acc;
  }, { totalCantidad: 0, totalPrecio: 0, costoEnvio: 0 });

  if (totalCarrito.totalPrecio < 2000) {
    totalCarrito.totalPrecio += 200; // costo de envío
    totalCarrito.costoEnvio = 200;
  } else {
    totalCarrito.costoEnvio = 0;
  }

  
  const discountedTotal = (1 - globalDiscount / 100);

  return (
    <ShoppingBagContext.Provider value={{ cartList, addToShoppingBag, removeFromShoppingBag, clearShoppingBag, updateQuantity, totalCarrito, discountedTotal, setGlobalDiscount }}>
      {children}
    </ShoppingBagContext.Provider>
  );
};

// Hook para usar el carrito desde cualquier componente
export const useShoppingBag = () => {
  const context = useContext(ShoppingBagContext);
  if (!context) throw new Error("useShoppingBag debe usarse dentro de ShoppingBagProvider");
  return context;
};
