import { client } from '$lib/sanity';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    // Ieškome vieno objekto, kurio slug sutampa su URL esančiu žodžiu
    const query = `*[_type == "property" && slug.current == $slug][0] {
        name,
        price,
        status,
        bedrooms,
        bathrooms,
        area,
        "mainImageUrl": mainImage.asset->url,
        "galleryUrls": gallery[].asset->url,
        description,
        rooms,
        agents[]->{
            name,
            phoneNumbers,
            email,
            "photoUrl": photo.asset->url
        }
    }`;

    // Paduodame slug kaip parametrą į Sanity
    const property = await client.fetch(query, { slug: params.slug });

    // Jei objektas nerastas (pvz. bloga nuoroda), išmetame 404 klaidą
    if (!property) {
        throw error(404, 'Property not found');
    }

    return { property };
};