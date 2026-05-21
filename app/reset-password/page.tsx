'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

export default function ResetPasswordPage(){

    const searchParams = useSearchParams();

    const router = useRouter();

    const token = searchParams.get('token');

    const {URL} = useAuth();

    const [password, setPassword] = useState('');

    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState(false);

    const handleSubmit = async ()=>{

        if(password.length < 8){

            alert('La contraseña debe tener mínimo 8 caracteres');

            return;
        }

        if(password !== confirmPassword){

            alert('Las contraseñas no coinciden');

            return;
        }

        setLoading(true);

        try{

            const response = await fetch(`${URL}/reset_password.php`,{

                method:'POST',

                headers:{
                    'Content-Type':'application/json'
                },

                body: JSON.stringify({
                    token,
                    password
                })

            });

            const data = await response.json();

            if(data.success){

                setSuccess(true);

                setTimeout(()=>{

                    router.push('/ProfilePage');

                },2500);

            }else{

                alert(data.message);
            }

        }catch(error){

            alert('Error actualizando contraseña');

        }finally{

            setLoading(false);
        }
    }

    return(

        <div
            style={{
                minHeight:'100vh',
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                background:'linear-gradient(to bottom right,#f5f5f5,#ececec)',
                padding:'20px'
            }}
        >

            <div
                style={{
                    width:'100%',
                    maxWidth:'420px',
                    background:'#fff',
                    borderRadius:'24px',
                    padding:'40px 30px',
                    boxShadow:'0 10px 30px rgba(0,0,0,0.08)',
                    display:'flex',
                    flexDirection:'column',
                    gap:'18px'
                }}
            >

                {!success ? (

                    <>

                        <div
                            style={{
                                width:'70px',
                                height:'70px',
                                borderRadius:'50%',
                                background:'#000',
                                display:'flex',
                                justifyContent:'center',
                                alignItems:'center',
                                margin:'0 auto'
                            }}
                        >
                            <Lock color='#fff' size={30} />
                        </div>

                        <div style={{textAlign:'center'}}>

                            <h1
                                style={{
                                    fontSize:'28px',
                                    marginBottom:'10px'
                                }}
                            >
                                Nueva contraseña
                            </h1>

                            <p
                                style={{
                                    color:'#666',
                                    fontSize:'14px',
                                    lineHeight:'22px'
                                }}
                            >
                                Ingresa tu nueva contraseña para continuar.
                            </p>

                        </div>

                        <div
                            style={{
                                display:'flex',
                                flexDirection:'column',
                                gap:'8px'
                            }}
                        >

                            <label>Nueva contraseña</label>

                            <input
                                type='password'
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                placeholder='********'
                                style={{
                                    padding:'14px',
                                    borderRadius:'12px',
                                    border:'1px solid #ddd',
                                    outline:'none'
                                }}
                            />

                        </div>

                        <div
                            style={{
                                display:'flex',
                                flexDirection:'column',
                                gap:'8px'
                            }}
                        >

                            <label>Confirmar contraseña</label>

                            <input
                                type='password'
                                value={confirmPassword}
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                                placeholder='********'
                                style={{
                                    padding:'14px',
                                    borderRadius:'12px',
                                    border:'1px solid #ddd',
                                    outline:'none'
                                }}
                            />

                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                background:'#000',
                                color:'#fff',
                                border:'none',
                                borderRadius:'14px',
                                padding:'14px',
                                fontSize:'15px',
                                fontWeight:600,
                                cursor:'pointer',
                                marginTop:'10px'
                            }}
                        >
                            {loading ? 'Actualizando...' : 'Cambiar contraseña'}
                        </button>

                    </>

                ) : (

                    <div
                        style={{
                            display:'flex',
                            flexDirection:'column',
                            alignItems:'center',
                            gap:'15px',
                            textAlign:'center'
                        }}
                    >

                        <CheckCircle
                            size={70}
                            color='green'
                        />

                        <h2>
                            Contraseña actualizada
                        </h2>

                        <p
                            style={{
                                color:'#666',
                                lineHeight:'22px'
                            }}
                        >
                            Tu contraseña fue actualizada exitosamente.
                        </p>

                    </div>

                )}

            </div>

        </div>
    )
}