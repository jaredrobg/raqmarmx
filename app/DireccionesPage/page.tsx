'use client';
import './../page.css';
import {useState, useEffect, use} from 'react';
import { Button } from '../Elements/Elements';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { Trash2 } from 'lucide-react';
import Link  from 'next/link';
import { Direccion } from '../Elements/interface';



interface DireccionesPageProps {
    selector: boolean;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    setDireccionesVisible?: (direcciones: boolean) => void;
    direccionSelected: Direccion;
    setDireccionSelected: (direccion: Direccion) => void;

}   

export default function DireccionesPage(){
        const [visible, setVisible] = useState(true);
    

    return(
        <div style={{textAlign:"center"}}>
            <div className='DireccionesPage_container' style={{display:visible? 'block':'none'}} >
                <Button type='backButton' style={{color:"#666", top:"90px"}}><Link href='/Profile'><ArrowLeft size={28}/></Link></Button>
                <h3 style={{textAlign:"center"}}>Mis Direcciones de Envio</h3>
            </div>
                <DireccionesComponent  setVisible={setVisible} visible={true} selector={false} setDireccionesVisible={function (direcciones: boolean): void {
                throw new Error('Function not implemented.');
            } } direccionSelected={{
                internal_id: 0,
                alias_direccion: '',
                calle_num: '',
                codigo_postal: '',
                entre_calle_1: '',
                entre_calle_2: '',
                estado: '',
                instrucciones_entrega: '',
                nombre: '',
                numero_telefono: '',
                pais: '',
                colonia: '',
                municipio: ''
            }} setDireccionSelected={function (direccion: Direccion): void {
                throw new Error('Function not implemented.');
            } }/>
        </div>
    )
}

