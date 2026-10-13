/**
 * CampusStationery - Checkout & Order Processing Module
 * Handles student checkout, validation, demo payment, stock decrement, and order receipt generation.
 */

// Generate unique demo order ID
function generateOrderId() {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `CS-ORD-${year}-${randomPart}`;
}

// Render Order Summary sidebar on Checkout page
function renderCheckoutSummary() {
  const summaryItemsList = document.getElementById('checkoutSummaryItems');
  const subtotalElem = document.getElementById('checkoutSubtotal');
  const discountElem = document.getElementById('checkoutDiscount');
  const discountRow = document.getElementById('checkoutDiscountRow');
  const handlingElem = document.getElementById('checkoutHandling');
  const totalElem = document.getElementById('checkoutTotal');

  if (!summaryItemsList || !subtotalElem || !totalElem) return;

  const cart = (typeof getCart === 'function') ? getCart() : [];
  if (cart.length === 0) {
    summaryItemsList.innerHTML = '<li class="list-group-item text-danger py-3">Your cart is empty. Please add stationery items before checkout.</li>';
    const submitBtn = document.getElementById('placeOrderBtn');
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  const totals = (typeof calculateCartTotals === 'function') ? calculateCartTotals() : {
    subtotal: 0,
    handlingFee: 0,
    finalTotal: 0,
    itemDetails: []
  };

  summaryItemsList.innerHTML = '';
  totals.itemDetails.forEach(item => {
    if (!item.product) return;
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between lh-sm align-items-center';
    li.innerHTML = `
      <div>
        <h6 class="my-0 fs-6">${item.product.name}</h6>
        <small class="text-muted">${item.quantity} &times; ${formatINR(item.product.price)}</small>
      </div>
      <span class="text-muted fw-semibold">${formatINR(item.itemSubtotal)}</span>
    `;
    summaryItemsList.appendChild(li);
  });

  subtotalElem.textContent = formatINR(totals.subtotal);
  if (handlingElem) handlingElem.textContent = totals.handlingFee === 0 ? 'FREE' : formatINR(totals.handlingFee);

  const totalDiscount = (totals.couponDiscount || 0) + (totals.studentDiscount || 0);
  if (discountRow && discountElem) {
    if (totalDiscount > 0) {
      discountRow.style.display = 'flex';
      discountElem.textContent = `- ${formatINR(totalDiscount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  totalElem.textContent = formatINR(totals.finalTotal);
}

// Process Order Placement
function handleOrderSubmission(event) {
  event.preventDefault();
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  // Validate form using validation.js
  if (typeof validateCheckoutForm === 'function' && !validateCheckoutForm(form)) {
    showToast('Please fix the highlighted errors before placing the order.', 'danger', 'bi-exclamation-triangle');
    return;
  }

  const cart = (typeof getCart === 'function') ? getCart() : [];
  if (cart.length === 0) {
    showToast('Cannot place order with an empty cart.', 'warning');
    return;
  }

  // Calculate totals
  const totals = (typeof calculateCartTotals === 'function') ? calculateCartTotals() : null;
  if (!totals) return;

  // Collect Customer Details
  const customer = {
    name: document.getElementById('checkoutName').value.trim(),
    rollNo: document.getElementById('checkoutRoll').value.trim().toUpperCase(),
    email: document.getElementById('checkoutEmail').value.trim(),
    phone: document.getElementById('checkoutPhone').value.trim(),
    department: document.getElementById('checkoutDept').value,
    year: document.getElementById('checkoutYear').value,
    notes: (document.getElementById('checkoutNotes') ? document.getElementById('checkoutNotes').value.trim() : '')
  };

  const pickupPoint = document.getElementById('checkoutPickupPoint').value;
  const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');
  const paymentMethod = paymentMethodInput ? paymentMethodInput.value : 'Cash on Campus Collection';

  // Decrement Inventory Stock in localStorage
  const currentProducts = (typeof getAllProducts === 'function') ? getAllProducts() : [];
  let stockError = false;

  for (const item of cart) {
    const pIndex = currentProducts.findIndex(p => p.id === item.productId);
    if (pIndex !== -1) {
      if (currentProducts[pIndex].stock < item.quantity) {
        showToast(`Stock depleted for ${currentProducts[pIndex].name}. Only ${currentProducts[pIndex].stock} remaining.`, 'danger');
        stockError = true;
        break;
      }
    }
  }

  if (stockError) return;

  // Deduct stock
  for (const item of cart) {
    const pIndex = currentProducts.findIndex(p => p.id === item.productId);
    if (pIndex !== -1) {
      currentProducts[pIndex].stock = Math.max(0, currentProducts[pIndex].stock - item.quantity);
    }
  }
  setStorage('campus_products', currentProducts);

  // Build New Order Object
  const now = new Date();
  const orderId = generateOrderId();
  const newOrder = {
    orderId: orderId,
    orderDate: now.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
    orderTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    timestamp: now.getTime(),
    customer: customer,
    items: totals.itemDetails.map(i => ({
      productId: i.productId,
      name: i.product ? i.product.name : 'Stationery Item',
      category: i.product ? i.product.category : 'General',
      price: i.product ? i.product.price : 0,
      quantity: i.quantity,
      subtotal: i.itemSubtotal
    })),
    subtotal: totals.subtotal,
    discount: (totals.couponDiscount || 0) + (totals.studentDiscount || 0),
    handlingFee: totals.handlingFee,
    finalTotal: totals.finalTotal,
    paymentMethod: paymentMethod,
    pickupPoint: pickupPoint,
    status: 'Order Placed' // Flow: Order Placed -> Packed at Counter -> Ready for Pickup -> Completed
  };

  // Save order to history
  const existingOrders = getStorage('campus_orders', []);
  existingOrders.unshift(newOrder); // newest first
  setStorage('campus_orders', existingOrders);

  // Clear cart
  setStorage('campus_cart', []);
  if (typeof updateNavbarCartCount === 'function') updateNavbarCartCount();

  // Show Order Confirmation
  displayOrderConfirmation(newOrder);
}

// Display Confirmation Receipt
function displayOrderConfirmation(order) {
  const checkoutSection = document.getElementById('checkoutMainSection');
  const confirmSection = document.getElementById('orderConfirmationSection');

  if (checkoutSection && confirmSection) {
    checkoutSection.style.display = 'none';
    confirmSection.style.display = 'block';

    document.getElementById('receiptOrderId').textContent = order.orderId;
    document.getElementById('receiptDateTime').textContent = `${order.orderDate} at ${order.orderTime}`;
    document.getElementById('receiptCustomerName').textContent = order.customer.name;
    document.getElementById('receiptCustomerRoll').textContent = order.customer.rollNo;
    document.getElementById('receiptCustomerDept').textContent = `${order.customer.department} (${order.customer.year})`;
    document.getElementById('receiptPickupPoint').textContent = order.pickupPoint;
    document.getElementById('receiptPaymentMethod').textContent = order.paymentMethod;
    document.getElementById('receiptTotalAmount').textContent = formatINR(order.finalTotal);

    const trackBtn = document.getElementById('receiptTrackOrderBtn');
    if (trackBtn) {
      trackBtn.href = `orders.html?orderId=${encodeURIComponent(order.orderId)}`;
    }

    const itemsTbody = document.getElementById('receiptItemsBody');
    if (itemsTbody) {
      itemsTbody.innerHTML = '';
      order.items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.name}</td>
          <td class="text-center">${item.quantity}</td>
          <td class="text-end">${formatINR(item.price)}</td>
          <td class="text-end fw-semibold">${formatINR(item.subtotal)}</td>
        `;
        itemsTbody.appendChild(tr);
      });
    }

    // Scroll to confirmation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // If modal fallback
    showToast(`Order placed successfully! Order ID: ${order.orderId}`, 'success', 'bi-check-circle-fill');
    setTimeout(() => {
      window.location.href = 'orders.html';
    }, 1500);
  }
}

