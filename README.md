# CampusStationery — College Stationery Management System

A complete, responsive College Stationery Management System built using **HTML5, CSS3, Vanilla JavaScript, and Bootstrap 5 (CDN)**.

## 🚀 Live Demo & Local Setup

### Running Locally
To launch the application locally, you can:
1. Open `campus-stationery/index.html` directly in any web browser.
2. Or run the included Node.js server:
   ```bash
   node server.js
   ```
   Then open `http://localhost:8000` in your browser.

## 📁 Project Structure

```text
campus-stationery/
├── index.html                  # Homepage: Hero, Categories, Carousel, Calculator
├── products.html               # Product Catalog: Search, Filters, Price Slider, Sorting
├── cart.html                   # Cart: Quantity Steppers, Coupons, Student Subsidy
├── checkout.html               # Checkout: Student Form, Phone Validation, Receipt
├── orders.html                 # Tracking: 4-Stage Stepper & Itemized History
├── admin.html                  # Admin Portal: KPI Cards, Inventory CRUD Table, Orders
├── about.html                  # About Store: Campus Location & Policy
├── help.html                   # Help Center: Ordering Guide, FAQ Accordion, Embedded Iframe
├── contact.html                # Contact: Store Timings, Emergency Hotline, Feedback
├── css/
│   └── style.css               # Clean academic blue & light-grey custom CSS
├── js/
│   ├── app.js                  # Shared app bootstrapping, navbar badge, demo login
│   ├── products.js             # 19 stationery products, filters, detail modal with specs
│   ├── cart.js                 # Cart state, stock boundary checks, coupon calculations
│   ├── checkout.js             # Order creation, inventory stock decrement, receipts
│   ├── admin.js                # Inventory table, +5/-5 stock, product CRUD, order statuses
│   ├── validation.js           # Strict form validation (10-digit Indian phone, emails)
│   └── utilities.js            # Live clock, arithmetic calculator, toast alerts, Surprise Me
└── assets/
    └── images/                 # SVG brand logo, hero banner & category illustrations
```

## 🛠️ Technologies
- **HTML5** (Semantic structure)
- **CSS3** (Variables, Flexbox, Grid, transitions)
- **Vanilla JavaScript** (DOM manipulation, event listeners, business logic)
- **Bootstrap 5.3.3 & Bootstrap Icons** (Responsive components & iconography)
- **localStorage** (Client-side persistence for inventory, cart, and orders)

## 🎯 Key Features
- **Categorized Catalog:** Writing materials, Notebooks & records, Drawing supplies, Laboratory supplies, Engineering stationery, Exam essentials.
- **Dynamic Clock & Store Status:** Real-time ticking clock in the header.
- **Smart Stationery Utilities:** Quantity & bulk cost calculator, arithmetic desk calculator, and random "Surprise Me" product picker.
- **Strict Form Validation:** 10-digit Indian mobile validation (`^[6-9]\d{9}$`), valid email format, required inputs.
- **Stock Management:** Automatic stock decrements upon order placement.
- **Order Tracking:** 4-stage visual progress stepper (`Order Placed` -> `Packed at Counter` -> `Ready for Pickup` -> `Completed`).
- **Admin Dashboard:** Inventory CRUD table, stock adjustments (+5 / -5), and order status tracking.
