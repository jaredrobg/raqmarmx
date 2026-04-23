'use client';
import './../page.css';
import Header from '../Components/Header';
import { useAuth } from '../Context/AuthContext';
import { useShoppingBag } from '../Context/ShoppingBagContext';
import { useEffect, useState } from 'react';
import { Button, LogginButton } from '../Elements/Elements';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ListasPage from '../ListasPage/page';

interface pageProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}



const SignupPage = ({visible, setVisible}: pageProps) =>{
    const {user, login, URL} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [telefono, setTelefono] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const [touched, setTouched] = useState(false);

    const isValid ={
        name: name.trim().length > 0 ? true : false,
        lastname: lastname.trim().length > 0 ? true : false,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)? true : false,
        telefono: telefono.trim().length > 9,
        password : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password) ? true : false,
        passwordMessage: touched ? /^.{8,}$/.test(password)? 
            /(?=.*[a-z])/.test(password)? 
            /(?=.*[A-Z])/.test(password)? 
            /(?=.*\d)/.test(password)?  '': 'La contraseña debe tener al menos un numero' :
             'La contraseña debe tener al menos una mayuscula' : 
             'La contraseña debe tener al menos una minuscula' :
             'La contraseña debe tener al menos 8 caracteres' :'',
        confirmPassword: password === confirmPassword ? true: false,
        cfMessage: touched ? password === confirmPassword ? '': 'Las Contraseñas deben Coincidir' : '',
    }

    const isDisabled = !(isValid.name && isValid.lastname && isValid.email && isValid.password && isValid.confirmPassword &&isValid.telefono); 


    const enviarCorreo = async(userEmail:string, userName: string)=>{
        await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                to: userEmail,
                subject: "¡Bienvenido a Raqmar!",
                html: `
                <h1>¡Gracias por registrarte, ${userName}!</h1>
                <p>Tu cuenta ha sido creada exitosamente.</p>
                `,
            }),
            });

    }

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>)=>{
        e.preventDefault();
         const response  = await fetch(`${URL}/registrar_usuario_raqmar.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"  
                },
                body: JSON.stringify({
                    name: name.trim(),
                    lastname: lastname.trim(),
                    email: email.trim(),
                    password: password.trim(),
                    telefono: telefono.trim()
                })
            });
            const data = await response.json();
            
            if (data.success){
                alert(data.message);
                console.log(data);
                enviarCorreo(data.email, `${data.name} ${data.lastname}`);
                login(data);
                setEmail("");
                setPassword("");
                setName("");
                setLastname("");
                setTelefono("");
                setConfirmPassword("");
                setVisible(false);
            } else {
                alert("error en registro: "+ data.message);
            }
    }
    
    return(
            <div className='module_form_container signup ' style={visible? {display:"flex"}:{display:"none"}}>
                <form className='signup_form'>
                    <div className='signup_form_div'>
                        <label >Nombre: </label>
                        <input style={isValid.name ?{outlineColor: "#07E822"}:{} }
                            className='input-text'
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            type='text'
                        ></input>
                        <label >Apellido:</label>
                        <input style={isValid.lastname ?{outlineColor: "#07E822"}:{} }
                            className='input-text'
                            value={lastname}
                            onChange={(e)=>setLastname(e.target.value)}
                            type='text'
                        ></input>
                    </div>
                    <label >Correo Electronico:</label>
                    <input style={isValid.email ?{outlineColor: "#07E822"}:{} }
                        className='input-text'
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        type='email'
                    ></input>
                    <label >Numero de Telefono:</label>
                    <input style={isValid.telefono ?{outlineColor: "#07E822"}:{} }
                        className='input-text'
                        value={telefono}
                        onChange={(e)=>setTelefono(e.target.value)}
                        type='text'
                    ></input>
                    <label >Contraseña:</label>
                    <span className='message_span'>{isValid.passwordMessage}</span>
                    <input style={isValid.password ?{outlineColor: "#07E822"}:{} }
                        className='input-text'
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        type={showPassword ? 'text':'password'}
                        onBlur={()=>setTouched(true)}
                    ></input>
                    <span className='pass_icon' onClick={()=>setShowPassword(!showPassword)}><Eye /></span> 
                    <label >Confirmar Contraseña:</label>
                    <span className='message_span'>{isValid.cfMessage}</span>
                    <input style={isValid.confirmPassword ?{outlineColor: "#07E822"}:{} }
                        className='input-text'
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        type={showPassword ? 'text':'password'}
                        onBlur={()=>setTouched(true)}
                    ></input>
                    <span className='pass_icon' onClick={()=>setShowPassword(!showPassword)}><Eye /></span>
                    <div style={{display:"flex", flexDirection:"row", margin:"auto"}}>
                        <Button type='secondary' style={{width:"90px"}} onClick={(e: React.FormEvent<HTMLButtonElement>)=>{
                            e.preventDefault();
                            setVisible(!visible);
                            }}>Volver</Button>
                        <Button 
                            type={isDisabled ? 'disabled':'submit'} 
                            disabled={isDisabled} style={{width:"90px"}} 
                            onClick={(e: React.FormEvent<HTMLButtonElement>) => handleSubmit(e)}
                            >
                                Registrarme
                            </Button>
                    </div>    
                </form>
            </div>
    )
}




const LoginPage = ({visible, setVisible, setSignupVisible}: {visible: boolean, setVisible: (visible: boolean) => void, setSignupVisible: (visible: boolean) => void})=>{
    const {user, login, URL} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    const isDisabled = password.trim().length < 4 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 

    const handleSubmit= async (e: React.FormEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        const response  = await fetch(`${URL}/validar_raqmar.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"  
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password.trim()
                })
            });
            const data = await response.json();
            
            if (data.success){
                console.log(data);
                login(data);
                setEmail("");
                setPassword("");
                setVisible(false);
            } else {
                alert("error en login! "+ data.message);
            }
    }
    
    return(
            <div className='module_form_container login' style={visible? {display:"flex"}:{display:"none"}}>
                
                <h3>Iniciar Sesion</h3>
                <form className='login_form'>
                    <label >Correo Electronico:</label>
                    <input 
                        className='input-text'
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        type='email'
                    ></input>
                    <label >Contraseña:</label>
                    <input 
                        className='input-text'
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        type={showPassword?'text':'password'}
                    ></input>
                    <span onClick={()=>setShowPassword(!showPassword)} 
                    style={{fontSize:"11px", paddingLeft:"10px", marginTop:"-5px", color:"#229", cursor:"pointer"}}
                        >{showPassword? 'Ocultar Contraseña': 'Mostrar Contraseña'}
                    </span>
                    <div style={{display:"flex", flexDirection:"row"}}>
                        <Button type='secondary' style={{width:"90px"}} onClick={(e: React.FormEvent<HTMLButtonElement>)=>{
                            e.preventDefault();
                            setVisible(!visible);
                        }
                        }>Volver</Button>
                        <Button type={isDisabled ? 'disabled':'submit'} disabled={isDisabled} style={{width:"90px"}} onClick={handleSubmit}>Login</Button>
                    </div>    
                </form>
                 <p style={{margin: "0px auto", textAlign:"center"}}>No tienes cuenta?</p>
                 <p style={{margin: "0px auto", textAlign:"center", color:"#00f"}} 
                 onClick={()=> {setSignupVisible(true); setVisible(false)}}>Registrarme</p>
                
                
            </div>
    );
}



