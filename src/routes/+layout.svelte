<script lang="ts">
    import { page } from '$app/stores';
    let { data, children } = $props();
    let navLinks = data.settings?.mainNav || [];
    let isMobileMenuOpen = $state(false);

    function toggleMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
        if (typeof window !== 'undefined') {
            document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
        }
    }

    function closeMenu() {
        isMobileMenuOpen = false;
        if (typeof window !== 'undefined') {
            document.body.style.overflow = 'auto';
        }
    }
</script>

<header class="navbar" class:navbar--scrolled={$page.url.pathname !== '/'}>
    <a href="/" class="navbar__logo" onclick={closeMenu}>OAK & GOLD</a>
    <nav class="navbar__nav">
        {#each navLinks as link}
            <a 
                class="navbar__link" 
                class:active={$page.url.pathname === link.url || (link.url !== '/' && $page.url.pathname.includes(link.url))} 
                href={link.url}
            >
                {link.title}
            </a>
        {/each}
    </nav>
    
    <div class="navbar__actions">
        <a href="/#contact" class="btn btn--outline navbar__btn">Enquire</a>
        
        <button class="navbar__hamburger" class:active={isMobileMenuOpen} onclick={toggleMenu} aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</header>

{#if isMobileMenuOpen}
    <div class="mobile-menu">
        <nav class="mobile-menu__nav">
            {#each navLinks as link}
                <a href={link.url} onclick={closeMenu}>{link.title}</a>
            {/each}
        </nav>
        <a href="/#contact" class="btn btn--primary mobile-menu__btn" onclick={closeMenu}>Enquire Now</a>
    </div>
{/if}

<main class="page-content">
    {@render children()}
</main>

<footer class="footer">
    <div class="footer__grid">
      <div class="footer__col footer__col--brand">
        <h2 class="footer__brand-title">OAK & GOLD</h2>
        <p class="footer__text">Curating extraordinary lifestyles and representing the most exceptional properties across the United Kingdom.</p>
      </div>
      <div class="footer__col footer__col--links">
        <h4 class="footer__title">Explore</h4>
        <a class="footer__link" href="/#portfolio">Our Portfolio</a>
        <a class="footer__link" href="/#pricing">Pricing</a>
        <a class="footer__link" href="/#contact">Contact Us</a>
      </div>
      <div class="footer__col footer__col--contact">
        <h4 class="footer__title">Contact</h4>
        <p class="footer__text">office@oakandgold.co.uk</p>
        <p class="footer__text">+44 20 7946 0958</p>
        <p class="footer__text">15 Mayfair Place, London</p>
      </div>
    </div>
    <div class="footer__bottom">
      <p class="footer__copyright">© {new Date().getFullYear()} Oak & Gold London. All rights reserved. | Crafted with SvelteKit</p>
    </div>
</footer>

<style lang="scss">
    /* --- Kintamieji --- */
    $bg-dark: #0A0B10;
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
        margin: 0; 
        font-family: $font-sans; 
        background-color: $bg-dark; 
        color: $text-light;
        -webkit-font-smoothing: antialiased; 
        overflow-x: hidden;
    }
    
    :global(*), :global(*::before), :global(*::after) {
        box-sizing: border-box;
    }

    h1, h2, h3, h4 { font-family: $font-serif; font-weight: 400; margin: 0; }

    /* Mygtukų klasės Navbar'ui ir meniu */
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

    /* --- TAVO ORIGINALUS NAVBAR DIZAINAS + MOBILE --- */
    .navbar { 
        position: absolute; /* Arba 'fixed', jei nori, kad slinktų kartu */
        top: 0; 
        left: 0; 
        width: 100%; 
        padding: 2.5rem 5rem; 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        z-index: 100; 
        box-sizing: border-box; 
        
        @media (max-width: $bp-tablet) { padding: 1.5rem 2rem; } 
        
        /* Jei esame NE pagrindiniame puslapyje, uždedame foną, kad matytųsi tekstas */
        &--scrolled {
             background: rgba(10, 11, 16, 0.95);
             border-bottom: 1px solid rgba(255,255,255,0.05);
             position: fixed;
             padding: 1.5rem 5rem;
             @media (max-width: $bp-tablet) { padding: 1rem 2rem; }
        }

        &__logo { 
            font-size: 1.2rem; 
            letter-spacing: 4px; 
            text-transform: uppercase; 
            font-family: $font-serif; 
            color: $text-light;
            text-decoration: none;
            z-index: 101; /* Virš overlay */
        } 
        
        &__nav { 
            @media (max-width: $bp-tablet) { display: none; } 
        } 
        
        &__link { 
            color: $text-light; 
            text-decoration: none; 
            margin: 0 2rem; 
            font-size: 0.85rem; 
            text-transform: uppercase; 
            letter-spacing: 1px; 
            transition: color 0.3s; 
            &:hover, &.active { color: $accent-champagne; } 
        } 

        &__actions {
            display: flex;
            align-items: center;
            gap: 2rem;
            z-index: 101;
        }

        &__btn {
             @media (max-width: $bp-tablet) { display: none; }
        }

        /* Hamburgeris Mobiliesiems */
        &__hamburger {
            display: none;
            flex-direction: column;
            justify-content: space-around;
            width: 30px;
            height: 24px;
            background: transparent;
            border: none;
            cursor: pointer;

            @media (max-width: $bp-tablet) { display: flex; } /* Rodome planšetėse ir telefonuose */

            span {
                width: 30px;
                height: 2px;
                background: $text-light;
                border-radius: 2px;
                transition: all 0.3s linear;
                transform-origin: 1px;
            }

            &.active span:first-child { transform: rotate(45deg); }
            &.active span:nth-child(2) { opacity: 0; }
            &.active span:nth-child(3) { transform: rotate(-45deg); }
        }
    }

    /* --- Mobile Menu Overlay --- */
    .mobile-menu {
        position: fixed;
        inset: 0;
        background: rgba(10, 11, 16, 0.98);
        backdrop-filter: blur(10px);
        z-index: 99;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease-out forwards;

        &__nav {
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
            text-align: center;
            margin-bottom: 4rem;

            a {
                font-family: $font-serif;
                font-size: 2.5rem;
                color: $text-light;
                text-decoration: none;
                transition: color 0.3s ease;

                &:hover { color: $accent-champagne; }
            }
        }
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* --- TAVO ORIGINALUS FOOTER DIZAINAS --- */
    .footer {
        background: $footer-bg; padding: 6rem 5rem 2rem; border-top: 1px solid rgba(255,255,255,0.05);
        @media (max-width: $bp-tablet) { padding: 4rem 2rem 2rem; }
        
        &__grid {
            display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 4rem; max-width: 1600px; margin: 0 auto 4rem auto;
            @media (max-width: $bp-tablet) { grid-template-columns: 1fr; gap: 2.5rem; }
        }
        
        &__brand-title { color: $accent-champagne; font-size: 1.5rem; letter-spacing: 3px; margin-bottom: 1.5rem; }
        &__title { font-family: $font-sans; font-weight: 500; font-size: 1.1rem; margin-bottom: 1.5rem; color: $text-light; }
        &__text { color: $text-muted; margin-bottom: 1rem; line-height: 1.6; max-width: 400px; }
        
        &__link {
            display: block; color: $text-muted; text-decoration: none; margin-bottom: 1rem; transition: color 0.3s;
            &:hover { color: $accent-champagne; }
        }
        
        &__bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 2rem; text-align: center; }
        &__copyright { color: rgba(255,255,255,0.3); font-size: 0.85rem; margin: 0; }
    }
</style>