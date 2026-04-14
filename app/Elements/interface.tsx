import { Entry } from "contentful";
import { ProductoFields } from "../lib/contentful";

export interface PedidoItem {
    added_at: string;
    contentful_product_id: string;
    disponible: number;
    estatus_pedido: string;
    image_URL: string | undefined;
    modelo: string;
    nombreProducto: string;
    precio: number;
    quantity: number;
    order_date: string;
    user_id: number;
    cantidad: number;
}
export interface PedidoDB{
    internal_id: number;
    pedido_id: string;
    fecha_compra: string;
    contentful_product_id: string;
    disponible: number;
    calle_envio: string;
    colonia: string;
    codigo_postal: string;
    municipio: string;
    estado: string;
    estatus_pedido: string;
    image_url: string;
    modelo: string;
    nombre_producto: string;
    precio: number;
    quantity: number;
    order_date: string;
    user_id: number;
}

export interface HomePageProps {
  productos: Entry<ProductoFields>[];
}
export interface Direccion {
    internal_id: number;
    alias_direccion: string;
    calle_num: string;
    codigo_postal: string;
    entre_calle_1: string;
    entre_calle_2: string;
    estado: string;
    instrucciones_entrega: string;
    nombre: string;
    numero_telefono: string;
    pais: string;
    colonia: string;
    municipio: string;
}

export interface Producto {
    fields: {
        modelo: string;
        nombre: string;
        marca: string;
        cantidad: number;
        descripcion: string;
        temporada: string;
        categoria: string;
        color: string;
        material: string;
        precio: number;
        imagen?: {
            fields: {
            file: {
                url: string;
            };
            };
        };
        contentful_product_id: string;
        quantity: number;
    }
}