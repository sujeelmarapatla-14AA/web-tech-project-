/**
 * CampusStationery - Product Catalog & Inventory Module
 * Manages stationery inventory, catalog filtering, search, sorting, and detail modal.
 */

// Initial default seed stationery catalog (Indian College Stationery Store)
const DEFAULT_PRODUCTS = [
  // --- Category 1: Writing materials ---
  {
    id: 'STN-101',
    name: 'Classmate Octane Gel Pen Set (Pack of 5, Blue & Black)',
    category: 'Writing materials',
    price: 125,
    originalPrice: 150,
    stock: 48,
    rating: 4.8,
    reviews: 142,
    badge: 'Bestseller',
    description: 'Smooth Japanese waterproof gel ink technology with comfortable rubber grip. Ideal for college examinations, notes, and neat handwriting.',
    specifications: [
      'Ink Colors: 3 Blue, 2 Black',
      'Tip Size: 0.5 mm fine point',
      'Refillable: Yes',
      'Waterproof smudge-resistant ink'
    ],
    image: 'https://images.unsplash.com/photo-1585336261026-61e8c95972d3?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-writing.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1585336261026-61e8c95972d3?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'STN-102',
    name: 'Faber-Castell Textliner Highlighters (Set of 4 Pastel Colors)',
    category: 'Writing materials',
    price: 140,
    originalPrice: 175,
    stock: 28,
    rating: 4.7,
    reviews: 89,
    badge: 'Popular',
    description: 'Soft pastel shades that do not bleed through notebook pages. Chisel tip allows 3 different line widths (1mm, 2mm, 5mm).',
    specifications: [
      'Colors: Pastel Lemon, Mint, Rose, Lavender',
      'Tip: Universal 3-line chisel tip',
      'Non-toxic water-based ink',
      'Anti-bleed through thin notebook paper'
    ],
    image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-writing.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'STN-103',
    name: 'Camlin Kokuyo 0.7mm Mechanical Pencil + 2B Polymer Lead Pack',
    category: 'Writing materials',
    price: 65,
    originalPrice: 80,
    stock: 35,
    rating: 4.6,
    reviews: 64,
    badge: 'Essential',
    description: 'Precision mechanical drafting pencil with metal lead sleeve, eraser cap, and cushioned rubber grip for technical engineering drawings.',
    specifications: [
      'Lead Diameter: 0.7 mm (2B Extra Dark)',
      'Includes 1 pack of 20 lead refills',
      'Built-in eraser with twist mechanism'
    ],
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-writing.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'STN-104',
    name: 'Reynolds 045 Fine Carbure Ballpoint Pens (Pack of 10 Blue)',
    category: 'Writing materials',
    price: 90,
    originalPrice: 100,
    stock: 55,
    rating: 4.5,
    reviews: 210,
    badge: 'Value Pack',
    description: 'The classic Indian college ball pen known for legendary smooth non-stop writing during long 3-hour university semester exams.',
    specifications: [
      'Pack Size: 10 Blue ballpoint pens',
      'Laser tip 0.7 mm for sharp writing',
      'Long-lasting ink reservoir'
    ],
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-writing.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=300&q=80'
    ]
  },

  // --- Category 2: Notebooks and record books ---
  {
    id: 'STN-201',
    name: 'Classmate Pulse Spiral Bound Long Notebook (300 Pages, Ruled)',
    category: 'Notebooks and record books',
    price: 160,
    originalPrice: 190,
    stock: 42,
    rating: 4.9,
    reviews: 312,
    badge: 'Bestseller',
    description: 'Premium elemental chlorine-free paper with 68 GSM brightness. Sturdy spiral twin-wire binding allows 360-degree flat opening on classroom desks.',
    specifications: [
      'Page Count: 300 pages (Single line ruled)',
      'Paper Quality: 68 GSM eco-friendly white paper',
      'Binding: Anti-rust twin wire spiral',
      'Size: A4 (29.7 x 21 cm)'
    ],
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-notebooks.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'STN-202',
    name: 'Standard Engineering Practical Record Book (Hardbound, 160 Pages)',
    category: 'Notebooks and record books',
    price: 95,
    originalPrice: 120,
    stock: 38,
    rating: 4.7,
    reviews: 175,
    badge: 'Official Format',
    description: 'Official university prescribed hardbound lab record book with one side ruled and alternate side unruled for circuit diagrams and data tables.',
    specifications: [
      'Format: One side ruled, one side blank plain',
      'Pages: 160 pages heavyweight 70 GSM paper',
      'Hardbound durable rexine laminated spine',
      'Includes university index & marks evaluation table'
    ],
    image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-notebooks.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'STN-203',
    name: 'Graph Notebook A4 (Centimeter Grid, 80 Pages, Perforated)',
    category: 'Notebooks and record books',
    price: 45,
    originalPrice: 60,
    stock: 60,
    rating: 4.6,
    reviews: 98,
    badge: 'Lab Required',
    description: 'High-precision millimeter and centimeter grid graph paper for Physics, Electrical Engineering, and Math plotting assignments.',
    specifications: [
      'Grid Size: 1 mm / 1 cm precision green lines',
      'Pages: 80 micro-perforated tear-out pages',
      'Paper weight: 80 GSM heavy smooth paper'
    ],
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-notebooks.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'STN-204',
    name: 'Classmate Rough Observation Notebook (120 Pages, Softcover)',
    category: 'Notebooks and record books',
    price: 50,
    originalPrice: 65,
    stock: 18,
    rating: 4.4,
    reviews: 82,
    badge: 'Low Stock',
    description: 'Durable everyday rough notebook for lab experiment observations, instant readings, and classroom lecture notes.',
    specifications: [
      'Pages: 120 pages',
      'Cover: Glossy moisture-resistant card cover',
      'Binding: Center stitched staple'
    ],
    image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-notebooks.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=300&q=80'
    ]
  },

  // --- Category 3: Drawing supplies ---
  {
    id: 'STN-301',
    name: 'Omega Engineering Mini Drafter with Sturdy Canvas Carrying Bag',
    category: 'Drawing supplies',
    price: 480,
    originalPrice: 580,
    stock: 15,
    rating: 4.9,
    reviews: 167,
    badge: 'Essential for B.Tech',
    description: 'Heavy-duty steel arms with smooth 360-degree protractor head and unbreakable acrylic scales. Universally accepted for Engineering Graphics.',
    specifications: [
      'Material: Powder-coated steel rods with acrylic scales',
      'Includes heavy-duty clamping screw with brass threads',
      'Storage: Water-resistant zipped canvas shoulder bag',
      'Approved for university CAD & ED examinations'
    ],
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-drawing.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'STN-302',
    name: 'Engineering Drawing Imperial Sheets A2 (Pack of 10, 150 GSM)',
    category: 'Drawing supplies',
    price: 120,
    originalPrice: 150,
    stock: 25,
    rating: 4.7,
    reviews: 94,
    badge: 'Standard Size',
    description: 'Extra smooth 150 GSM cartridge sheets that withstand repeated erasing without tearing or fuzzing. Standard A2 engineering graphics format.',
    specifications: [
      'Pack: 10 individual sheets',
      'Size: A2 (420 x 594 mm)',
      'Weight: 150 GSM heavyweight non-absorbent'
    ],
    image: 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-drawing.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'STN-303',
    name: 'Omega French Curves Set (Pack of 3 Clear Acrylic Curves)',
    category: 'Drawing supplies',
    price: 75,
    originalPrice: 95,
    stock: 22,
    rating: 4.5,
    reviews: 58,
    badge: 'Popular',
    description: 'Set of three acrylic curved templates with double-beveled inking edges for smooth conic sections, ellipses, and smooth parabolas in engineering drawing.',
    specifications: [
      'Quantity: 3 distinct curve profiles',
      'Thickness: 2.5 mm smoke acrylic with beveled edges',
      'Optical clarity with inking edge'
    ],
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-drawing.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=300&q=80'
    ]
  },

  // --- Category 4: Laboratory supplies ---
  {
    id: 'STN-401',
    name: 'Unisex Cotton College Laboratory Coat (White, All Sizes Available)',
    category: 'Laboratory supplies',
    price: 350,
    originalPrice: 450,
    stock: 14,
    rating: 4.8,
    reviews: 215,
    badge: 'Lab Mandatory',
    description: '100% breathable pure cotton white apron with reinforced double stitching, side pockets, and chest pen slot. Mandatory for Chemistry & Physics labs.',
    specifications: [
      'Material: 100% Drill Cotton (Anti-static)',
      'Length: Knee length with rear slit',
      'Pockets: 2 waist pockets, 1 chest pocket',
      'Sizes: S, M, L, XL available at collection counter'
    ],
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-lab.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'STN-402',
    name: 'Polycarbonate Chemical Splash Safety Goggles (Anti-Fog Clear)',
    category: 'Laboratory supplies',
    price: 110,
    originalPrice: 150,
    stock: 24,
    rating: 4.6,
    reviews: 73,
    badge: 'Safety First',
    description: 'High-impact resistant wrap-around safety eyewear with indirect side ventilation ports preventing chemical vapour condensation.',
    specifications: [
      'Lens: Optical grade zero-distortion polycarbonate',
      'Features: Anti-scratch and anti-fog coating',
      'Strap: Adjustable silicone elastic headband'
    ],
    image: 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-lab.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'STN-403',
    name: 'Chemistry Filter Paper & Butter Paper Pack (100 Sheets Grade 1)',
    category: 'Laboratory supplies',
    price: 40,
    originalPrice: 55,
    stock: 8,
    rating: 4.5,
    reviews: 41,
    badge: 'Low Stock',
    description: 'Standard qualitative ashless filter circles and moisture-resistant butter paper sheets for weighing chemical reagents and organic synthesis.',
    specifications: [
      'Filter circles: 11 cm diameter, Medium porosity',
      'Butter paper: 10 x 10 cm pre-cut squares',
      'Ash content: < 0.06%'
    ],
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-lab.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=300&q=80'
    ]
  },

  // --- Category 5: Engineering stationery ---
  {
    id: 'STN-501',
    name: 'Casio fx-991CW ClassWiz Scientific Calculator (540 Functions)',
    category: 'Engineering stationery',
    price: 1295,
    originalPrice: 1495,
    stock: 12,
    rating: 4.95,
    reviews: 450,
    badge: 'University Approved',
    description: 'Latest high-resolution natural textbook display with QR code generation. Permitted non-programmable calculator for all engineering semester exams.',
    specifications: [
      'Functions: 540 built-in math & engineering operations',
      'Matrix, Vector, Integration, Differentiation, Complex Numbers',
      'Display: 4-gradation natural textbook display',
      'Power: Two-way (Solar + Battery backup with 3-year warranty)'
    ],
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-engineering.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'STN-502',
    name: 'Engineering Stencil Scale with Flowchart & Electronic Symbols',
    category: 'Engineering stationery',
    price: 60,
    originalPrice: 80,
    stock: 45,
    rating: 4.6,
    reviews: 112,
    badge: 'Student Choice',
    description: 'Precision transparent green stencil featuring logic gates, flowchart shapes, capacitor, resistor, and isometric circles for engineering design.',
    specifications: [
      'Length: 30 cm ruler with mm/inch markings',
      'Cutouts: Logic gates (AND, OR, NOT), standard flowchart nodes',
      'Material: Shatterproof flexible PET plastic'
    ],
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-engineering.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=300&q=80'
    ]
  },

  // --- Category 6: Exam essentials ---
  {
    id: 'STN-601',
    name: 'Transparent Exam Writing Pad / Clipboard (Heavy Acrylic)',
    category: 'Exam essentials',
    price: 85,
    originalPrice: 110,
    stock: 36,
    rating: 4.7,
    reviews: 180,
    badge: 'Exam Mandatory',
    description: '100% transparent shatterproof acrylic writing board strictly compliant with university examination hall guidelines.',
    specifications: [
      'Material: Clear see-through acrylic (3.5 mm thick)',
      'Clip: Rust-free stainless steel heavy lever clamp',
      'Size: 35 x 24 cm (Accommodates A4 and Legal sheets)',
      'Corner: Smooth rounded edges for safety'
    ],
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-exam.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'STN-602',
    name: 'Clear Transparent Exam Zipper Stationery Pouch',
    category: 'Exam essentials',
    price: 45,
    originalPrice: 60,
    stock: 65,
    rating: 4.8,
    reviews: 290,
    badge: 'Exam Rule',
    description: 'Waterproof transparent PVC zipper pouch permitted inside university examination centers. Holds up to 8 pens, eraser, scales, and hall ticket.',
    specifications: [
      'Dimensions: 21 x 11 cm',
      'Material: 0.3 mm heavy-gauge transparent PVC',
      'Sturdy zip closure with pull cord'
    ],
    image: 'https://images.unsplash.com/photo-1585336261026-61e8c95972d3?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-exam.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1585336261026-61e8c95972d3?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'STN-603',
    name: 'All-in-One Semester Exam Survival Combo Kit',
    category: 'Exam essentials',
    price: 210,
    originalPrice: 280,
    stock: 22,
    rating: 4.9,
    reviews: 320,
    badge: 'Special Combo',
    description: 'Complete examination package including 1 transparent acrylic clipboard, 4 ballpoint pens (3 blue, 1 black), 1 clear pouch, 1 15cm ruler, and 1 non-dust eraser.',
    specifications: [
      'Includes 1 Transparent Acrylic Exam Pad',
      'Includes 1 Clear Zipper Pouch',
      'Includes 4 University exam-grade pens',
      'Includes ruler, non-dust eraser, and sharpener'
    ],
    image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=600&q=80',
    fallbackImage: 'assets/images/category-exam.svg',
    thumbnails: [
      'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=300&q=80'
    ]
  }
];