// Setup payment method conditional instructions & auto-populate
function initCheckoutPage() {
  renderCheckoutSummary();

  // Prepopulate if saved student demo session exists
  const savedUser = getStorage('campus_user', null);
  if (savedUser) {
    const nameInput = document.getElementById('checkoutName');
    const rollInput = document.getElementById('checkoutRoll');
    const emailInput = document.getElementById('checkoutEmail');
    const phoneInput = document.getElementById('checkoutPhone');
    const deptInput = document.getElementById('checkoutDept');
    const yearInput = document.getElementById('checkoutYear');

    if (nameInput && savedUser.name) nameInput.value = savedUser.name;
    if (rollInput && savedUser.rollNo) rollInput.value = savedUser.rollNo;
    if (emailInput && savedUser.email) emailInput.value = savedUser.email;
    if (phoneInput && savedUser.phone) phoneInput.value = savedUser.phone;
    if (deptInput && savedUser.department) deptInput.value = savedUser.department;
    if (yearInput && savedUser.year) yearInput.value = savedUser.year;
  }

  // Payment radio toggle instructions
  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const upiDetails = document.getElementById('upiPaymentDetails');
  const cardDetails = document.getElementById('cardPaymentDetails');
  const cashDetails = document.getElementById('cashPaymentDetails');

  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (upiDetails) upiDetails.style.display = radio.value === 'UPI Demo Payment' ? 'block' : 'none';
      if (cardDetails) cardDetails.style.display = radio.value === 'College ID Card / Student Wallet' ? 'block' : 'none';
      if (cashDetails) cashDetails.style.display = radio.value === 'Cash on Campus Collection' ? 'block' : 'none';
    });
  });

  const form = document.getElementById('checkoutForm');
  if (form) {
    form.addEventListener('submit', handleOrderSubmission);
  }
}

// Global window exports
if (typeof window !== 'undefined') {
  window.initCheckoutPage = initCheckoutPage;
  window.renderCheckoutSummary = renderCheckoutSummary;
  window.handleOrderSubmission = handleOrderSubmission;
  window.generateOrderId = generateOrderId;
}

