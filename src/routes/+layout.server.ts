import { client } from '$lib/sanity';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
    // Paimame patį pirmą (ir vienintelį) siteSettings dokumentą
    const query = `*[_type == "siteSettings"][0] { mainNav }`;
    const settings = await client.fetch(query);
    
    return { settings };
};