// Initialize catalog in localStorage if missing
function initProductCatalog() {
  const existing = getStorage('campus_products', null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    setStorage('campus_products', DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  }
  return existing;
}

// Get all products
function getAllProducts() {
  const prods = getStorage('campus_products', null);
  if (!prods || !Array.isArray(prods) || prods.length === 0) {
    return initProductCatalog();
  }
  return prods;
}

// Get single product by ID
function getProductById(id) {
  const prods = getAllProducts();
  return prods.find(p => p.id === id) || null;
}

// Update single product stock
function updateProductStock(id, newStock) {
  const prods = getAllProducts();
  const index = prods.findIndex(p => p.id === id);
  if (index !== -1) {
    prods[index].stock = Math.max(0, parseInt(newStock, 10));
    setStorage('campus_products', prods);
    return true;
  }
  return false;
}

// Filter and sort products
function filterAndSortProducts(category = 'all', searchTerm = '', sortOption = 'default', maxPrice = null) {
  let list = getAllProducts();

  // Category filter
  if (category && category.toLowerCase() !== 'all') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Search filter
  if (searchTerm && searchTerm.trim() !== '') {
    const q = searchTerm.trim().toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // Max price filter
  if (maxPrice !== null && !isNaN(maxPrice) && maxPrice > 0) {
    list = list.filter(p => p.price <= maxPrice);
  }

  // Sort
  switch (sortOption) {
    case 'price-low':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      list.sort((a, b) => b.rating - a.rating);
      break;
    case 'name-asc':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'stock':
      list.sort((a, b) => b.stock - a.stock);
      break;
    default:
      // default: keep original list order
      break;
  }

  return list;
}

// Render product card HTML string
function createProductCardHTML(product, columnClass = 'col-12 col-sm-6 col-md-6 col-xl-4 mb-4') {
  const stockInfo = getStockStatus(product.stock);
  const badgeHTML = product.badge ? `<span class="product-badge bg-primary text-white">${product.badge}</span>` : '';
  const origPriceHTML = product.originalPrice && product.originalPrice > product.price 
    ? `<span class="product-original-price">${formatINR(product.originalPrice)}</span>` 
    : '';

  const addBtnDisabled = !stockInfo.isAvailable ? 'disabled' : '';
  const addBtnText = !stockInfo.isAvailable ? 'Out of Stock' : '<i class="bi bi-cart-plus me-1"></i> Add';

  return `
    <div class="${columnClass}">
      <div class="product-card" data-id="${product.id}">
        ${badgeHTML}
        <div class="product-img-container" onclick="openProductDetailsModal('${product.id}')" title="Click to view details">
          <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='${product.fallbackImage || 'assets/images/category-writing.svg'}';" loading="lazy">
        </div>
        <div class="product-card-body">
          <div class="product-category-label">${product.category}</div>
          <h3 class="product-title">
            <a href="javascript:void(0)" onclick="openProductDetailsModal('${product.id}')">${product.name}</a>
          </h3>
          <div class="product-rating">
            <i class="bi bi-star-fill text-warning"></i>
            <span class="fw-bold text-dark ms-1">${product.rating}</span>
            <span class="text-muted ms-1">(${product.reviews})</span>
          </div>
          <div class="product-price-row">
            <span class="product-price">${formatINR(product.price)}</span>
            ${origPriceHTML}
          </div>
          <div class="product-stock-status">
            <span class="badge ${stockInfo.badgeClass}">${stockInfo.label}</span>
          </div>
          <div class="product-card-footer">
            <button type="button" class="btn btn-sm btn-outline-secondary flex-grow-1" onclick="openProductDetailsModal('${product.id}')">
              <i class="bi bi-eye"></i> Details
            </button>
            <button type="button" class="btn btn-sm btn-primary flex-grow-1" ${addBtnDisabled} onclick="addToCart('${product.id}', 1)">
              ${addBtnText}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Open Product Details Modal with interactive quantity & instant cost calculator
function openProductDetailsModal(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const modalElem = document.getElementById('productDetailModal');
  if (!modalElem) return;

  const stockInfo = getStockStatus(product.stock);

  // Set modal details
  document.getElementById('modalProdTitle').textContent = product.name;
  document.getElementById('modalProdCategory').textContent = product.category;
  document.getElementById('modalProdPrice').textContent = formatINR(product.price);
  
  const origPriceElem = document.getElementById('modalProdOrigPrice');
  if (origPriceElem) {
    if (product.originalPrice && product.originalPrice > product.price) {
      origPriceElem.textContent = formatINR(product.originalPrice);
      origPriceElem.style.display = 'inline';
    } else {
      origPriceElem.style.display = 'none';
    }
  }

  const badgeElem = document.getElementById('modalProdBadge');
  if (badgeElem) {
    badgeElem.className = `badge ${stockInfo.badgeClass}`;
    badgeElem.textContent = stockInfo.label;
  }

  document.getElementById('modalProdDesc').textContent = product.description;

  // Specs list
  const specsList = document.getElementById('modalProdSpecs');
  if (specsList) {
    specsList.innerHTML = '';
    if (product.specifications && product.specifications.length > 0) {
      product.specifications.forEach(spec => {
        const li = document.createElement('li');
        li.textContent = spec;
        specsList.appendChild(li);
      });
    }
  }

  // Main Image and thumbnails
  const mainImg = document.getElementById('modalMainImage');
  if (mainImg) {
    mainImg.src = product.image;
    mainImg.alt = product.name;
    mainImg.onerror = () => { mainImg.src = product.fallbackImage || 'assets/images/category-writing.svg'; };
  }

  const thumbContainer = document.getElementById('modalThumbnails');
  if (thumbContainer) {
    thumbContainer.innerHTML = '';
    const allImgs = [product.image, ...(product.thumbnails || [])];
    // unique only
    const uniqueImgs = [...new Set(allImgs)];
    uniqueImgs.forEach((src, idx) => {
      const thumb = document.createElement('img');
      thumb.src = src;
      thumb.className = `modal-thumb ${idx === 0 ? 'active' : ''}`;
      thumb.alt = `${product.name} thumbnail ${idx + 1}`;
      thumb.onerror = () => { thumb.src = product.fallbackImage || 'assets/images/category-writing.svg'; };
      thumb.addEventListener('click', () => {
        mainImg.src = src;
        thumbContainer.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
      thumbContainer.appendChild(thumb);
    });
  }

  // Interactive quantity & cost calculator inside modal
  const qtyInput = document.getElementById('modalQtyInput');
  const subtotalDisplay = document.getElementById('modalCalcSubtotal');
  const addCartBtn = document.getElementById('modalAddToCartBtn');

  if (qtyInput && subtotalDisplay) {
    qtyInput.value = 1;
    qtyInput.max = product.stock;

    const updateModalCost = () => {
      let qty = parseInt(qtyInput.value, 10);
      if (isNaN(qty) || qty < 1) qty = 1;
      if (qty > product.stock) {
        qty = product.stock;
        qtyInput.value = product.stock;
        showToast(`Maximum available stock is ${product.stock} units.`, 'warning');
      }
      qtyInput.value = qty;
      const calcResult = calculateStationeryCost(product.price, qty, 0, 0);
      subtotalDisplay.textContent = formatINR(calcResult.baseCost);
    };

    qtyInput.oninput = updateModalCost;
    updateModalCost();

    const minusBtn = document.getElementById('modalQtyMinus');
    const plusBtn = document.getElementById('modalQtyPlus');
    if (minusBtn) {
      minusBtn.onclick = () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val > 1) {
          qtyInput.value = val - 1;
          updateModalCost();
        }
      };
    }
    if (plusBtn) {
      plusBtn.onclick = () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val < product.stock) {
          qtyInput.value = val + 1;
          updateModalCost();
        } else {
          showToast(`Cannot order more than available stock (${product.stock}).`, 'warning');
        }
      };
    }
  }

  if (addCartBtn) {
    if (!stockInfo.isAvailable) {
      addCartBtn.disabled = true;
      addCartBtn.textContent = 'Out of Stock';
    } else {
      addCartBtn.disabled = false;
      addCartBtn.innerHTML = '<i class="bi bi-cart-plus me-1"></i> Add to Cart';
      addCartBtn.onclick = () => {
        const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
        if (typeof addToCart === 'function') {
          addToCart(product.id, qty);
          if (window.bootstrap) {
            const modal = window.bootstrap.Modal.getInstance(modalElem);
            if (modal) modal.hide();
          }
        }
      };
    }
  }

  // Open modal
  if (window.bootstrap) {
    const modal = new window.bootstrap.Modal(modalElem);
    modal.show();
  }
}

// Global window exports
if (typeof window !== 'undefined') {
  window.getAllProducts = getAllProducts;
  window.getProductById = getProductById;
  window.createProductCardHTML = createProductCardHTML;
  window.openProductDetailsModal = openProductDetailsModal;
  window.initProductCatalog = initProductCatalog;
}

