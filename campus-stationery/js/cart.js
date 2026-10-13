/**
 * CampusStationery - Shopping Cart Module
 * Handles adding/removing items, quantity controls, cart persistence, coupon codes, and summary calculations.
 */

// Coupon definitions for demo discounts
const VALID_COUPONS = {
  'CAMPUS10': { type: 'percent', value: 10, minOrder: 0, label: '10% Campus Student Discount' },
  'EXAM15': { type: 'percent', value: 15, minOrder: 200, label: '15% Exam Essentials Discount' },
  'STATIONERY50': { type: 'flat', value: 50, minOrder: 300, label: '₹50 Off on orders above ₹300' }
};

// Retrieve current cart from localStorage
function getCart() {
  return getStorage('campus_cart', []);
}

// Save cart and update all badge indicators
function saveCart(cart) {
  setStorage('campus_cart', cart);
  updateNavbarCartCount();
}

// Add product to cart with stock validation
function addToCart(productId, qty = 1) {
  const product = (typeof getProductById === 'function') 
    ? getProductById(productId) 
    : (getStorage('campus_products', []).find(p => p.id === productId));

  if (!product) {
    showToast('Product not found.', 'danger');
    return false;
  }

  const addQty = parseInt(qty, 10);
  if (isNaN(addQty) || addQty <= 0) {
    showToast('Invalid quantity.', 'warning');
    return false;
  }

  if (product.stock <= 0) {
    showToast(`Sorry, "${product.name}" is currently out of stock.`, 'danger', 'bi-x-circle');
    return false;
  }

  let cart = getCart();
  const existingIndex = cart.findIndex(item => item.productId === productId);
  const currentInCart = existingIndex > -1 ? cart[existingIndex].quantity : 0;
  const newTotalQty = currentInCart + addQty;

  if (newTotalQty > product.stock) {
    const allowedAdd = product.stock - currentInCart;
    if (allowedAdd <= 0) {
      showToast(`Cannot add more. You already have all ${product.stock} available units in your cart.`, 'warning', 'bi-exclamation-triangle');
      return false;
    } else {
      showToast(`Only ${allowedAdd} additional unit(s) available in stock.`, 'warning');
      return false;
    }
  }

  if (existingIndex > -1) {
    cart[existingIndex].quantity = newTotalQty;
  } else {
    cart.push({
      productId: product.id,
      quantity: addQty
    });
  }

  saveCart(cart);
  showToast(`Added <strong>${product.name}</strong> to your cart!`, 'success', 'bi-bag-check-fill');

  // If on cart page, re-render
  if (typeof document !== 'undefined' && document.getElementById('cartItemsTableBody')) {
    renderCartPage();
  }

  return true;
}

// Update quantity of an item in the cart
function updateCartQuantity(productId, newQty) {
  const qty = parseInt(newQty, 10);
  let cart = getCart();
  const index = cart.findIndex(i => i.productId === productId);

  if (index === -1) return;

  if (isNaN(qty) || qty <= 0) {
    removeFromCart(productId);
    return;
  }

  const product = (typeof getProductById === 'function') ? getProductById(productId) : null;
  if (product && qty > product.stock) {
    cart[index].quantity = product.stock;
    saveCart(cart);
    showToast(`Maximum available stock for ${product.name} is ${product.stock} units.`, 'warning');
    if (document.getElementById('cartItemsTableBody')) renderCartPage();
    return;
  }

  cart[index].quantity = qty;
  saveCart(cart);
  if (typeof document !== 'undefined' && document.getElementById('cartItemsTableBody')) {
    renderCartPage();
  }
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = getCart();
  const prod = (typeof getProductById === 'function') ? getProductById(productId) : null;
  const name = prod ? prod.name : 'Item';

  cart = cart.filter(i => i.productId !== productId);
  saveCart(cart);
  showToast(`Removed "${name}" from cart.`, 'info', 'bi-trash');

  if (typeof document !== 'undefined' && document.getElementById('cartItemsTableBody')) {
    renderCartPage();
  }
}

