'use client';

import { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {

    const { URL } = useAuth();

    const [email, setEmail] = useState('');

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {

        if (!email) return;

        setLoading(true);

        try {

            const response = await fetch(`${URL}/forgot_password.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
            } else {
                alert(data.message);
            }

        } catch (error) {

            alert('Error enviando correo');

        } finally {

            setLoading(false);
        }
    };

    return (

        <div
            style={{
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(to bottom right, #f5f5f5, #e9e9e9)',
                padding: '20px'
            }}
        >

            <div
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '40px 30px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                    position: 'relative'
                }}
            >

                <Link
                    href="/ProfilePage"
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '13px',
                        color: '#555',
                        textDecoration: 'none'
                    }}
                >
                    <ArrowLeft size={16} />
                    Volver
                </Link>

                <div
                    style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: '#000',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '20px auto 10px auto'
                    }}
                >
                    <Mail color="#fff" size={30} />
                </div>

                <div
                    style={{
                        textAlign: 'center'
                    }}
                >

                    <h1
                        style={{
                            fontSize: '28px',
                            marginBottom: '10px',
                            color: '#111'
                        }}
                    >
                        Recuperar contraseña
                    </h1>

                    <p
                        style={{
                            color: '#666',
                            fontSize: '14px',
                            lineHeight: '22px'
                        }}
                    >
                        Ingresa tu correo electrónico y te enviaremos
                        un enlace para restablecer tu contraseña.
                    </p>

                </div>

                {!success ? (

                    <>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}
                        >

                            <label
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#333'
                                }}
                            >
                                Correo electrónico
                            </label>

                            <input
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='ejemplo@correo.com'
                                style={{
                                    padding: '14px',
                                    borderRadius: '12px',
                                    border: '1px solid #ddd',
                                    outline: 'none',
                                    fontSize: '15px'
                                }}
                            />

                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                background: '#000',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '14px',
                                padding: '14px',
                                fontSize: '15px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginTop: '10px',
                                opacity: loading ? 0.7 : 1,
                                transition: '0.2s'
                            }}
                        >
                            {loading ? 'Enviando...' : 'Enviar enlace'}
                        </button>
                    </>

                ) : (

                    <div
                        style={{
                            background: '#f5f5f5',
                            borderRadius: '14px',
                            padding: '18px',
                            textAlign: 'center',
                            marginTop: '10px'
                        }}
                    >

                        <h3
                            style={{
                                marginBottom: '10px',
                                color: '#111'
                            }}
                        >
                            ¡Correo enviado!
                        </h3>

                        <p
                            style={{
                                fontSize: '14px',
                                color: '#555',
                                lineHeight: '22px'
                            }}
                        >
                            Revisa tu bandeja de entrada y sigue las
                            instrucciones para cambiar tu contraseña.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
}