<script lang="ts">
  let { data } = $props();
  let allProperties = data.properties;

  // --- FILTRŲ BŪSENOS ---
  let searchQuery = $state('');
  let selectedStatus = $state('All'); // 'All', 'Available', 'Reserved', 'Sold'
  let minBedrooms = $state(0);
  let minPrice = $state<number | null>(null);
  let maxPrice = $state<number | null>(null);

  // --- IŠMANIOJI FILTRAVIMO LOGIKA ---
  let filteredProperties = $derived(
    allProperties.filter((property: any) => {
      const matchStatus = selectedStatus === 'All' || 
                          property.status?.toLowerCase() === selectedStatus.toLowerCase();
      
      const searchLower = searchQuery.toLowerCase().trim();
      const matchSearch = searchLower === '' || 
        (property.name?.toLowerCase() || '').includes(searchLower) || 
        (property.location?.toLowerCase() || '').includes(searchLower);

      const propPrice = property.price || 0;
      const matchMinPrice = minPrice === null || propPrice >= minPrice;
      const matchMaxPrice = maxPrice === null || propPrice <= maxPrice;

      const matchBeds = (property.bedrooms || 0) >= minBedrooms;
      
      return matchStatus && matchSearch && matchMinPrice && matchMaxPrice && matchBeds;
    })
  );

  const formatPrice = (num: number) => 
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(num);

  function clearFilters() {
    searchQuery = '';
    selectedStatus = 'All';
    minBedrooms = 0;
    minPrice = null;
    maxPrice = null;
  }
</script>

<svelte:head>
  <title>Properties | Oak & Gold</title>
</svelte:head>

