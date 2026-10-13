/**
 * CampusStationery - Core Application Initializer
 * Bootstraps common components, navbar badges, clock, registration modal, and page routing.
 */

// Sample initial demo orders so Orders page & Admin dashboard are populated on first launch
const INITIAL_DEMO_ORDERS = [
  {
    orderId: 'CS-ORD-2026-1042',
    orderDate: 'Oct 12, 2026',
    orderTime: '11:24 AM',
    timestamp: Date.now() - 86400000,
    customer: {
      name: 'Aarav Sharma',
      rollNo: '23951A0501',
      email: 'aarav.sharma@mlrit.ac.in',
      phone: '9876543210',
      department: 'Computer Science and Engineering',
      year: '2nd Year',
      notes: 'Need transparent pouch for afternoon lab exam.'
    },
    items: [
      {
        productId: 'STN-101',
        name: 'Classmate Octane Gel Pen Set (Pack of 5, Blue & Black)',
        category: 'Writing materials',
        price: 125,
        quantity: 2,
        subtotal: 250
      },
      {
        productId: 'STN-602',
        name: 'Clear Transparent Exam Zipper Stationery Pouch',
        category: 'Exam essentials',
        price: 45,
        quantity: 1,
        subtotal: 45
      }
    ],
    subtotal: 295,
    discount: 29.5,
    handlingFee: 0,
    finalTotal: 265.5,
    paymentMethod: 'UPI Demo Payment',
    pickupPoint: 'Counter 1 (Main Stationery Store)',
    status: 'Ready for Pickup'
  },
  {
    orderId: 'CS-ORD-2026-1038',
    orderDate: 'Oct 11, 2026',
    orderTime: '02:15 PM',
    timestamp: Date.now() - 172800000,
    customer: {
      name: 'Pooja Reddy',
      rollNo: '22951A0418',
      email: 'pooja.reddy@mlrit.ac.in',
      phone: '9848012345',
      department: 'Electronics & Communication',
      year: '3rd Year',
      notes: ''
    },
    items: [
      {
        productId: 'STN-301',
        name: 'Omega Engineering Mini Drafter with Sturdy Canvas Carrying Bag',
        category: 'Drawing supplies',
        price: 480,
        quantity: 1,
        subtotal: 480
      },
      {
        productId: 'STN-202',
        name: 'Standard Engineering Practical Record Book (Hardbound, 160 Pages)',
        category: 'Notebooks and record books',
        price: 95,
        quantity: 2,
        subtotal: 190
      }
    ],
    subtotal: 670,
    discount: 67,
    handlingFee: 0,
    finalTotal: 603,
    paymentMethod: 'Cash on Campus Collection',
    pickupPoint: 'Counter 2 (Drawing & Lab Counter)',
    status: 'Completed'
  }
];

// Seed initial orders if empty
function initOrdersData() {
  const existing = getStorage('campus_orders', null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    setStorage('campus_orders', INITIAL_DEMO_ORDERS);
  }
}

// Student Demo Registration Modal Handler
function setupRegistrationHandler() {
  const form = document.getElementById('studentRegForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (typeof validateRegistrationForm === 'function' && !validateRegistrationForm(form)) {
      showToast('Please correct the validation errors in the registration form.', 'danger');
      return;
    }

    const name = form.querySelector('#regName').value.trim();
    const email = form.querySelector('#regEmail').value.trim();
    const phone = form.querySelector('#regPhone').value.trim();
    const department = form.querySelector('#regDepartment').value;
    const yearInput = form.querySelector('input[name="studentYear"]:checked');
    const year = yearInput ? yearInput.value : '1st Year';

    // Collect preferences
    const prefCheckboxes = form.querySelectorAll('input[name="prefCategory"]:checked');
    const preferences = Array.from(prefCheckboxes).map(cb => cb.value);

    const userProfile = {
      name,
      email,
      phone,
      department,
      year,
      preferences,
      registeredAt: new Date().toISOString()
    };

    setStorage('campus_user', userProfile);
    showToast(`Welcome, <strong>${name}</strong>! Your demo student profile is active.`, 'success', 'bi-person-check');

    // Close modal
    const modalElem = document.getElementById('studentRegModal');
    if (modalElem && window.bootstrap) {
      const modal = window.bootstrap.Modal.getInstance(modalElem);
      if (modal) modal.hide();
    }

    // Update greeting if present
    updateUserGreeting();
  });
}

// Update greeting badge in navbar
function updateUserGreeting() {
  const user = getStorage('campus_user', null);
  const userBtn = document.getElementById('navbarUserBtn');
  if (user && userBtn) {
    userBtn.innerHTML = `<i class="bi bi-person-fill text-primary"></i> ${user.name.split(' ')[0]}`;
    userBtn.title = `${user.name} (${user.department})`;
  }
}

// Global "Surprise Me" button binder
function setupSurpriseButton() {
  const surpriseBtns = document.querySelectorAll('.btn-trigger-surprise');
  surpriseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerSurpriseProduct();
    });
  });
}

// Highlight active link in navbar
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  const navLinks = document.querySelectorAll('.navbar-campus .nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (href !== '#' && !href.startsWith('javascript')) {
      link.classList.remove('active');
    }
  });
}

// Run on document ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize storage seeds
  if (typeof initProductCatalog === 'function') initProductCatalog();
  initOrdersData();

  // Initialize clock & cart count
  if (typeof initLiveClock === 'function') initLiveClock();
  if (typeof updateNavbarCartCount === 'function') updateNavbarCartCount();

  // Setup interactions
  setupRegistrationHandler();
  setupSurpriseButton();
  updateUserGreeting();
  highlightActiveNavLink();

  if (typeof setupMiniCalculator === 'function') {
    setupMiniCalculator();
  }
});
