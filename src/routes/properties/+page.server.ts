import { client } from '$lib/sanity';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // Paimame visus objektus, surikiuotus nuo naujausio
    const query = `*[_type == "property"] | order(_createdAt desc) {
        name,
        location,
        price,
        status,
        bedrooms,
        bathrooms,
        area,
        "imageUrl": mainImage.asset->url,
        "slug": slug.current,
        cardDisplayType,
        cardCustomBuilder,
        agents[]->{ name, "photoUrl": photo.asset->url }
    }`;

    const properties = await client.fetch(query);
    return { properties };
};