// Clear entire cart
function clearCart() {
  if (getCart().length === 0) return;
  if (confirm('Are you sure you want to clear your stationery cart?')) {
    saveCart([]);
    showToast('Your cart has been cleared.', 'info');
    if (typeof document !== 'undefined' && document.getElementById('cartItemsTableBody')) {
      renderCartPage();
    }
  }
}

// Calculate comprehensive cart totals with discounts and charges
function calculateCartTotals(appliedCoupon = null, applyStudentWelfare = false) {
  const cart = getCart();
  let subtotal = 0;
  let totalItemsCount = 0;

  const itemDetails = cart.map(item => {
    const prod = (typeof getProductById === 'function') ? getProductById(item.productId) : null;
    const price = prod ? prod.price : 0;
    const itemSubtotal = price * item.quantity;
    subtotal += itemSubtotal;
    totalItemsCount += item.quantity;
    return {
      ...item,
      product: prod,
      itemSubtotal
    };
  });

  // Calculate discounts
  let couponDiscount = 0;
  let couponInfo = null;
  if (appliedCoupon && VALID_COUPONS[appliedCoupon]) {
    const c = VALID_COUPONS[appliedCoupon];
    if (subtotal >= c.minOrder) {
      if (c.type === 'percent') {
        couponDiscount = (subtotal * c.value) / 100;
      } else if (c.type === 'flat') {
        couponDiscount = Math.min(c.value, subtotal);
      }
      couponInfo = c;
    }
  }

  // Student welfare subsidy (5% discount)
  let studentDiscount = 0;
  if (applyStudentWelfare) {
    studentDiscount = (subtotal * 5) / 100;
  }

  // Campus Store Service & Packing fee (₹10, free for orders above ₹200)
  const handlingFee = (subtotal > 0 && subtotal < 200) ? 10 : 0;

  // Grand Total calculation
  const totalDiscount = couponDiscount + studentDiscount;
  const finalTotal = Math.max(0, (subtotal - totalDiscount) + handlingFee);

  return {
    itemDetails,
    subtotal,
    totalItemsCount,
    couponDiscount,
    couponInfo,
    studentDiscount,
    handlingFee,
    finalTotal
  };
}

// Update navbar cart badge count across any active page
function updateNavbarCartCount() {
  if (typeof document === 'undefined') return;
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const badgeElems = document.querySelectorAll('.cart-count-badge');
  badgeElems.forEach(elem => {
    elem.textContent = totalCount;
    elem.style.display = totalCount > 0 ? 'inline-block' : 'none';
  });
}

// Render the cart page (cart.html)
let currentAppliedCoupon = null;
let isStudentWelfareChecked = false;

