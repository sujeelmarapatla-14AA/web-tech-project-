/**
 * CampusStationery - Smart Utilities & Helper Functions
 * Includes: Clock, Calculator, Toast alerts, Currency formatter, Surprise Me picker, Storage handlers.
 */

// Format numbers into Indian Rupees currency format
function formatINR(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(num);
}

// LocalStorage safe wrapper
function getStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
    return false;
  }
}

// Generate stock status label, badge classes, and availability flag
function getStockStatus(stock) {
  const qty = parseInt(stock, 10);
  if (isNaN(qty) || qty <= 0) {
    return {
      label: 'Out of Stock',
      badgeClass: 'badge-out-of-stock',
      textClass: 'text-danger',
      isAvailable: false
    };
  } else if (qty <= 10) {
    return {
      label: `Low Stock (${qty} left)`,
      badgeClass: 'badge-low-stock',
      textClass: 'text-warning',
      isAvailable: true
    };
  } else {
    return {
      label: `In Stock (${qty})`,
      badgeClass: 'badge-in-stock',
      textClass: 'text-success',
      isAvailable: true
    };
  }
}

// Display modern Toast alerts using Bootstrap Toast component
function showToast(message, type = 'primary', icon = 'bi-info-circle') {
  if (typeof document === 'undefined') {
    console.log(`[Toast ${type}]: ${message}`);
    return;
  }
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '1100';
    document.body.appendChild(container);
  }

  const toastId = 'toast-' + Date.now();
  const bgClass = type === 'success' ? 'bg-success text-white' :
                  type === 'danger' ? 'bg-danger text-white' :
                  type === 'warning' ? 'bg-warning text-dark' : 'bg-primary text-white';

  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center ${bgClass} border-0 shadow" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <i class="bi ${icon} fs-5"></i>
          <span>${message}</span>
        </div>
        <button type="button" class="btn-close ${type === 'warning' ? '' : 'btn-close-white'} me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', toastHtml);
  const toastElem = document.getElementById(toastId);
  if (window.bootstrap && window.bootstrap.Toast) {
    const bsToast = new window.bootstrap.Toast(toastElem, { delay: 3500 });
    bsToast.show();
    toastElem.addEventListener('hidden.bs.toast', () => {
      toastElem.remove();
    });
  } else {
    setTimeout(() => toastElem.remove(), 3500);
  }
}