const ProfilePage = ()=>{
    const router = useRouter();
    const {user, logout, logoutConfirmed} = useAuth();
    const [loginVisible, setLoginVisible] = useState(false);
    const [signupVisible, setSignupVisible] = useState(false);
    const {clearShoppingBag} = useShoppingBag();
    
    
    const cerrarSesion = ()=>{
        logout();
    }
    
    useEffect(()=>{
        if(logoutConfirmed){
            clearShoppingBag();
        }
    },[logoutConfirmed]);
    
    return(
        <div>
            {user ? 
                <div className='ProfilePage_render'>
                    <h3 style={{margin:"auto", textAlign:"center", fontFamily:"Ninuto Sans", fontSize:"22px"}}>Bienvenido de nuevo {user.name}!</h3>
                    <p style={{margin:"auto", textAlign:"center", fontSize:"11px"}}>ID de Usuario: {user.internal_id}</p>

                    <nav className='ProfilePage_nav_section'>
                        <ul className='ProfilePage_nav_list'>
                            <Link href='/ShoppingBag' className='ProfilePage_nav_option'><span></span>Mi Carrito</Link>
                            <Link href='/Pedidos' className='ProfilePage_nav_option'><span></span>Mis Pedidos</Link>
                            <li onClick={()=>router.push(`/Enviados_Entregados?filter=ENTREGADO`)} className='ProfilePage_nav_option'><span></span>Entregados</li>
                            <li onClick={()=>router.push(`/Enviados_Entregados?filter=ENVIADO`)} className='ProfilePage_nav_option'><span></span>Enviados</li>
                            <Link href='/DireccionesPage' className='ProfilePage_nav_option'><span></span>Direcciones de Envio</Link>
                            <Link href='/ComprarNuevamentePage' className='ProfilePage_nav_option'><span></span>Comprar de Nuevo</Link>
                            {/* <Link href='/ListasPage' style={{textAlign:'center', margin:"auto", color:"#666", gridColumn:"2/3"}}><span></span>Listas</Link> */}
                        </ul>
                    </nav>

                    <div style={{textAlign:"center", marginTop:"100px"}}>
                        <Button onClick={cerrarSesion} type='red'>Cerrar Sesion</Button>
                    </div>
                    <ListasPage />
                    
                </div>
             :
                <div className='loginPage_render'>
                    <div className='modulo' style={!loginVisible && !signupVisible? {display:"flex"}:{display:"none"}}>
                        <h3 >¡Bienvenido!</h3>
                        <p style={{margin:"10px 20px 20px 20px"}}>UNA FORMA MAS FACIL DE MANEJAR TUS PEDIDOS!</p>
                        <p>ERES NUEVO?</p>
                        <Button type='azul2' onClick={()=>setSignupVisible(true)}>Registrarme</Button>
                        <p>YA TIENES CUENTA?</p>
                        <Button type='primary' onClick={()=>setLoginVisible(true)}>Iniciar Sesion</Button>
                    </div>
                    <SignupPage visible={signupVisible} setVisible={setSignupVisible} />
                    <LoginPage visible={loginVisible} setVisible={setLoginVisible} setSignupVisible={setSignupVisible} />
                </div>
            }
        </div>
    )
}

export default ProfilePage;

export {LoginPage, SignupPage};