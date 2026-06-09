// app/api/cp/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const cp = req.nextUrl.searchParams.get('cp');
    if (!cp) return NextResponse.json({ error: 'CP requerido' }, { status: 400 });

    try {
        const res = await fetch(`https://api.zippopotam.us/mx/${cp}`);
        if (!res.ok) throw new Error('CP no encontrado');

        const data = await res.json();
        console.log('Zippopotam response:', JSON.stringify(data, null, 2));

        // data.places puede tener múltiples entradas — una por colonia
        const places = data.places || [];

        return NextResponse.json({
            response: {
                estado: places[0]?.['state'] || '',
                municipio: '', // zippopotam no da municipio, el usuario lo escribe
                asentamiento: places.map((p: any) => p['place name']), // ["Victoria"]
            }
        });

    } catch (err) {
        return NextResponse.json({ error: 'CP no encontrado' }, { status: 404 });
    }
}