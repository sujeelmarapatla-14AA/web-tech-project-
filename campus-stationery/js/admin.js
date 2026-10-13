/**
 * CampusStationery - Admin Dashboard Module
 * Manages inventory catalog, stock adjustments, order tracking, and store analytics.
 */

// Selected product ID for deletion or editing
let selectedProductIdForAction = null;

// Initialize admin dashboard
function initAdminDashboard() {
  renderAdminMetrics();
  renderInventoryTable();
  renderAdminOrdersTable();
  setupAdminEventListeners();
}

// Render Dashboard Metric Cards
function renderAdminMetrics() {
  const products = (typeof getAllProducts === 'function') ? getAllProducts() : [];
  const orders = getStorage('campus_orders', []);

  // Total Products
  const totalProdsElem = document.getElementById('statTotalProducts');
  if (totalProdsElem) totalProdsElem.textContent = products.length;

  // Total Orders
  const totalOrdersElem = document.getElementById('statTotalOrders');
  if (totalOrdersElem) totalOrdersElem.textContent = orders.length;

  // Pending Orders (not Completed or Cancelled)
  const pendingOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled');
  const pendingOrdersElem = document.getElementById('statPendingOrders');
  if (pendingOrdersElem) pendingOrdersElem.textContent = pendingOrders.length;

  // Low Stock Items (stock <= 10)
  const lowStockCount = products.filter(p => p.stock <= 10).length;
  const lowStockElem = document.getElementById('statLowStock');
  if (lowStockElem) lowStockElem.textContent = lowStockCount;

  // Total Revenue
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + (o.finalTotal || 0) : sum), 0);
  const revenueElem = document.getElementById('statTotalRevenue');
  if (revenueElem) revenueElem.textContent = formatINR(totalRevenue);
}

