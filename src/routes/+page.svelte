<script lang="ts">
  import { onMount } from 'svelte';

  let { data } = $props();
  let propertyValue = $state(1500000); 
  let oakPercent = $derived((data.home?.oakFeePercent || 1.5) / 100);
  let oakBase = $derived(data.home?.oakFeeBase || 1000);
  let marketPercent = $derived((data.home?.marketFeePercent || 3) / 100);
  let oakGoldFee = $derived((propertyValue * oakPercent) + oakBase);
  let marketFee = $derived(propertyValue * marketPercent);

  // Funkcija kainos formatavimui
  const formatPrice = (num: number) => 
    new Intl.NumberFormat('en-GB', { 
      style: 'currency', 
      currency: 'GBP', 
      maximumFractionDigits: 0 
    }).format(num);

  // 3. Scroll Reveal efektas
  function reveal(node: HTMLElement) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          observer.unobserve(node);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(node);
    return { destroy() { observer.disconnect(); } };
  }
</script>

<main class="page">
  <section class="hero">
    <div class="hero__video-wrapper">
      <div class="hero__overlay"></div>
      <video class="hero__video" src="/videos/luxury-hero.mp4" autoplay loop muted playsinline></video>
    </div>
    <div class="hero__content reveal" use:reveal>
      <p class="hero__subtitle">{data.home?.heroSubtitle || "London's Premier Real Estate"}</p>
      
      <h1 class="hero__title">
        {data.home?.heroTitleNormal || 'Curating'} <br/> 
        <span class="hero__title-highlight">
            {data.home?.heroTitleHighlight || 'Extraordinary Lifestyles'}
        </span>
      </h1>
    </div>
  </section>

  <section id="pricing" class="pricing reveal" use:reveal>
    <div class="pricing__header">
        <p class="pricing__subtitle">{data.home?.pricingSubtitle}</p>
        <h2 class="pricing__title">{data.home?.pricingTitle}</h2>
        <p class="pricing__desc">{data.home?.pricingDesc}</p>
    </div>

    <div class="pricing__calculator">
      <div class="pricing__slider-section">
        <div class="pricing__slider-top">
          <span>Property Value</span>
          <span class="pricing__slider-value">{formatPrice(propertyValue)}</span>
        </div>
        <input 
          class="pricing__slider" 
          type="range" 
          min="500000" 
          max="10000000" 
          step="50000" 
          bind:value={propertyValue} 
        />
      </div>

      <div class="pricing__results">
        <div class="pricing__result-item pricing__result-item--active">
          <p>Selling with Oak & Gold:</p>
          <span class="pricing__price-huge">{formatPrice(oakGoldFee)}</span>
          <span class="pricing__vat">+VAT</span>
        </div>
        <div class="pricing__result-item">
          <p>Traditional Agencies (approx 3%):</p>
          <span class="pricing__price-huge">{formatPrice(marketFee)}</span>
          <span class="pricing__vat">+VAT</span>
        </div>
      </div>
      
      <div class="pricing__cta">
        <button class="btn btn--primary">Book a Valuation</button>
      </div>
    </div>
  </section>

  <section id="portfolio" class="portfolio">
    <div class="portfolio__header reveal" use:reveal>
      <h2 class="portfolio__title">{data.home?.portfolioTitle || 'Exclusive Portfolio'}</h2>
      <p class="portfolio__desc">{data.home?.portfolioDesc}</p>
    </div>

    <div class="portfolio__grid">
      {#each data.properties as property, index}
        <div 
          class="portfolio__card reveal {index === 0 ? 'portfolio__card--large' : ''}" 
          style="background-image: url({property.imageUrl}); transition-delay: {index * 0.1}s;"
          use:reveal
        >
          <div class="portfolio__card-overlay">
            <a href="/property/{property.slug}" class="portfolio__card-content">
                <h3 class="portfolio__card-title">{property.name}</h3>
                <span class="portfolio__card-specs">
                  {#if property.cardDisplayType === 'auto'}
                    {property.bedrooms || 0} Bed • {property.bathrooms || 0} Bath • {property.area || 0} sqm
                    
                  {:else if property.cardDisplayType === 'custom'}
                    {#if property.cardCustomBuilder}
                      {#each property.cardCustomBuilder as block}
                      
                        {#if block._type === 'dynamicField'}
                          {#if block.value === 'bedrooms'}{property.bedrooms} Bed{/if}
                          {#if block.value === 'bathrooms'}{property.bathrooms} Bath{/if}
                          {#if block.value === 'area'}{property.area} sqm{/if}
                          
                        {:else if block._type === 'staticText'}
                          {block.text}
                        {/if}
                        
                      {/each}
                    {/if}
                  {/if}
                </span>
          </a>
            
            {#if property.agents && property.agents.length > 0}
              <div class="portfolio__card-agent">
                {#each property.agents as agent}
                  <img class="portfolio__agent-img" src={agent.photoUrl} alt={agent.name} />
                  <div class="portfolio__agent-info">
                    <span class="portfolio__agent-name">{agent.name}</span>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section id="contact" class="agents reveal" use:reveal>
    <div class="agents__header">
      <h2 class="agents__title">{data.home?.contactTitle}</h2>
      <p class="agents__desc">{data.home?.contactDesc}</p>
    </div>
    <div class="agents__grid">
      {#each data.agents || [] as agent}
        <div class="agents__card">
          <img class="agents__img" src={agent.photoUrl} alt={agent.name} />
          <h3 class="agents__name">{agent.name}</h3>
          <p class="agents__role">{agent.title}</p>
          <div class="agents__actions">
            {#if agent.phoneNumbers && agent.phoneNumbers.length > 0}
              
              <div class="agents__primary-actions">
                <a href="tel:{agent.phoneNumbers[0].replace(/\s+/g, '')}" class="btn btn--outline agents__btn">Call</a>
                <a href="https://wa.me/{agent.phoneNumbers[0].replace(/[^0-9]/g, '')}" class="btn btn--primary agents__btn">WhatsApp</a>
              </div>
          
              {#if agent.phoneNumbers.length > 1}
                <div class="agents__secondary-phones">
                  <span class="agents__secondary-label">Alternative numbers:</span>
                  {#each agent.phoneNumbers.slice(1) as phone}
                    <a href="tel:{phone.replace(/\s+/g, '')}" class="agents__secondary-link">
                      {phone}
                    </a>
                  {/each}
                </div>
              {/if}
          
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </section>
</main>

<style lang="scss">
    /* --- Kintamieji --- */
    $bg-dark: #0A0B10;
    $surface-dark: #12131A; /* Trūkstamas kortelių fonas! */
    $footer-bg: #050508;
    $text-light: #F5F5F0;
    $text-muted: #8E8F94;
    $accent-champagne: #C5A880;
    
    $font-serif: 'Playfair Display', serif;
    $font-sans: 'Inter', sans-serif;
  
    $bp-tablet: 991px;
    $bp-mobile: 767px;

    /* --- Baziniai Stiliai --- */
      :global(body) {
        margin: 0; font-family: $font-sans; background-color: $bg-dark; color: $text-light;
        -webkit-font-smoothing: antialiased; overflow-x: hidden;
      }
    
      /* PRIDĖTA: Ši taisyklė garantuoja, kad elementai neišsiplės už ekrano ribų dėl paddingų */
      :global(*), :global(*::before), :global(*::after) {
        box-sizing: border-box;
      }

  h1, h2, h3, h4 { font-family: $font-serif; font-weight: 400; margin: 0; }

  /* Utility klasė */
  .reveal {
      opacity: 0; transform: translateY(20px);
      transition: all 0.8s ease-out;
      
      @media (max-width: 767px) {
        transform: translateY(0); /* Telefone paliekame tik opacity (išryškėjimą) */
      }
  
      &:global(.is-visible) { opacity: 1; transform: translateY(0); }
    }

  /* --- Mygtukai --- */
  .btn {
    border-radius: 4px; font-size: 0.85rem; letter-spacing: 1px; cursor: pointer; transition: all 0.4s ease; text-decoration: none; display: inline-flex; justify-content: center; align-items: center;

    &--outline {
      background: transparent; border: 1px solid rgba(255,255,255,0.3); color: $text-light;
      padding: 0.8rem 2rem; backdrop-filter: blur(5px);
      &:hover { background: $text-light; color: $bg-dark; border-color: $text-light; }
    }

    &--primary {
      background: $text-light; color: $bg-dark; border: none; padding: 1rem 2.5rem;
      border-radius: 100px; font-size: 1rem; font-weight: 500;
      &:hover { background: $accent-champagne; color: $bg-dark; }
    }
  }

  /* --- Hero (Palikti kaip anksčiau) --- */
  .hero { position: relative; height: 100vh; height: 100dvh; display: flex; align-items: center; justify-content: center; text-align: center; &__video-wrapper { position: absolute; inset: 0; z-index: -1; } &__overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(10,11,16,0.4), rgba(10,11,16,0.9)); z-index: 1; } &__video { width: 100%; height: 100%; object-fit: cover; } &__content { position: relative; z-index: 10; max-width: 1000px; padding: 0 2rem; } &__subtitle { color: $accent-champagne; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 1.5rem; } &__title { font-size: 5.5rem; line-height: 1.05; margin-bottom: 3rem; letter-spacing: -1px; text-shadow: 0 4px 20px rgba(0,0,0,0.5); @media (max-width: $bp-tablet) { font-size: 3.5rem; } @media (max-width: $bp-mobile) { font-size: 2.8rem; } } &__title-highlight { font-style: italic; color: $accent-champagne; } }

  /* --- NAUJAS: Pricing Blokas --- */
  .pricing {
    padding: 8rem 5rem; max-width: 1200px; margin: 0 auto; display: flex; gap: 4rem; align-items: center;
    @media (max-width: $bp-tablet) { padding: 4rem 2rem; flex-direction: column; text-align: center; }

    &__header { flex: 1; }
    &__subtitle { color: $accent-champagne; text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem; margin-bottom: 1rem; }
    &__title { font-size: 3.5rem; line-height: 1.1; margin-bottom: 1.5rem; }
    &__desc { color: $text-muted; font-size: 1.1rem; line-height: 1.6; }

    &__calculator {
      flex: 1.2; background: $surface-dark; padding: 3rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); width: 100%; box-sizing: border-box;
      @media (max-width: $bp-mobile) { padding: 2rem 1.5rem; }
    }

    &__slider-top { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; color: $text-muted; }
    &__slider-value { font-size: 2rem; font-family: $font-serif; color: $text-light; }

    /* Custom Input Range styling Svelte/Modern CSS */
    &__slider {
      width: 100%; margin-bottom: 3rem; accent-color: $accent-champagne; cursor: pointer;
      height: 6px; background: rgba(255,255,255,0.1); border-radius: 5px; outline: none; appearance: none;
      &::-webkit-slider-thumb { appearance: none; width: 24px; height: 24px; border-radius: 50%; background: $accent-champagne; cursor: pointer; border: 4px solid $surface-dark; }
    }

    &__results { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2.5rem; @media (max-width: $bp-mobile) { grid-template-columns: 1fr; } }
    
    &__result-item {
      padding: 1.5rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; text-align: center; transition: all 0.3s;
      p { margin: 0 0 1rem 0; font-size: 0.9rem; color: $text-muted; }
      &--active { border-color: $accent-champagne; background: rgba(197, 168, 128, 0.05); }
    }

    &__price-huge { display: block; font-size: 2.2rem; font-family: $font-serif; color: $text-light; margin-bottom: 0.2rem; }
    &__vat { font-size: 0.8rem; color: $text-muted; }
    &__cta { text-align: center; .btn { width: 100%; } }
  }

  /* --- Portfolio Blokas --- */
    .portfolio {
      padding: 6rem 5rem; max-width: 1600px; margin: 0 auto;
      
      @media (max-width: $bp-tablet) { padding: 4rem 2rem; }
      @media (max-width: $bp-mobile) { padding: 3rem 1.25rem; } /* Sumažintas paddingas mobiliesiems */
  
      &__header { 
        margin-bottom: 4rem; text-align: center; 
        @media (max-width: $bp-mobile) { margin-bottom: 2.5rem; }
      }
      
      &__title { 
        font-size: 3.5rem; margin-bottom: 1rem; 
        @media (max-width: $bp-mobile) { font-size: 2.2rem; } /* Pritaikius moderniems telefonams */
      }
      
      &__desc { 
        color: $text-muted; font-size: 1.1rem; 
        @media (max-width: $bp-mobile) { font-size: 1rem; }
      }
  
      &__grid { 
        display: grid; grid-template-columns: repeat(12, 1fr); gap: 2rem; grid-auto-rows: 450px; 
        @media (max-width: $bp-mobile) { gap: 1rem; grid-auto-rows: 380px; } /* Mažesni tarpai tarp kortelių */
      }
  
      &__card {
        position: relative; border-radius: 8px; overflow: hidden; background-size: cover; background-position: center; grid-column: span 4; cursor: pointer;
        
        @media (max-width: $bp-tablet) { grid-column: span 12; height: 400px; }
        @media (max-width: $bp-mobile) { height: 100%; } /* Leidžiame grid-auto-rows kontroliuoti aukštį */
        
        &--large { grid-column: span 8; @media (max-width: $bp-tablet) { grid-column: span 12; } }
  
        &::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(10, 11, 16, 0.95) 0%, rgba(10, 11, 16, 0.4) 50%, transparent 100%); transition: background 0.5s ease; }
        &:hover::after { background: linear-gradient(to top, rgba(10, 11, 16, 0.95) 0%, rgba(10, 11, 16, 0.6) 50%, rgba(10, 11, 16, 0.2) 100%); }
        &:hover .portfolio__card-overlay { transform: translateY(-5px); }
      }
  
      &__card-overlay { 
        position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; justify-content: space-between; padding: 2.5rem; transition: transform 0.5s ease; 
        @media (max-width: $bp-mobile) { padding: 1.5rem; } /* Kortelės vidus mobiliajame atrodo švariau */
      }
      
      &__card-content { margin-top: auto; margin-bottom: 2rem; text-decoration: none; color: inherit; @media (max-width: $bp-mobile) { margin-bottom: 1.5rem; }}
      &__card-title { font-size: 2rem; margin: 0 0 0.5rem 0; text-shadow: 0 2px 8px rgba(0,0,0,0.8); transition: color 0.3s ease; color: #fff; @media (max-width: $bp-mobile) { font-size: 1.5rem; } }
      &__card-specs { font-family: $font-sans; font-size: 0.9rem; color: $accent-champagne; letter-spacing: 1px; color: $accent-champagne; text-transform: uppercase; text-shadow: 0 1px 4px rgba(0,0,0,0.8); }
  
      &__card-agent {
        display: flex; align-items: center; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 1.5rem;
        @media (max-width: $bp-mobile) { padding-top: 1rem; gap: 0.75rem; }
        .portfolio__agent-img { width: 45px; height: 45px; border-radius: 50%; object-fit: cover; border: 2px solid $accent-champagne; }
        .portfolio__agent-info { display: flex; flex-direction: column; }
        .portfolio__agent-name { font-size: 0.95rem; font-weight: 500; text-shadow: 0 1px 4px rgba(0,0,0,0.8); }
        .portfolio__agent-phone { color: $accent-champagne; font-size: 0.85rem; text-decoration: none; margin-top: 0.2rem; text-shadow: 0 1px 4px rgba(0,0,0,0.8); }
      }
    }

    /* --- Agents (Kontaktai) Blokas --- */
      .agents {
        padding: 6rem 5rem 8rem; max-width: 1200px; margin: 0 auto; text-align: center;
        
        @media (max-width: $bp-tablet) { padding: 4rem 2rem; }
        @media (max-width: $bp-mobile) { padding: 3rem 1.25rem 4rem; }
    
        &__header { 
          margin-bottom: 4rem; 
          @media (max-width: $bp-mobile) { margin-bottom: 2.5rem; }
        }
        &__title { 
          font-size: 3rem; margin-bottom: 1rem; 
          @media (max-width: $bp-mobile) { font-size: 2.2rem; }
        }
        &__desc { color: $text-muted; font-size: 1.1rem; }
    
        &__grid { 
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 3rem; 
          @media (max-width: $bp-tablet) { grid-template-columns: 1fr; } 
          @media (max-width: $bp-mobile) { gap: 1.5rem; } /* Tarpas tarp agentų kortelių */
        }
    
        &__card {
          background: $surface-dark; padding: 3rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; align-items: center; transition: transform 0.4s ease;
          
          @media (max-width: $bp-mobile) { padding: 2rem 1.5rem; border-radius: 12px; } /* Kompaktiškesnė kortelė mobiliesiems */
          
          &:hover { border-color: rgba(197, 168, 128, 0.3); }
        }
    
        &__img { 
          width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 1.5rem; border: 3px solid $accent-champagne; 
          @media (max-width: $bp-mobile) { width: 100px; height: 100px; margin-bottom: 1rem; }
        }
        
        &__name { font-size: 1.8rem; margin-bottom: 0.5rem; @media (max-width: $bp-mobile) { font-size: 1.5rem; } }
        &__role { color: $text-muted; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 2px; margin-bottom: 2rem; @media (max-width: $bp-mobile) { margin-bottom: 1.5rem; } }
        
        &__primary-actions {
            display: flex;
            gap: 1rem;
            width: 100%;
            
            @media (max-width: $bp-mobile) {
                flex-direction: column;
                gap: 0.75rem;
            }
            
            .agents__btn {
                flex: 1;
            }
        }
        
        &__actions {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
            width: 100%;
          /* UX 2026: Telefonuose mygtukus dedame vieną virš kito, kad būtų patogu paspausti dideliu pirštu */
          @media (max-width: $bp-mobile) { flex-direction: column; gap: 0.75rem; }
          
          .agents__btn { flex: 1; border-radius: 8px; padding: 0.9rem 1rem;}
        }
        
        &__secondary-phones {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1); /* Subtili atskyrimo linija */
            width: 80%; /* Kad linija nebūtų per visą plotį */
        }
        
        &__secondary-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: $text-muted;
            margin-bottom: 0.2rem;
        }
        
        &__secondary-link {
            font-size: 0.9rem;
            color: $text-light;
            text-decoration: none;
            transition: color 0.3s ease;
        
            &:hover {
                color: $accent-champagne; /* Tavo auksinė spalva */
            }
        }
      }
</style>




