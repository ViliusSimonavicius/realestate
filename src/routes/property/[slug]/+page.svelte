<script lang="ts">
  import { onMount } from 'svelte';
  import { PortableText } from '@portabletext/svelte';
  // CSS stilius paliekame viršuje, jie serveriui netrukdo
  import "@fancyapps/ui/dist/fancybox/fancybox.css";

  let { data } = $props();
  let property = data.property;

  const formatPrice = (num: number) => 
    new Intl.NumberFormat('en-GB', { 
      style: 'currency', 
      currency: 'GBP', 
      maximumFractionDigits: 0 
    }).format(num);

  onMount(async () => {
    // Dinamiškai iškviečiame Fancybox biblioteką TIK naršyklėje
    const { Fancybox } = await import('@fancyapps/ui');

    // Inicializuojame Fancybox su prabangiais nustatymais
    Fancybox.bind('[data-fancybox="gallery"]', {
      Hash: false, // Kad nekeistų URL adreso naršant nuotraukas
      Thumbs: {
        autoStart: true, // Automatiškai atidaro miniatiūrų juostą apačioje
      },
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: ["zoomIn", "zoomOut"],
          right: ["slideshow", "thumbs", "close"],
        },
      },
    });

    // Išvalome atmintį, kai vartotojas išeina iš puslapio
    return () => {
      Fancybox.destroy();
    };
  });
</script>

<svelte:head>
  <title>{property.name} | Oak & Gold</title>
</svelte:head>