function renderCartPage() {
  const tableBody = document.getElementById('cartItemsTableBody');
  const emptyState = document.getElementById('cartEmptyState');
  const cartContent = document.getElementById('cartContentSection');
  if (!tableBody || !emptyState || !cartContent) return;

  const cart = getCart();
  if (cart.length === 0) {
    emptyState.style.display = 'block';
    cartContent.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  cartContent.style.display = 'block';

  const totals = calculateCartTotals(currentAppliedCoupon, isStudentWelfareChecked);
  tableBody.innerHTML = '';

  totals.itemDetails.forEach(item => {
    if (!item.product) return;
    const p = item.product;
    const stockStatus = getStockStatus(p.stock);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="align-middle" style="min-width: 250px;">
        <div class="d-flex align-items-center gap-3">
          <img src="${p.image}" alt="${p.name}" class="rounded border" style="width: 55px; height: 55px; object-fit: contain; background: #fff;" onerror="this.onerror=null; this.src='${p.fallbackImage || 'assets/images/category-writing.svg'}';">
          <div>
            <h6 class="mb-0 fw-semibold">${p.name}</h6>
            <small class="text-muted d-block">${p.category} &bull; <span class="badge ${stockStatus.badgeClass}">${stockStatus.label}</span></small>
          </div>
        </div>
      </td>
      <td class="align-middle text-nowrap fw-semibold">${formatINR(p.price)}</td>
      <td class="align-middle">
        <div class="qty-control">
          <button type="button" class="qty-btn" onclick="updateCartQuantity('${p.id}', ${item.quantity - 1})" aria-label="Decrease quantity">
            <i class="bi bi-dash"></i>
          </button>
          <input type="number" class="qty-input" value="${item.quantity}" min="1" max="${p.stock}" onchange="updateCartQuantity('${p.id}', this.value)" aria-label="Item quantity">
          <button type="button" class="qty-btn" onclick="updateCartQuantity('${p.id}', ${item.quantity + 1})" aria-label="Increase quantity" ${item.quantity >= p.stock ? 'disabled' : ''}>
            <i class="bi bi-plus"></i>
          </button>
        </div>
      </td>
      <td class="align-middle fw-bold text-primary text-nowrap">${formatINR(item.itemSubtotal)}</td>
      <td class="align-middle text-center">
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${p.id}')" title="Remove item">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  // Update Summary Card
  const subtotalElem = document.getElementById('cartSummarySubtotal');
  const discountElem = document.getElementById('cartSummaryDiscount');
  const discountRow = document.getElementById('cartDiscountRow');
  const handlingElem = document.getElementById('cartSummaryHandling');
  const totalElem = document.getElementById('cartSummaryTotal');
  const itemsCountElem = document.getElementById('cartSummaryCount');

  if (subtotalElem) subtotalElem.textContent = formatINR(totals.subtotal);
  if (itemsCountElem) itemsCountElem.textContent = totals.totalItemsCount;
  
  const totalDiscount = totals.couponDiscount + totals.studentDiscount;
  if (discountRow && discountElem) {
    if (totalDiscount > 0) {
      discountRow.style.display = 'flex';
      discountElem.textContent = `- ${formatINR(totalDiscount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (handlingElem) {
    handlingElem.textContent = totals.handlingFee === 0 ? 'FREE' : formatINR(totals.handlingFee);
    if (totals.handlingFee === 0) handlingElem.className = 'text-success fw-semibold';
  }

  if (totalElem) totalElem.textContent = formatINR(totals.finalTotal);
}

// Setup listeners on Cart page
function initCartPageListeners() {
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const couponInput = document.getElementById('couponCodeInput');
  const couponFeedback = document.getElementById('couponFeedback');
  const studentWelfareCheck = document.getElementById('studentWelfareCheck');
  const clearCartBtn = document.getElementById('clearCartBtn');

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (!code) {
        showToast('Please enter a coupon code.', 'warning');
        return;
      }
      if (VALID_COUPONS[code]) {
        currentAppliedCoupon = code;
        if (couponFeedback) {
          couponFeedback.className = 'text-success small mt-1';
          couponFeedback.innerHTML = `<i class="bi bi-check-circle me-1"></i> Coupon "${code}" applied: ${VALID_COUPONS[code].label}`;
        }
        showToast(`Promo coupon "${code}" applied successfully!`, 'success');
        renderCartPage();
      } else {
        if (couponFeedback) {
          couponFeedback.className = 'text-danger small mt-1';
          couponFeedback.innerHTML = `<i class="bi bi-x-circle me-1"></i> Invalid coupon code. Try <strong>CAMPUS10</strong> or <strong>EXAM15</strong>`;
        }
        showToast('Invalid coupon code.', 'danger');
      }
    });
  }

  if (studentWelfareCheck) {
    studentWelfareCheck.addEventListener('change', (e) => {
      isStudentWelfareChecked = e.target.checked;
      renderCartPage();
    });
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }
}

// Global window exports
if (typeof window !== 'undefined') {
  window.getCart = getCart;
  window.saveCart = saveCart;
  window.addToCart = addToCart;
  window.updateCartQuantity = updateCartQuantity;
  window.removeFromCart = removeFromCart;
  window.clearCart = clearCart;
  window.calculateCartTotals = calculateCartTotals;
  window.updateNavbarCartCount = updateNavbarCartCount;
  window.renderCartPage = renderCartPage;
}