<main class="portfolio-page">
  <header class="portfolio-header">
    <h1>Exclusive Portfolio</h1>
    <p>Discover our curated collection of London's finest properties.</p>
  </header>

  <div class="portfolio-layout">
    
    <aside class="filters-sidebar">
      <div class="filter-group">
        <label for="search">Search Location</label>
        <input type="text" id="search" bind:value={searchQuery} placeholder="e.g. Mayfair..." class="filter-input" />
      </div>

      <div class="filter-group">
        <label>Status</label>
        <div class="filter-buttons">
          <button class:active={selectedStatus === 'All'} onclick={() => selectedStatus = 'All'}>All</button>
          <button class:active={selectedStatus === 'Available'} onclick={() => selectedStatus = 'Available'}>Available</button>
          <button class:active={selectedStatus === 'Reserved'} onclick={() => selectedStatus = 'Reserved'}>Reserved</button>
          <button class:active={selectedStatus === 'Sold'} onclick={() => selectedStatus = 'Sold'}>Sold</button>
        </div>
      </div>

      <div class="filter-group">
        <label>Price Range (£)</label>
        <div class="price-inputs">
          <input type="number" bind:value={minPrice} placeholder="Min" class="filter-input" step="100000" min="0" />
          <span class="price-divider">-</span>
          <input type="number" bind:value={maxPrice} placeholder="Max" class="filter-input" step="100000" min="0" />
        </div>
      </div>

      <div class="filter-group">
        <label for="beds">Bedrooms</label>
        <select id="beds" bind:value={minBedrooms} class="filter-input">
          <option value={0}>Any</option>
          <option value={1}>1+ Beds</option>
          <option value={2}>2+ Beds</option>
          <option value={3}>3+ Beds</option>
          <option value={4}>4+ Beds</option>
          <option value={5}>5+ Beds</option>
        </select>
      </div>

      <button class="btn btn--outline clear-btn" onclick={clearFilters}>
        Clear Filters
      </button>
    </aside>

    <section class="portfolio-content">
      <div class="portfolio__grid">
        {#if filteredProperties.length > 0}
          {#each filteredProperties as property}
            <div class="portfolio__card" style="background-image: url({property.imageUrl});">
              <div class="portfolio__card-overlay">
                <a href="/property/{property.slug}" class="portfolio__card-content">
                    <h3 class="portfolio__card-title">{property.name}</h3>
                    <span class="portfolio__card-specs">
                      {#if property.location}{property.location} • {/if}
                      {property.bedrooms || 0} Bed • {property.bathrooms || 0} Bath
                    </span>
                    <span class="portfolio__card-price">{formatPrice(property.price)}</span>
                </a>
              </div>
            </div>
          {/each}
        {:else}
          <div class="no-results">
            <h3>No properties match your criteria.</h3>
            <p>Try broadening your search or adjusting the filters on the left.</p>
          </div>
        {/if}
      </div>
    </section>

  </div>
</main>

<style lang="scss">
  $bg-dark: #0A0B10;
  $surface-dark: #12131A;
  $accent-champagne: #C5A880;
  $text-light: #F5F5F0;
  $text-muted: #8E8F94;
  $font-serif: 'Playfair Display', serif;

  .portfolio-page { padding-top: 120px; min-height: 100vh; padding-bottom: 6rem; }
  
  .portfolio-header { 
    text-align: center; margin-bottom: 4rem; padding: 0 2rem; 
    h1 { font-family: $font-serif; font-size: 3.5rem; margin-bottom: 1rem; color: $text-light; } 
    p { color: $text-muted; font-size: 1.1rem; } 
    @media (max-width: 768px) { margin-bottom: 2rem; h1 { font-size: 2.5rem; } }
  }

  /* --- Pagrindinis Išdėstymas --- */
  .portfolio-layout {
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 5rem;
    display: grid;
    grid-template-columns: 320px 1fr; /* 320px kairėje, visa kita - dešinėje */
    gap: 4rem;
    align-items: start; /* Svarbu "sticky" efektui */

    @media (max-width: 1024px) {
      grid-template-columns: 1fr; /* Planšetėse ir telefonuose filtrai eina į viršų */
      padding: 0 2rem;
      gap: 2.5rem;
    }
    @media (max-width: 768px) { padding: 0 1.25rem; }
  }

  /* --- Kairysis Meniu (Sidebar) --- */
  .filters-sidebar {
    background: $surface-dark;
    border: 1px solid rgba(255,255,255,0.05);
    padding: 2rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    
    /* Magija: Filtrai slenka kartu su tavimi! */
    position: sticky;
    top: 120px; 

    @media (max-width: 1024px) {
      position: relative;
      top: 0;
    }
  }

  .filter-group {
    display: flex; flex-direction: column; gap: 0.6rem;
    label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: $text-muted; }
  }

  .filter-input {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: $text-light;
    padding: 0.8rem 1rem; border-radius: 4px; font-size: 0.95rem; outline: none; transition: border-color 0.3s; width: 100%;
    &:focus { border-color: $accent-champagne; }
    &::placeholder { color: rgba(255,255,255,0.3); }
    &::-webkit-outer-spin-button, &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    &[type=number] { -moz-appearance: textfield; }
  }

  select.filter-input { cursor: pointer; appearance: none; option { background: $surface-dark; color: $text-light; } }

  .filter-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Mygtukai išdėstomi 2x2 tinkleliu, kad gražiai tilptų šone */
    gap: 0.5rem;

    button {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: $text-muted;
      padding: 0.6rem; cursor: pointer; border-radius: 4px; transition: all 0.3s ease; font-size: 0.85rem;
      &.active { background: $accent-champagne; color: $bg-dark; border-color: $accent-champagne; font-weight: 500; }
      &:hover:not(.active) { color: $text-light; border-color: rgba(255,255,255,0.3); }
    }
  }

  .price-inputs {
    display: flex; align-items: center; gap: 0.5rem;
    .price-divider { color: $text-muted; }
  }

  .clear-btn {
    margin-top: 1rem;
    width: 100%;
    padding: 1rem;
    border-radius: 4px;
    background: transparent; border: 1px solid rgba(255,255,255,0.2); color: $text-light;
    cursor: pointer; transition: all 0.3s;
    &:hover { background: rgba(255,255,255,0.1); }
  }

  /* --- Dešinioji pusė: Skelbimai --- */
  .portfolio-content {
    width: 100%;
  }

  .portfolio__grid { 
    display: grid; 
    /* Automatiškai išdėlioja korteles, minimalus plotis 350px */
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); 
    gap: 2rem; 
    grid-auto-rows: 400px; 
    
    @media (max-width: 768px) { 
      grid-template-columns: 1fr; /* Telefone viena po kitos */
      gap: 1.5rem; 
      grid-auto-rows: 350px; 
    } 
  }
  
  .portfolio__card {
    position: relative; border-radius: 12px; overflow: hidden; background-size: cover; background-position: center;
    &::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(10, 11, 16, 0.95) 0%, rgba(10, 11, 16, 0.4) 50%, transparent 100%); transition: background 0.5s ease; }
    &:hover::after { background: linear-gradient(to top, rgba(10, 11, 16, 0.95) 0%, rgba(10, 11, 16, 0.6) 50%, rgba(10, 11, 16, 0.2) 100%); }
    &:hover .portfolio__card-overlay { transform: translateY(-5px); }
  }

  .portfolio__card-overlay { position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; justify-content: flex-end; padding: 2.5rem; transition: transform 0.5s ease; @media (max-width: 768px) { padding: 1.5rem; } }
  .portfolio__card-content { text-decoration: none; color: $text-light; display: block; }
  .portfolio__card-title { font-size: 1.6rem; margin: 0 0 0.5rem 0; font-family: $font-serif; text-shadow: 0 2px 8px rgba(0,0,0,0.8); }
  .portfolio__card-specs { display: block; font-size: 0.8rem; color: $accent-champagne; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 0.5rem; }
  .portfolio__card-price { font-size: 1.1rem; font-weight: 500; text-shadow: 0 2px 8px rgba(0,0,0,0.8); }

  .no-results {
    grid-column: 1 / -1; text-align: center; padding: 4rem 0; background: $surface-dark; border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);
    h3 { font-family: $font-serif; font-size: 1.8rem; color: $text-light; margin-bottom: 0.5rem; }
    p { color: $text-muted; }
  }
</style>