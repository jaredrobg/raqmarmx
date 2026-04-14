import nodemailer from 'nodemailer';

export async function POST(req : Request) {
  try {
    const { to, subject, text, html } = await req.json();

    // Configura tu transporte SMTP (por ejemplo, Gmail o tu dominio)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // tu correo
        pass: process.env.EMAIL_PASS, // tu contraseña o app password
      },
    });

    await transporter.sendMail({
      from: `"Raqmar" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    return Response.json({ success: true });
  } catch (error:unknown) {
    console.error("Error al enviar correo:", error);
    return Response.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

