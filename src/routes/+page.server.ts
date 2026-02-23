import { client } from '$lib/sanity';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const query = `{
        "home": *[_type == "homePage"][0] {
          heroSubtitle, heroTitleNormal, heroTitleHighlight,
          pricingSubtitle, pricingTitle, pricingDesc, marketFeePercent, oakFeePercent, oakFeeBase,
          portfolioTitle, portfolioDesc,
          contactTitle, contactDesc
        },
        "properties": *[_type == "property" && showOnHome == true] {
                name,
                price,
                status,
                "imageUrl": mainImage.asset->url,
                "slug": slug.current,
                cardDisplayType,
                cardCustomBuilder,
                bedrooms,
                bathrooms,
                area,
                agents[]->{ name, phoneNumbers, "photoUrl": photo.asset->url }
            },
        "agents": *[_type == "agent"] {
          name,
          title,
          phoneNumbers,
          "photoUrl": photo.asset->url
        }
    }`;

    const data = await client.fetch(query);
    
    return data;
};