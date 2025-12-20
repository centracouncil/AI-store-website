/* 
 * TechstinctStore - Premium Fashion
 * Core Logic (Theme, Shop, Interactions)
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu(); 
    initAnimations();
    
    // Page Specific Initializations
    if (document.getElementById('product-grid')) {
        initShop();
    }

    if (document.querySelector('.collection-grid')) {
        initParallax();
    }
});

/* --- Theme Handling --- */
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, icon);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme, icon);
    });
}

function updateThemeIcon(theme, icon) {
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

/* --- Mobile Menu --- */
function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-links');
    
    if(btn) {
        btn.addEventListener('click', () => {
            nav.classList.toggle('active');
            // Animate hamburger to X (optional simple toggle)
        });
    }
}

/* --- Shop / Product Logic --- */
const categories = ['shirts', 'hoodies', 'pants', 'accessories', 'outerwear'];
const adjectives = ['Velvet', 'Midnight', 'Urban', 'Classic', 'Silk', 'Distressed', 'Oversized', 'Tech', 'Vintage', 'Modern'];
const nouns = ['Blazer', 'Tee', 'Trousers', 'Scarf', 'Bomber', 'Denim', 'Hoodie', 'Coat', 'Vest', 'Sneakers'];

function generateProducts(count) {
    const products = [];
    for (let i = 0; i < count; i++) {
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const name = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
        
        // Random price between 2000 and 200000
        const price = Math.floor(Math.random() * (200000 - 2000 + 1)) + 2000;
        
        products.push({
            id: i + 1,
            name: name,
            category: cat,
            price: price,
            image: `https://images.unsplash.com/photo-${getFashionImageId(i)}?auto=format&fit=crop&w=500&q=80`
        });
    }
    return products;
}

// A curate list of Unsplash IDs for fashion to ensure high quality and no broken links
function getFashionImageId(index) {
    const ids = [
        '1515886657613-9f3515b0c78f', '1529139574466-a3023fb6f384', '1539109136881-3be4116ac17b', 
        '1504194959174-82fa012546e3', '1529374255404-311a2a4f1bc9', '1506634572416-48cdfe530110',
        '1487222477894-8943e31ef7b2', '1595950653106-6c9ebd614d3a', '1483985988355-763728e1935b',
        '1550614000-4b9519e68374', '1485968579580-c6d095142762', '1552374196-1ab2a1c593e8',
        '1509631179647-b8fe0095cbff', '1554412933-514a83d2f3c8', '1496747611176-843222e1e57c',
        '1617137968427-85924c800a22', '1512353087810-25dfcd100962', '1611317540266-9ab1c3d69a66',
        '1534030347209-7147fd9e5b7a', '1551488852-0801464c5029'
    ];
    return ids[index % ids.length];
}

function initShop() {
    const grid = document.getElementById('product-grid');
    const allProducts = generateProducts(120);
    let currentProducts = [...allProducts];

    // Initial Render
    renderProducts(currentProducts, grid);

    // Filter Logic
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    const priceRange = document.getElementById('price-range');
    const priceDisplay = document.getElementById('price-display');

    // Category Filter
    categoryInputs.forEach(input => {
        input.addEventListener('change', () => {
            filterAndRender();
        });
    });

    // Price Filter
    if(priceRange) {
        priceDisplay.innerText = `Max Price: ₦${parseInt(priceRange.value).toLocaleString()}`;
        priceRange.addEventListener('input', (e) => {
            priceDisplay.innerText = `Max Price: ₦${parseInt(e.target.value).toLocaleString()}`;
            filterAndRender();
        });
    }

    function filterAndRender() {
        const selectedCats = Array.from(categoryInputs)
            .filter(i => i.checked)
            .map(i => i.value);
            
        const maxPrice = priceRange ? parseInt(priceRange.value) : 200000;

        currentProducts = allProducts.filter(p => {
            const matchCat = selectedCats.length === 0 || selectedCats.includes(p.category);
            const matchPrice = p.price <= maxPrice;
            return matchCat && matchPrice;
        });

        renderProducts(currentProducts, grid);
    }
}

function renderProducts(products, container) {
    container.innerHTML = '';
    
    // Lazy loading implementation structure
    products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card fade-in-up';
        card.style.animationDelay = `${(index % 10) * 0.05}s`; // Staggered delay for first few

        const priceFormatted = product.price.toLocaleString();

        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" loading="lazy" class="product-image">
            </div>
            <div class="product-details">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">₦${priceFormatted}</p>
                <button class="product-action" onclick="orderWhatsApp('${product.name}', ${product.price})">
                    Order on WhatsApp <i class="fab fa-whatsapp"></i>
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    // Re-trigger animations for new elements
    const newElements = container.querySelectorAll('.fade-in-up');
    observeElements(newElements);
}

/* --- WhatsApp Integration --- */
window.orderWhatsApp = function(productName, price) {
    const phone = "2349026673982"; // 09026673982 converted to intl format
    const text = encodeURIComponent(`Hello TechstinctStore, I’m interested in ordering ${productName} (₦${price.toLocaleString()}).`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
};

/* --- Animations (Intersection Observer) --- */
function initAnimations() {
    const elements = document.querySelectorAll('.fade-in-up');
    observeElements(elements);
}

function observeElements(elements) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
}

function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBg = document.querySelector('.hero-bg');
        if(heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}