<main class="property-page">
    <section class="prop-hero">
        <div class="prop-hero__bg" style="background-image: url({property.mainImageUrl});"></div>
    
        <div class="prop-hero__overlay">
            <div class="prop-hero__content">
            <span class="prop-hero__status {property.status.toLowerCase()}">{property.status}</span>
            <h1 class="prop-hero__title">{property.name}</h1>
            <p class="prop-hero__price">{formatPrice(property.price)}</p>
            </div>
        </div>
    </section>

  <div class="prop-container">
    <div class="prop-content">
        <div class="prop-specs">
            <div class="spec-item">
            <span class="spec-value">{property.bedrooms || 0}</span>
            <span class="spec-label">Bedrooms</span>
            </div>
            <div class="spec-item">
            <span class="spec-value">{property.bathrooms || 0}</span>
            <span class="spec-label">Bathrooms</span>
            </div>
            <div class="spec-item">
            <span class="spec-value">{property.area || 0}</span>
            <span class="spec-label">SQM Area</span>
            </div>
        </div>

        <div class="prop-description">
            <h2>About this property</h2>
            {#if property.description}
            <div class="rich-text">
                <PortableText value={property.description} />
            </div>
            {:else}
            <p class="text-muted">No description available yet.</p>
            {/if}
        </div>

        {#if property.rooms && property.rooms.length > 0}
            <div class="prop-rooms">
            <h2>Room Details</h2>
            <ul class="room-list">
                {#each property.rooms as room}
                <li>
                    <span class="room-name">{room.roomName}</span>
                    <span class="room-size">{room.size} sqm</span>
                </li>
                {/each}
            </ul>
            </div>
        {/if}

        {#if property.galleryUrls && property.galleryUrls.length > 0}
                <div class="prop-gallery">
                  <h2>Gallery</h2>
                  <div class="gallery-grid">
                    {#each property.galleryUrls as img, index}
                      
                      {#if index < 3}
                        <a href={img} class="gallery-item" data-fancybox="gallery">
                          <img src={img} alt="Property view {index + 1}" class="gallery-img" />
                          <div class="gallery-overlay">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                          </div>
                        </a>
        
                      {:else if index === 3}
                        <a href={img} class="gallery-item" data-fancybox="gallery">
                          <img src={img} alt="Property view 4" class="gallery-img" />
                          
                          {#if property.galleryUrls.length > 4}
                            <div class="gallery-overlay gallery-overlay--more">
                              <span>+{property.galleryUrls.length - 4} Photos</span>
                            </div>
                          {:else}
                            <div class="gallery-overlay">
                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                            </div>
                          {/if}
                        </a>
        
                      {:else}
                        <a href={img} data-fancybox="gallery" style="display: none;"></a>
                      {/if}
        
                    {/each}
                  </div>
                </div>
              {/if}
    </div>

    <aside class="prop-sidebar">
      <div class="agent-card">
        <h3>Contact the Agent</h3>
        
        {#if property.agents && property.agents.length > 0}
          {@const agent = property.agents[0]}
          <img src={agent.photoUrl} alt={agent.name} class="agent-card__img" />
          <h4 class="agent-card__name">{agent.name}</h4>
          
          {#if agent.phoneNumbers && agent.phoneNumbers.length > 0}
            <div class="agent-card__actions">
              <a href="tel:{agent.phoneNumbers[0].replace(/\s+/g, '')}" class="btn btn--outline">Call Now</a>
              <a href="https://wa.me/{agent.phoneNumbers[0].replace(/[^0-9]/g, '')}" class="btn btn--primary">WhatsApp</a>
            </div>
            
            {#if agent.phoneNumbers.length > 1}
              <div class="agent-card__secondary">
                <span class="secondary-label">Alternative numbers:</span>
                {#each agent.phoneNumbers.slice(1) as phone}
                  <a href="tel:{phone.replace(/\s+/g, '')}" class="secondary-link">{phone}</a>
                {/each}
              </div>
            {/if}
            
          {/if}
        {:else}
          <p class="text-muted">Please contact our main office to inquire about this property.</p>
        {/if}
      </div>
    </aside>
  </div>
</main>

<style lang="scss">
  /* --- Kintamieji --- */
  $bg-dark: #0A0B10;
  $surface-dark: #12131A;
  $accent-champagne: #C5A880;
  $text-light: #F5F5F0;
  $text-muted: #8E8F94;
  $font-serif: 'Playfair Display', serif;
  $font-sans: 'Inter', sans-serif;

  /* Šie stiliai dabar galios VISAI svetainei, nesvarbu, kokiame puslapyje esi */
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #0A0B10; /* Tavo tamsus fonas */
        color: #F5F5F0;
        font-family: 'Inter', sans-serif;
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
    }
    
    :global(*), :global(*::before), :global(*::after) {
        box-sizing: border-box;
    }
  
  .property-page {
    background-color: $bg-dark;
    color: $text-light;
    min-height: 100vh;
    padding-bottom: 6rem;
    font-family: $font-sans;
  }

  /* --- Hero Sekcija --- */
  .prop-hero {
    height: 70vh;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
    
    &__bg {
        position: absolute;
        inset: -5%; 
        background-size: cover;
        background-position: center;
        
        /* --- GPU SPARTINIMAS (HARDWARE ACCELERATION) --- */
        /* Šie 3 parametrai yra paslaptis, panaikinanti trūkčiojimą */
        will-change: transform, filter;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        
        /* Naudojame vieną kombinuotą animaciją ir pridedame translateZ(0) hibridą */
        animation: smoothCinematic 20s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        z-index: 0;
      }
    
      /* Vietoj dviejų atskirų animacijų, viską sujungiame į vieną tolygią tėkmę */
      @keyframes smoothCinematic {
        0% { 
          /* translateZ(0) aktyvuoja 3D grafikos varikliuką naršyklėje */
          transform: scale(1.1) translateZ(0); 
          filter: blur(12px); 
        }
        10% { 
          /* Po 2 sekundžių (10% iš 20s) vaizdas tampa ryškus */
          filter: blur(0); 
        }
        100% { 
          /* Lėtai nusileidžia iki normalaus dydžio */
          transform: scale(1) translateZ(0); 
          filter: blur(0); 
        }
      }
    
    &__overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, $bg-dark 0%, rgba(10,11,16,0.2) 100%);
        display: flex;
        align-items: flex-end;
        padding: 5rem;
        z-index: 1; /* Užkeliame ant animuojamo fono */
        @media (max-width: 768px) { padding: 2rem; }
    }
    
    &__content {
        animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
        transform: translateY(30px);
    }

    &__title {
      font-family: $font-serif;
      font-size: 4rem;
      margin: 0.5rem 0;
      @media (max-width: 768px) { font-size: 2.5rem; }
    }

    &__price {
      font-size: 1.5rem;
      color: $accent-champagne;
      letter-spacing: 1px;
    }

    &__status {
      display: inline-block;
      padding: 0.4rem 1rem;
      border: 1px solid currentColor;
      border-radius: 4px;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 1px;
      &.available { color: $accent-champagne; }
      &.reserved { color: orange; }
      &.sold { color: red; }
    }
  }
  
  @keyframes kenBurns {
      0% { transform: scale(1); }
      100% { transform: scale(1.12); } /* Priartina 12% - labai subtilu */
    }
  
    @keyframes fadeUp {
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }

  /* --- Išdėstymas --- */
  .prop-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 4rem 5rem;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      padding: 2rem;
    }
  }

  h2 {
    font-family: $font-serif;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: $text-light;
  }

  .text-muted { color: $text-muted; }

  /* --- Specifikacijos --- */
  .prop-specs {
    display: flex;
    gap: 3rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 2rem;
    margin-bottom: 3rem;

    .spec-item { display: flex; flex-direction: column; }
    .spec-value { font-size: 2rem; font-family: $font-serif; color: $accent-champagne; }
    .spec-label { font-size: 0.85rem; text-transform: uppercase; color: $text-muted; letter-spacing: 1px; }
  }

  /* --- Aprašymas --- */
  .prop-description {
    margin-bottom: 4rem;
    
    .rich-text {
      color: $text-muted;
      line-height: 1.8;
      font-size: 1.1rem;
      
      :global(p) { margin-bottom: 1.5rem; }
      :global(strong) { color: $text-light; }
    }
  }

  /* --- Kambariai --- */
  .room-list {
    list-style: none;
    padding: 0;
    margin-bottom: 4rem;

    li {
      display: flex;
      justify-content: space-between;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      color: $text-muted;
    }
    .room-name { color: $text-light; }
  }

  /* --- Galerija --- */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    @media (max-width: 768px) { grid-template-columns: 1fr; }
  }

  .gallery-item {
    position: relative;
    display: block;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    background-color: $surface-dark;

    .gallery-img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      transition: transform 0.6s ease;
      display: block;
    }

    .gallery-overlay {
      position: absolute;
      inset: 0;
      background: rgba(10, 11, 16, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      color: $text-light;
    }
    
    .gallery-overlay--more {
        opacity: 1; /* Šis filtras matomas visada, nereikia užvesti pelytės */
        background: rgba(10, 11, 16, 0.75); /* Tamsesnis fonas, kad tekstas gerai matytųsi */
        
        span {
            font-family: $font-serif;
            font-size: 2rem;
            color: $text-light;
            letter-spacing: 2px;
            transition: transform 0.3s ease;
        }
    }

    &:hover {
        .gallery-img { transform: scale(1.05); }
        .gallery-overlay { opacity: 1; }
        /* Kai užvedame pelytę ant paskutinės nuotraukos, tekstas švelniai padidėja */
        .gallery-overlay--more span { transform: scale(1.1); color: $accent-champagne; }
    }
  }

  /* --- Brokerio Kortelė --- */
  .agent-card {
    background: $surface-dark;
    padding: 2.5rem;
    border-radius: 12px;
    text-align: center;
    border: 1px solid rgba(255,255,255,0.05);
    position: sticky;
    top: 2rem;

    h3 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; color: $text-muted; margin-bottom: 2rem; }
    
    &__img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid $accent-champagne; margin-bottom: 1rem; }
    &__name { font-size: 1.5rem; font-family: $font-serif; margin-bottom: 2rem; color: $text-light; }
    
    &__actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      
      .btn {
        width: 100%; padding: 1rem; border-radius: 8px; text-decoration: none; display: inline-block; font-size: 0.95rem; transition: all 0.3s ease; cursor: pointer; text-align: center;
        &--outline { border: 1px solid rgba(255,255,255,0.3); color: $text-light; &:hover { background: $text-light; color: $bg-dark; } }
        &--primary { background: $text-light; color: $bg-dark; border: none; &:hover { background: $accent-champagne; } }
      }
    }

    &__secondary {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 1.5rem;
      
      .secondary-label { font-size: 0.75rem; text-transform: uppercase; color: $text-muted; letter-spacing: 1px; margin-bottom: 0.5rem; }
      .secondary-link { color: $text-light; text-decoration: none; font-size: 0.95rem; transition: color 0.3s ease; &:hover { color: $accent-champagne; } }
    }
  }
</style>