// Live Dynamic Clock in Header
function initLiveClock() {
  const clockElem = document.getElementById('liveClock');
  const storeStatusElem = document.getElementById('storeStatusBadge');
  
  if (!clockElem) return;

  function updateClock() {
    const now = new Date();
    
    // Format options: "Tuesday, Oct 13, 2026 | 03:08:45 PM"
    const optionsDate = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const dateStr = now.toLocaleDateString('en-IN', optionsDate);
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    clockElem.innerHTML = `<i class="bi bi-calendar3 me-1"></i> ${dateStr} &nbsp;|&nbsp; <i class="bi bi-clock me-1"></i> ${timeStr}`;

    if (storeStatusElem) {
      const hour = now.getHours();
      // Campus store operating hours: 8:30 AM to 5:30 PM (8 to 17)
      const isOpen = hour >= 8 && hour < 18;
      if (isOpen) {
        storeStatusElem.innerHTML = `<span class="pulse-indicator me-1"></span> Store Open (Counter 1 & 2)`;
        storeStatusElem.className = 'badge bg-success-subtle text-success border border-success-subtle py-1 px-2';
      } else {
        storeStatusElem.innerHTML = `<span class="badge bg-secondary me-1">Offline</span> Orders Queueing Open`;
        storeStatusElem.className = 'badge bg-light text-muted border py-1 px-2';
      }
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// "Surprise Me" Stationery Picker Feature
function triggerSurpriseProduct() {
  const products = (typeof getAllProducts === 'function') ? getAllProducts() : getStorage('campus_products', []);
  if (!products || products.length === 0) {
    showToast('Product catalog is loading, please try again.', 'warning');
    return;
  }

  // Filter 5 select surprise products
  const candidates = products.filter(p => p.stock > 0);
  if (candidates.length === 0) {
    showToast('All items are currently out of stock.', 'warning');
    return;
  }

  const randomIndex = Math.floor(Math.random() * candidates.length);
  const surpriseItem = candidates[randomIndex];

  const surpriseModalElem = document.getElementById('surpriseProductModal');
  if (surpriseModalElem) {
    document.getElementById('surpriseItemName').textContent = surpriseItem.name;
    document.getElementById('surpriseItemCategory').textContent = surpriseItem.category;
    document.getElementById('surpriseItemPrice').textContent = formatINR(surpriseItem.price);
    document.getElementById('surpriseItemDesc').textContent = surpriseItem.description;
    
    const imgElem = document.getElementById('surpriseItemImage');
    if (imgElem) {
      imgElem.src = surpriseItem.image;
      imgElem.alt = surpriseItem.name;
    }

    const addBtn = document.getElementById('surpriseAddToCartBtn');
    if (addBtn) {
      addBtn.onclick = () => {
        if (typeof addToCart === 'function') {
          addToCart(surpriseItem.id, 1);
          if (window.bootstrap) {
            const modal = window.bootstrap.Modal.getInstance(surpriseModalElem);
            if (modal) modal.hide();
          }
        }
      };
    }

    if (window.bootstrap) {
      const modal = new window.bootstrap.Modal(surpriseModalElem);
      modal.show();
    }
  } else {
    // If modal not in DOM, show direct toast and prompt
    showToast(`🎉 Surprise Pick: ${surpriseItem.name} at only ${formatINR(surpriseItem.price)}!`, 'success', 'bi-stars');
    if (typeof addToCart === 'function') {
      addToCart(surpriseItem.id, 1);
    }
  }
}

// Stationery Quantity and Cost Calculator (Arithmetic operations)
function calculateStationeryCost(unitPrice, quantity, discountPercent = 0, gstPercent = 18) {
  const price = parseFloat(unitPrice) || 0;
  const qty = parseInt(quantity, 10) || 0;
  
  if (price < 0 || qty < 0) {
    return { error: 'Price and quantity must be positive numbers.' };
  }

  const baseCost = price * qty;
  const discountAmount = (baseCost * discountPercent) / 100;
  const taxableAmount = baseCost - discountAmount;
  const gstAmount = (taxableAmount * gstPercent) / 100;
  const finalTotal = taxableAmount + gstAmount;

  return {
    unitPrice: price,
    quantity: qty,
    baseCost: baseCost,
    discountPercent: discountPercent,
    discountAmount: discountAmount,
    taxableAmount: taxableAmount,
    gstPercent: gstPercent,
    gstAmount: gstAmount,
    finalTotal: finalTotal
  };
}

// Mini Arithmetic Calculator (avoiding eval for security)
let calcState = {
  currentInput: '0',
  previousInput: null,
  operation: null,
  isResult: false
};

function handleCalcInput(btnValue) {
  const display = document.getElementById('calcDisplay');
  if (!display) return;

  if (btnValue === 'C') {
    calcState.currentInput = '0';
    calcState.previousInput = null;
    calcState.operation = null;
    calcState.isResult = false;
  } else if (btnValue === '±') {
    if (calcState.currentInput !== '0') {
      calcState.currentInput = (parseFloat(calcState.currentInput) * -1).toString();
    }
  } else if (btnValue === '√') {
    const val = parseFloat(calcState.currentInput);
    if (val >= 0) {
      calcState.currentInput = Math.sqrt(val).toString();
      calcState.isResult = true;
    } else {
      calcState.currentInput = 'Error';
    }
  } else if (['+', '-', '*', '/'].includes(btnValue)) {
    if (calcState.previousInput !== null && calcState.operation) {
      executeCalcOperation();
    }
    calcState.previousInput = calcState.currentInput;
    calcState.operation = btnValue;
    calcState.currentInput = '0';
    calcState.isResult = false;
  } else if (btnValue === '=') {
    if (calcState.previousInput !== null && calcState.operation) {
      executeCalcOperation();
      calcState.operation = null;
      calcState.previousInput = null;
      calcState.isResult = true;
    }
  } else if (btnValue === '.') {
    if (calcState.isResult) {
      calcState.currentInput = '0.';
      calcState.isResult = false;
    } else if (!calcState.currentInput.includes('.')) {
      calcState.currentInput += '.';
    }
  } else {
    // Number buttons 0-9
    if (calcState.currentInput === '0' || calcState.isResult) {
      calcState.currentInput = btnValue;
      calcState.isResult = false;
    } else {
      calcState.currentInput += btnValue;
    }
  }

  display.textContent = calcState.currentInput;
}

function executeCalcOperation() {
  const prev = parseFloat(calcState.previousInput);
  const current = parseFloat(calcState.currentInput);

  if (isNaN(prev) || isNaN(current)) return;

  let result = 0;
  switch (calcState.operation) {
    case '+': result = prev + current; break;
    case '-': result = prev - current; break;
    case '*': result = prev * current; break;
    case '/':
      if (current === 0) {
        calcState.currentInput = 'Error: Div/0';
        return;
      }
      result = prev / current;
      break;
    default: return;
  }

  // Round to max 4 decimals if needed
  calcState.currentInput = (Math.round(result * 10000) / 10000).toString();
}

// Setup calculator listeners if present on the page
function setupMiniCalculator() {
  const calcContainer = document.getElementById('miniCalculator');
  if (!calcContainer) return;

  calcContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.calc-btn');
    if (!btn) return;
    const val = btn.getAttribute('data-val');
    if (val) {
      handleCalcInput(val);
    }
  });
}

// Global window exports
if (typeof window !== 'undefined') {
  window.formatINR = formatINR;
  window.getStorage = getStorage;
  window.setStorage = setStorage;
  window.getStockStatus = getStockStatus;
  window.showToast = showToast;
  window.initLiveClock = initLiveClock;
  window.calculateStationeryCost = calculateStationeryCost;
  window.triggerSurpriseProduct = triggerSurpriseProduct;
  window.setupMiniCalculator = setupMiniCalculator;
}

