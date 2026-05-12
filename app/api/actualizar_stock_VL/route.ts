import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const { entryId, cantidad } = await req.json();

    const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!;
    const environmentId =
        process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID || "master";

    const accessToken =
        process.env.NEXT_PUBLIC_CONTENTFUL_MANAGEMENT_TOKEN!;

    // obtener entry
    const entryRes = await fetch(
        `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type":
                    "application/vnd.contentful.management.v1+json",
            },
        }
    );

    const entry = await entryRes.json();

    // actualizar cantidad
    entry.fields.cantidad["en-US"] = cantidad;

    // guardar
    const updateRes = await fetch(
        `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type":
                    "application/vnd.contentful.management.v1+json",
                "X-Contentful-Version": entry.sys.version,
            },
            body: JSON.stringify(entry),
        }
    );

    const updated = await updateRes.json();

    // publicar
    await fetch(
        `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries/${entryId}/published`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-Contentful-Version": updated.sys.version,
            },
        }
    );

    return NextResponse.json({
        success: true
    });
}