export const DireccionesComponent = ({selector, visible, setVisible, setDireccionesVisible, direccionSelected, setDireccionSelected}: DireccionesPageProps)=>{
    const {user, URL} = useAuth();
    const [direcciones, setDirecciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const[visibleRegistrar, setVisibleRegistrar] = useState(false);
    const {setDireccionContext} = useAuth();


    useEffect(()=>{
        if(!user) return;
        const obtenerDirecciones = async()=>{
        setLoading(true);
        try{
            const response = await fetch(`${URL}/obtener_direcciones_raqmar.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  user_id: user?.internal_id
                }),
            });
            
            
            // const text = await response.text();
            // console.log("Respuesta del servidor:", text);

            const data = await response.json();
            if(data.success){
                setDirecciones(data.direcciones);
                setLoading(false);
                console.log("Direcciones obtenidas:", data.direcciones);
            } else{
                setDirecciones([]);
                console.log("Error obteniendo direcciones: " + data.message);
                setLoading(false);
            }
        } catch(err){
            console.log("Error de red: " + err);
            setLoading(false);
        }
    }
    
    obtenerDirecciones();
    },[user, visibleRegistrar]);


    const handleDelete = async (dirreccionID: number)=>{
        if(!user) return;
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar esta dirección?");
        if(!confirmDelete) return;
        try{
            const response = await fetch(`${URL}/eliminar_direccion_raqmar.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  user_id: user.internal_id,
                  direccion_id: dirreccionID
                }),
            });
            const data = await response.json();
            if(data.success){
                alert("Direccion eliminada con exito!");
                // Actualizar la lista de direcciones
                setDirecciones(direcciones.filter((dir:Direccion) => dir.internal_id !== dirreccionID));
            } else{
                alert("Error eliminando direccion: " + data.message);
                console.log("Error eliminando direccion: " + data.message);
            }
        } catch(err){
            alert("Error de red: " + err);
            console.log("Error de red: " + err);
        }
    }


    return(
        <div className='Direcciones_Component' >
        <div style={{display: visible ? visibleRegistrar?"none": "block": "none", marginBottom:"50px"}} >
            {loading ? (
                <p className='direcciones_not_loaded'>Cargando...</p>
            ): (
                direcciones.length === 0 ? (
                    <p className='direcciones_not_loaded'>No tienes direcciones guardadas.</p>
                ): (
                    direcciones.map((direccion:Direccion)=>(
                        <div key={direccion.internal_id} className='direccion_card' 
                        style={{border: selector && direccionSelected.internal_id === direccion.internal_id ? "2px solid #A8FC79": "1px solid #ccc"}}
                        // onClick={()=>{
                        //     if(selector){
                        //         setDireccionSelected(direccion);
                        //         setDireccionContext(direccion);
                        //     }else{
                        //     }
                        // }}
                        >
                            <h4>{direccion.alias_direccion}</h4>
                            <div className='direccion_card_info'>
                                <p className='direccion_card_content'><b>{direccion.nombre}</b></p>
                                <p className='direccion_card_content'>{direccion.calle_num}</p>
                                <p className='direccion_card_content'>{direccion.colonia.toUpperCase()}</p>
                                <p className='direccion_card_content'>
                                    {direccion.municipio.toUpperCase()}, {direccion.estado.toUpperCase()}, {direccion.codigo_postal}
                                </p>
                                <p className='direccion_card_content'>{direccion.pais}</p>
                                <p className='direccion_card_content'>Numero de Telefono: {direccion.numero_telefono}</p>
                            </div>
                            <button onClick={()=>{
                                if(selector){
                                    setDireccionSelected(direccion);
                                    setDireccionContext(direccion);
                                }else{
                                handleDelete(direccion.internal_id);
                                }
                                }}>
                                {selector?"Seleccionar":<Trash2 size={20} strokeWidth={1}/>}
                            </button>
                        </div>
                    ))
                )
            )}
            
        <Button type='primary' style={{width:"180px", marginTop:"40px"}} onClick={()=>{
            setVisible(false);
            setVisibleRegistrar(true);
            if(!selector)window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>
            + Añadir Nueva Direccion
        </Button>
        
           
        </div>
         <RegistrarDireccion visible={visibleRegistrar} setVisibleRegistrar={setVisibleRegistrar} setVisible={setVisible}/>
        </div>
    )
}

export const RegistrarDireccion = ({
    visible,
    setVisible,
    setVisibleRegistrar
}: {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    setVisibleRegistrar: (visible: boolean) => void
})=>{
    const {user, URL} = useAuth();

    const [alias, setAlias] = useState('');
    const [pais, setPais] = useState('México');
    const [paisInput, setPaisInput] = useState('México');
    const [paisesFiltrados, setPaisesFiltrados] = useState<string[]>([]);

    const [nombreCompleto, setNombreCompleto] = useState('');
    const [estado, setEstado] = useState('');
    const [calle, setCalle] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [telefono, setTelefono] = useState('');
    const [entreCalle1, setEntreCalle1] = useState('');
    const [entreCalle2, setEntreCalle2] = useState('');
    const [instrucciones, setInstrucciones] = useState('');
    const [colonia, setColonia] = useState('');
    const [municipio, setMunicipio] = useState('');

    const [colonias, setColonias] = useState<string[]>([]);
    const [loadingCP, setLoadingCP] = useState(false);

    const paises = ["México", "Estados Unidos", "Colombia", "Argentina", "España"];

    const isMexico = pais === "México";

    const isValid = alias && pais && nombreCompleto && calle && codigoPostal && telefono;

    // Autocomplete país
    useEffect(() => {
        if (!paisInput) return setPaisesFiltrados([]);

        const filtrados = paises.filter(p =>
            p.toLowerCase().startsWith(paisInput.toLowerCase())
        );

        setPaisesFiltrados(filtrados);
    }, [paisInput]);

    // Solo México usa API de CP
    useEffect(() => {
        if (!isMexico || codigoPostal.length !== 5) return;

        const fetchCP = async () => {
            setLoadingCP(true);
            try {
                const res = await fetch(`https://sepomex.icalialabs.com/api/v1/zip_codes?zip_code=${codigoPostal}`);
                const data = await res.json();

                if (data.zip_codes.length > 0) {
                    const info = data.zip_codes[0];

                    setEstado(info.d_estado);
                    setMunicipio(info.d_mnpio);

                    const coloniasList = data.zip_codes.map((c:any)=>c.d_asenta);
                    setColonias(coloniasList);
                } else {
                    setColonias([]);
                }
            } catch (err) {
                console.log(err);
            }
            setLoadingCP(false);
        };

        fetchCP();
    }, [codigoPostal, isMexico]);

    const handleBack = ()=>{
        setVisible(true);
        setVisibleRegistrar(false);

        setAlias('');
        setPais('');
        setPaisInput('');
        setNombreCompleto('');
        setEstado('');
        setCalle('');
        setCodigoPostal('');
        setTelefono('');
        setEntreCalle1('');
        setEntreCalle2('');
        setInstrucciones('');
        setColonia('');
        setMunicipio('');
        setColonias([]);
    }

    const handleRegistro = async()=>{
        if(!isValid) return;

        const direccion ={
            alias,
            pais,
            nombreCompleto,
            estado,
            calle,
            codigoPostal,
            telefono,
            entreCalle1,
            entreCalle2,
            instrucciones,
            colonia,
            municipio
        }

        const response = await fetch(`${URL}/registrar_direccion_raqmar.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user?.internal_id,
                direccion
            }),
        });

        const data = await response.json();
        if(data.success){
            alert("Direccion registrada con exito!");
            handleBack();
        } else{
            alert("Error: " + data.message);
        }
    }

    return(
        <div className='RegistrarDireccion_container' style={{display: visible ? "block": "none"}}>

            <Button type='backButton' onClick={handleBack}>
                <ArrowLeft size={30}/>
            </Button>

            <h3>Registrar Direccion</h3>

            <form  className='RegistrarDireccion_form' onSubmit={(e)=>{ e.preventDefault(); handleRegistro();}}>

                <label>Alias*</label>
                <input className='input-text' value={alias} onChange={(e)=>setAlias(e.target.value)} />

                {/* PAIS */}
                <label>Pais*</label>
                <div style={{position:'relative'}}>
                    <input
                        className='input-text'
                        style={{width: "80%"}}
                        value={paisInput}
                        onChange={(e)=>setPaisInput(e.target.value)}
                        placeholder="Escribe país"
                    />

                    {paisesFiltrados.length > 0 && (
                        <div className="dropdown" >
                            {paisesFiltrados.map((p, i)=>(
                                <div key={i} onClick={()=>{
                                    setPais(p);
                                    setPaisInput(p);
                                    setPaisesFiltrados([]);
                                }}>
                                    {p}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/*  MÉXICO */}
                {isMexico ? (
                    <>
                        <label>Codigo Postal*</label>
                        <input 
                            className='input-text'
                            value={codigoPostal}
                            onChange={(e)=>setCodigoPostal(e.target.value)}
                        />

                        {loadingCP && <p>Cargando datos...</p>}

                        <label>Estado</label>
                        <input className='input-text' value={estado} disabled />

                        <label>Municipio</label>
                        <input className='input-text' value={municipio} disabled />

                        <label>Colonia</label>
                        {colonias.length > 0 ? (
                            <select
                                className='input-text'
                                value={colonia}
                                onChange={(e)=>setColonia(e.target.value)}
                            >
                                <option value="">Selecciona colonia</option>
                                {colonias.map((col, i)=>(
                                    <option key={i} value={col}>{col}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                className='input-text'
                                value={colonia}
                                onChange={(e)=>setColonia(e.target.value)}
                                placeholder="Colonia"
                            />
                        )}
                    </>
                ) : (
                    <>
                        {/* INTERNACIONAL */}
                        <label>Estado / Provincia*</label>
                        <input className='input-text' value={estado} onChange={(e)=>setEstado(e.target.value)} />

                        <label>Ciudad / Municipio*</label>
                        <input className='input-text' value={municipio} onChange={(e)=>setMunicipio(e.target.value)} />

                        <label>Codigo Postal*</label>
                        <input className='input-text' value={codigoPostal} onChange={(e)=>setCodigoPostal(e.target.value)} />

                        <label>Colonia / Región</label>
                        <input className='input-text' value={colonia} onChange={(e)=>setColonia(e.target.value)} />
                    </>
                )}

                {/* COMUNES */}
                <label>Nombre De Destinatario*</label>
                <input className='input-text' value={nombreCompleto} onChange={(e)=>setNombreCompleto(e.target.value)} />

                <label>Calle*</label>
                <input className='input-text' value={calle} onChange={(e)=>setCalle(e.target.value)} />

                <label>Telefono*</label>
                <input className='input-text' value={telefono} onChange={(e)=>setTelefono(e.target.value)} />

                <label>Entre Calles</label>
                <div  className='RegistrarDireccion_entreCalles'>
                    <input className='input-text' value={entreCalle1} onChange={(e)=>setEntreCalle1(e.target.value)} />
                    <input className='input-text' value={entreCalle2} onChange={(e)=>setEntreCalle2(e.target.value)} />
                </div>

                <label>Instrucciones</label>
                <textarea className='input-text'
                    value={instrucciones}
                    onChange={(e)=>setInstrucciones(e.target.value)}
                />

                <Button type={isValid ? 'submit' : 'disabled'}>
                    Guardar Direccion
                </Button>

            </form>
        </div>
    )
}