// Render Product Inventory Table
function renderInventoryTable() {
  const tbody = document.getElementById('adminInventoryTbody');
  const tableFooter = document.getElementById('adminTableFooter');
  if (!tbody) return;

  const searchTerm = (document.getElementById('adminSearchInput') ? document.getElementById('adminSearchInput').value.trim().toLowerCase() : '');
  const categoryFilter = (document.getElementById('adminCategoryFilter') ? document.getElementById('adminCategoryFilter').value : 'all');

  let products = (typeof getAllProducts === 'function') ? getAllProducts() : [];

  if (categoryFilter !== 'all') {
    products = products.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  if (searchTerm) {
    products = products.filter(p => 
      p.id.toLowerCase().includes(searchTerm) ||
      p.name.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  }

  tbody.innerHTML = '';

  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4 text-muted">
          <i class="bi bi-inbox fs-3 d-block mb-2"></i>
          No stationery items match the current search or filter criteria.
        </td>
      </tr>
    `;
    if (tableFooter) tableFooter.innerHTML = '';
    return;
  }

  let totalStockCount = 0;
  let totalValue = 0;

  products.forEach(p => {
    totalStockCount += p.stock;
    totalValue += (p.stock * p.price);
    const stockStatus = getStockStatus(p.stock);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="fw-bold text-secondary align-middle">${p.id}</td>
      <td class="align-middle">
        <div class="d-flex align-items-center gap-2">
          <img src="${p.image}" alt="${p.name}" class="rounded border" style="width: 42px; height: 42px; object-fit: contain; background: #fff;" onerror="this.onerror=null; this.src='${p.fallbackImage || 'assets/images/category-writing.svg'}';">
          <div>
            <div class="fw-semibold">${p.name}</div>
            <small class="text-muted">${p.badge || 'Standard'}</small>
          </div>
        </div>
      </td>
      <td class="align-middle"><span class="badge bg-light text-dark border">${p.category}</span></td>
      <td class="align-middle fw-semibold text-nowrap">${formatINR(p.price)}</td>
      <td class="align-middle">
        <div class="d-flex align-items-center gap-1">
          <button type="button" class="btn btn-outline-secondary btn-sm py-0 px-2" onclick="adjustProductStock('${p.id}', -5)" title="Decrease 5">-5</button>
          <span class="fw-bold px-2">${p.stock}</span>
          <button type="button" class="btn btn-outline-secondary btn-sm py-0 px-2" onclick="adjustProductStock('${p.id}', 5)" title="Increase 5">+5</button>
        </div>
      </td>
      <td class="align-middle">
        <span class="badge ${stockStatus.badgeClass}">${stockStatus.label}</span>
      </td>
      <td class="align-middle text-nowrap text-end">
        <button type="button" class="btn btn-sm btn-outline-primary me-1" onclick="openEditProductModal('${p.id}')" title="Edit Product">
          <i class="bi bi-pencil-square"></i> Edit
        </button>
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="promptDeleteProduct('${p.id}')" title="Delete Product">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Table summary footer demonstrating merged cells (colspan)
  if (tableFooter) {
    tableFooter.innerHTML = `
      <tr class="table-light fw-bold">
        <td colspan="4" class="text-end">Inventory Subtotal (${products.length} Products):</td>
        <td>${totalStockCount} Units</td>
        <td colspan="2" class="text-end">Valuation: ${formatINR(totalValue)}</td>
      </tr>
    `;
  }
}

// Quick Stock Adjust (+5 or -5)
function adjustProductStock(productId, delta) {
  const products = getAllProducts();
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  const newStock = Math.max(0, prod.stock + delta);
  prod.stock = newStock;
  setStorage('campus_products', products);

  renderInventoryTable();
  renderAdminMetrics();
  showToast(`Updated stock for <strong>${prod.name}</strong> to ${newStock} units.`, 'info');
}

// Open Add Product Modal
function openAddProductModal() {
  const form = document.getElementById('adminProductForm');
  if (!form) return;

  form.reset();
  document.getElementById('modalProductFormTitle').textContent = 'Add New Stationery Product';
  document.getElementById('isEditMode').value = 'false';
  document.getElementById('prodId').removeAttribute('readonly');

  // Suggest a product ID
  const products = getAllProducts();
  const nextNum = 100 + products.length + 1;
  document.getElementById('prodId').value = `STN-${nextNum}`;

  if (window.bootstrap) {
    const modal = new window.bootstrap.Modal(document.getElementById('adminProductModal'));
    modal.show();
  }
}

// Open Edit Product Modal
function openEditProductModal(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const form = document.getElementById('adminProductForm');
  if (!form) return;

  document.getElementById('modalProductFormTitle').textContent = `Edit Product (${product.id})`;
  document.getElementById('isEditMode').value = 'true';

  const idInput = document.getElementById('prodId');
  idInput.value = product.id;
  idInput.setAttribute('readonly', 'true');

  document.getElementById('prodName').value = product.name;
  document.getElementById('prodCategory').value = product.category;
  document.getElementById('prodPrice').value = product.price;
  document.getElementById('prodOriginalPrice').value = product.originalPrice || '';
  document.getElementById('prodStock').value = product.stock;
  document.getElementById('prodBadge').value = product.badge || '';
  document.getElementById('prodDesc').value = product.description || '';
  document.getElementById('prodImageUrl').value = product.image || '';

  if (window.bootstrap) {
    const modal = new window.bootstrap.Modal(document.getElementById('adminProductModal'));
    modal.show();
  }
}

// Save Product (Add or Edit)
function handleSaveProduct(e) {
  e.preventDefault();
  const form = document.getElementById('adminProductForm');
  if (!form) return;

  if (typeof validateProductForm === 'function' && !validateProductForm(form)) {
    showToast('Please fill all required product fields correctly.', 'danger');
    return;
  }

  const isEdit = document.getElementById('isEditMode').value === 'true';
  const id = document.getElementById('prodId').value.trim();
  const name = document.getElementById('prodName').value.trim();
  const category = document.getElementById('prodCategory').value;
  const price = parseFloat(document.getElementById('prodPrice').value);
  const origPrice = parseFloat(document.getElementById('prodOriginalPrice').value) || (price + 20);
  const stock = parseInt(document.getElementById('prodStock').value, 10);
  const badge = document.getElementById('prodBadge').value.trim();
  const desc = document.getElementById('prodDesc').value.trim();
  let image = document.getElementById('prodImageUrl').value.trim();

  if (!image) {
    image = 'assets/images/category-writing.svg';
  }

  let products = getAllProducts();

  if (isEdit) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        name,
        category,
        price,
        originalPrice: origPrice,
        stock,
        badge,
        description: desc,
        image
      };
      setStorage('campus_products', products);
      showToast(`Product "${name}" updated successfully!`, 'success');
    }
  } else {
    // Check ID unique
    if (products.some(p => p.id.toLowerCase() === id.toLowerCase())) {
      showToast(`Product ID "${id}" already exists. Please choose a unique ID.`, 'danger');
      return;
    }
    const newProd = {
      id,
      name,
      category,
      price,
      originalPrice: origPrice,
      stock,
      rating: 4.8,
      reviews: 1,
      badge: badge || 'New Arrival',
      description: desc,
      specifications: ['College Grade Material', 'Guaranteed Quality'],
      image,
      fallbackImage: 'assets/images/category-writing.svg',
      thumbnails: [image]
    };
    products.push(newProd);
    setStorage('campus_products', products);
    showToast(`New product "${name}" added to catalog!`, 'success');
  }

  // Close modal
  const modalElem = document.getElementById('adminProductModal');
  if (modalElem && window.bootstrap) {
    const modal = window.bootstrap.Modal.getInstance(modalElem);
    if (modal) modal.hide();
  }

  renderInventoryTable();
  renderAdminMetrics();
}

// Prompt Delete Confirmation Modal
function promptDeleteProduct(productId) {
  selectedProductIdForAction = productId;
  const product = getProductById(productId);
  if (!product) return;

  const modalElem = document.getElementById('deleteConfirmModal');
  if (modalElem) {
    document.getElementById('deleteProdName').textContent = product.name;
    document.getElementById('deleteProdId').textContent = product.id;
    if (window.bootstrap) {
      const modal = new window.bootstrap.Modal(modalElem);
      modal.show();
    }
  } else {
    if (confirm(`Are you sure you want to delete ${product.name} (${product.id})?`)) {
      executeDeleteProduct();
    }
  }
}

// Execute Delete Product
function executeDeleteProduct() {
  if (!selectedProductIdForAction) return;

  let products = getAllProducts();
  const prod = products.find(p => p.id === selectedProductIdForAction);
  const name = prod ? prod.name : 'Product';

  products = products.filter(p => p.id !== selectedProductIdForAction);
  setStorage('campus_products', products);

  // Close modal if open
  const modalElem = document.getElementById('deleteConfirmModal');
  if (modalElem && window.bootstrap) {
    const modal = window.bootstrap.Modal.getInstance(modalElem);
    if (modal) modal.hide();
  }

  selectedProductIdForAction = null;
  showToast(`Deleted "${name}" from stationery inventory.`, 'info');
  renderInventoryTable();
  renderAdminMetrics();
}

// Render Orders in Admin Dashboard
function renderAdminOrdersTable() {
  const tbody = document.getElementById('adminOrdersTbody');
  if (!tbody) return;

  const orders = getStorage('campus_orders', []);
  const statusFilter = document.getElementById('adminOrderStatusFilter') ? document.getElementById('adminOrderStatusFilter').value : 'all';

  let filtered = orders;
  if (statusFilter !== 'all') {
    filtered = orders.filter(o => o.status === statusFilter);
  }

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4 text-muted">
          No customer orders found under this filter.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(order => {
    const statusBadgeClass = order.status === 'Completed' ? 'bg-success' :
                             order.status === 'Ready for Pickup' ? 'bg-primary' :
                             order.status === 'Packed at Counter' ? 'bg-info text-dark' :
                             order.status === 'Cancelled' ? 'bg-danger' : 'bg-warning text-dark';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="fw-bold text-primary align-middle">${order.orderId}</td>
      <td class="align-middle">
        <div class="fw-semibold">${order.customer.name}</div>
        <small class="text-muted">${order.customer.rollNo} &bull; ${order.customer.department}</small>
      </td>
      <td class="align-middle text-nowrap">${order.orderDate}</td>
      <td class="align-middle fw-semibold">${formatINR(order.finalTotal)}</td>
      <td class="align-middle"><small class="badge bg-light text-dark border">${order.pickupPoint}</small></td>
      <td class="align-middle">
        <select class="form-select form-select-sm" onchange="updateOrderStatus('${order.orderId}', this.value)" style="width: auto; min-width: 140px;">
          <option value="Order Placed" ${order.status === 'Order Placed' ? 'selected' : ''}>Order Placed</option>
          <option value="Packed at Counter" ${order.status === 'Packed at Counter' ? 'selected' : ''}>Packed at Counter</option>
          <option value="Ready for Pickup" ${order.status === 'Ready for Pickup' ? 'selected' : ''}>Ready for Pickup</option>
          <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
          <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td class="align-middle text-end">
        <button type="button" class="btn btn-sm btn-outline-secondary" onclick="viewAdminOrderDetails('${order.orderId}')">
          <i class="bi bi-eye"></i> Details
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Update Order Status
function updateOrderStatus(orderId, newStatus) {
  let orders = getStorage('campus_orders', []);
  const index = orders.findIndex(o => o.orderId === orderId);

  if (index !== -1) {
    orders[index].status = newStatus;
    setStorage('campus_orders', orders);
    showToast(`Order <strong>${orderId}</strong> status changed to "${newStatus}".`, 'info');
    renderAdminMetrics();
  }
}

// View Admin Order Details Modal
function viewAdminOrderDetails(orderId) {
  const orders = getStorage('campus_orders', []);
  const order = orders.find(o => o.orderId === orderId);
  if (!order) return;

  const modalElem = document.getElementById('adminOrderDetailsModal');
  if (!modalElem) return;

  document.getElementById('adminModalOrderId').textContent = order.orderId;
  document.getElementById('adminModalOrderDate').textContent = `${order.orderDate} at ${order.orderTime}`;
  document.getElementById('adminModalCustomerInfo').innerHTML = `
    <strong>${order.customer.name}</strong> (${order.customer.rollNo})<br>
    Dept: ${order.customer.department} (${order.customer.year})<br>
    Phone: ${order.customer.phone} &bull; Email: ${order.customer.email}
  `;
  document.getElementById('adminModalPickupPoint').textContent = order.pickupPoint;
  document.getElementById('adminModalPayment').textContent = order.paymentMethod;
  document.getElementById('adminModalOrderTotal').textContent = formatINR(order.finalTotal);

  const tbody = document.getElementById('adminModalOrderItemsBody');
  if (tbody) {
    tbody.innerHTML = '';
    order.items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.name}</td>
        <td class="text-center">${item.quantity}</td>
        <td class="text-end">${formatINR(item.price)}</td>
        <td class="text-end fw-semibold">${formatINR(item.subtotal)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  if (window.bootstrap) {
    const modal = new window.bootstrap.Modal(modalElem);
    modal.show();
  }
}

// Reset Catalog to Defaults
function resetCatalogToDefault() {
  if (confirm('Are you sure you want to reset the product inventory to default demo stationery catalog? Any custom products added will be reset.')) {
    localStorage.removeItem('campus_products');
    initProductCatalog();
    renderInventoryTable();
    renderAdminMetrics();
    showToast('Catalog restored to default college stationery stock.', 'success');
  }
}

// Setup Event Listeners
function setupAdminEventListeners() {
  const searchInput = document.getElementById('adminSearchInput');
  const catFilter = document.getElementById('adminCategoryFilter');
  const orderFilter = document.getElementById('adminOrderStatusFilter');
  const addProdBtn = document.getElementById('adminAddNewProdBtn');
  const prodForm = document.getElementById('adminProductForm');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const resetCatalogBtn = document.getElementById('resetCatalogBtn');

  if (searchInput) searchInput.addEventListener('input', renderInventoryTable);
  if (catFilter) catFilter.addEventListener('change', renderInventoryTable);
  if (orderFilter) orderFilter.addEventListener('change', renderAdminOrdersTable);
  if (addProdBtn) addProdBtn.addEventListener('click', openAddProductModal);
  if (prodForm) prodForm.addEventListener('submit', handleSaveProduct);
  if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', executeDeleteProduct);
  if (resetCatalogBtn) resetCatalogBtn.addEventListener('click', resetCatalogToDefault);
}

// Global window exports
if (typeof window !== 'undefined') {
  window.initAdminDashboard = initAdminDashboard;
  window.renderAdminMetrics = renderAdminMetrics;
  window.renderInventoryTable = renderInventoryTable;
  window.renderAdminOrdersTable = renderAdminOrdersTable;
  window.openAddProductModal = openAddProductModal;
  window.openEditProductModal = openEditProductModal;
  window.promptDeleteProduct = promptDeleteProduct;
  window.adjustProductStock = adjustProductStock;
  window.updateOrderStatus = updateOrderStatus;
  window.viewOrderDetails = viewOrderDetails;
}

