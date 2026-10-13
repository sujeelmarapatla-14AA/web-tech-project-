/**
 * CampusStationery - Form Validation Module
 * Client-side validation using Bootstrap 5 visual states (.is-valid / .is-invalid).
 * Validates student registration, checkout forms, contact messages, and admin product forms.
 */

// Set field to invalid with custom error message
function setFieldInvalid(inputElem, message) {
  if (!inputElem) return;
  inputElem.classList.remove('is-valid');
  inputElem.classList.add('is-invalid');

  // Find or create invalid-feedback container
  let feedback = inputElem.parentElement.querySelector('.invalid-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    inputElem.parentElement.appendChild(feedback);
  }
  feedback.textContent = message;
}

// Set field to valid
function setFieldValid(inputElem, message = 'Looks good!') {
  if (!inputElem) return;
  inputElem.classList.remove('is-invalid');
  inputElem.classList.add('is-valid');

  let feedback = inputElem.parentElement.querySelector('.valid-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'valid-feedback';
    inputElem.parentElement.appendChild(feedback);
  }
  feedback.textContent = message;
}

// Reset field validation state
function resetFieldValidation(inputElem) {
  if (!inputElem) return;
  inputElem.classList.remove('is-valid', 'is-invalid');
}

// Validation Rules
var ValidatorRules = {
  // Check required text
  isNotEmpty: (val) => val && val.trim().length > 0,

  // Name: minimum 3 letters, alphabets & spaces
  isValidName: (val) => /^[a-zA-Z\s.]{3,50}$/.test(val ? val.trim() : ''),

  // Valid email standard regex
  isValidEmail: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val ? val.trim() : ''),

  // Indian mobile: exactly 10 digits starting with 6, 7, 8, or 9
  isValidIndianMobile: (val) => /^[6-9]\d{9}$/.test(val ? val.trim() : ''),

  // Minimum password length
  isValidPassword: (val, minLength = 6) => val && val.length >= minLength,

  // Student Roll Number format (alphanumeric 5 to 12 chars)
  isValidRollNumber: (val) => /^[a-zA-Z0-9]{5,12}$/.test(val ? val.trim() : ''),

  // Positive price
  isValidPrice: (val) => !isNaN(val) && parseFloat(val) > 0,

  // Non-negative integer stock
  isValidStock: (val) => !isNaN(val) && parseInt(val, 10) >= 0 && Number.isInteger(Number(val))
};
if (typeof window !== 'undefined') {
  window.ValidatorRules = ValidatorRules;
}

// Validate Student Registration Form
function validateRegistrationForm(formElem) {
  if (!formElem) return false;
  let isValid = true;

  // Name
  const nameInput = formElem.querySelector('#regName');
  if (nameInput) {
    if (!ValidatorRules.isNotEmpty(nameInput.value)) {
      setFieldInvalid(nameInput, 'Please enter your full name.');
      isValid = false;
    } else if (!ValidatorRules.isValidName(nameInput.value)) {
      setFieldInvalid(nameInput, 'Name must contain at least 3 letters and only alphabetic characters.');
      isValid = false;
    } else {
      setFieldValid(nameInput);
    }
  }

  // Email
  const emailInput = formElem.querySelector('#regEmail');
  if (emailInput) {
    if (!ValidatorRules.isNotEmpty(emailInput.value)) {
      setFieldInvalid(emailInput, 'Email address is required.');
      isValid = false;
    } else if (!ValidatorRules.isValidEmail(emailInput.value)) {
      setFieldInvalid(emailInput, 'Please enter a valid email address (e.g., student@mlrit.ac.in).');
      isValid = false;
    } else {
      setFieldValid(emailInput);
    }
  }

  // Mobile
  const phoneInput = formElem.querySelector('#regPhone');
  if (phoneInput) {
    if (!ValidatorRules.isNotEmpty(phoneInput.value)) {
      setFieldInvalid(phoneInput, 'Mobile number is required.');
      isValid = false;
    } else if (!ValidatorRules.isValidIndianMobile(phoneInput.value)) {
      setFieldInvalid(phoneInput, 'Please enter a valid 10-digit Indian mobile number (starts with 6-9).');
      isValid = false;
    } else {
      setFieldValid(phoneInput);
    }
  }

  // Password
  const passInput = formElem.querySelector('#regPassword');
  if (passInput) {
    if (!ValidatorRules.isNotEmpty(passInput.value)) {
      setFieldInvalid(passInput, 'Password is required.');
      isValid = false;
    } else if (!ValidatorRules.isValidPassword(passInput.value, 6)) {
      setFieldInvalid(passInput, 'Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setFieldValid(passInput);
    }
  }

  // Department Dropdown
  const deptInput = formElem.querySelector('#regDepartment');
  if (deptInput) {
    if (!deptInput.value) {
      setFieldInvalid(deptInput, 'Please select your department.');
      isValid = false;
    } else {
      setFieldValid(deptInput);
    }
  }

  // Year of Study Radio
  const yearChecked = formElem.querySelector('input[name="studentYear"]:checked');
  const yearContainer = formElem.querySelector('#yearRadiosContainer');
  if (yearContainer) {
    let yearFeedback = formElem.querySelector('#yearRadioFeedback');
    if (!yearChecked) {
      if (!yearFeedback) {
        yearFeedback = document.createElement('div');
        yearFeedback.id = 'yearRadioFeedback';
        yearFeedback.className = 'text-danger small mt-1';
        yearContainer.appendChild(yearFeedback);
      }
      yearFeedback.textContent = 'Please select your current year of study.';
      isValid = false;
    } else {
      if (yearFeedback) yearFeedback.textContent = '';
    }
  }

  // Preferences Checkboxes (at least one)
  const prefCheckboxes = formElem.querySelectorAll('input[name="prefCategory"]:checked');
  const prefContainer = formElem.querySelector('#prefCheckboxesContainer');
  if (prefContainer) {
    let prefFeedback = formElem.querySelector('#prefFeedback');
    if (prefCheckboxes.length === 0) {
      if (!prefFeedback) {
        prefFeedback = document.createElement('div');
        prefFeedback.id = 'prefFeedback';
        prefFeedback.className = 'text-danger small mt-1';
        prefContainer.appendChild(prefFeedback);
      }
      prefFeedback.textContent = 'Please choose at least one stationery preference.';
      isValid = false;
    } else {
      if (prefFeedback) prefFeedback.textContent = '';
    }
  }

  return isValid;
}

// Validate Checkout Form
function validateCheckoutForm(formElem) {
  if (!formElem) return false;
  let isValid = true;

  // Full Name
  const nameInput = formElem.querySelector('#checkoutName');
  if (nameInput) {
    if (!ValidatorRules.isNotEmpty(nameInput.value)) {
      setFieldInvalid(nameInput, 'Full name is required.');
      isValid = false;
    } else if (!ValidatorRules.isValidName(nameInput.value)) {
      setFieldInvalid(nameInput, 'Please enter a valid full name (letters only, min 3 chars).');
      isValid = false;
    } else {
      setFieldValid(nameInput);
    }
  }

  // Roll Number
  const rollInput = formElem.querySelector('#checkoutRoll');
  if (rollInput) {
    if (!ValidatorRules.isNotEmpty(rollInput.value)) {
      setFieldInvalid(rollInput, 'Roll / Hall Ticket number is required.');
      isValid = false;
    } else if (!ValidatorRules.isValidRollNumber(rollInput.value)) {
      setFieldInvalid(rollInput, 'Enter a valid Roll Number (alphanumeric, e.g., 22951A0501).');
      isValid = false;
    } else {
      setFieldValid(rollInput);
    }
  }

  // Email
  const emailInput = formElem.querySelector('#checkoutEmail');
  if (emailInput) {
    if (!ValidatorRules.isNotEmpty(emailInput.value)) {
      setFieldInvalid(emailInput, 'Email is required for order receipt.');
      isValid = false;
    } else if (!ValidatorRules.isValidEmail(emailInput.value)) {
      setFieldInvalid(emailInput, 'Enter a valid email address.');
      isValid = false;
    } else {
      setFieldValid(emailInput);
    }
  }

  // Mobile
  const phoneInput = formElem.querySelector('#checkoutPhone');
  if (phoneInput) {
    if (!ValidatorRules.isNotEmpty(phoneInput.value)) {
      setFieldInvalid(phoneInput, 'Mobile number is required for SMS updates.');
      isValid = false;
    } else if (!ValidatorRules.isValidIndianMobile(phoneInput.value)) {
      setFieldInvalid(phoneInput, 'Enter a valid 10-digit Indian mobile number (starting with 6-9).');
      isValid = false;
    } else {
      setFieldValid(phoneInput);
    }
  }

  // Department
  const deptInput = formElem.querySelector('#checkoutDept');
  if (deptInput) {
    if (!deptInput.value) {
      setFieldInvalid(deptInput, 'Please select your department.');
      isValid = false;
    } else {
      setFieldValid(deptInput);
    }
  }

  // Pickup Location
  const pickupInput = formElem.querySelector('#checkoutPickupPoint');
  if (pickupInput) {
    if (!pickupInput.value) {
      setFieldInvalid(pickupInput, 'Please select a campus pickup location.');
      isValid = false;
    } else {
      setFieldValid(pickupInput);
    }
  }

  // Payment Method Radio
  const paymentChecked = formElem.querySelector('input[name="paymentMethod"]:checked');
  const paymentContainer = formElem.querySelector('#paymentMethodContainer');
  if (paymentContainer) {
    let paymentFeedback = formElem.querySelector('#paymentFeedback');
    if (!paymentChecked) {
      if (!paymentFeedback) {
        paymentFeedback = document.createElement('div');
        paymentFeedback.id = 'paymentFeedback';
        paymentFeedback.className = 'text-danger small mt-1';
        paymentContainer.appendChild(paymentFeedback);
      }
      paymentFeedback.textContent = 'Please select a payment method.';
      isValid = false;
    } else {
      if (paymentFeedback) paymentFeedback.textContent = '';
    }
  }

  // Terms declaration
  const termsCheckbox = formElem.querySelector('#checkoutTerms');
  if (termsCheckbox) {
    if (!termsCheckbox.checked) {
      termsCheckbox.classList.add('is-invalid');
      isValid = false;
    } else {
      termsCheckbox.classList.remove('is-invalid');
      termsCheckbox.classList.add('is-valid');
    }
  }

  return isValid;
}

// Validate Admin Product Form
function validateProductForm(formElem) {
  if (!formElem) return false;
  let isValid = true;

  const idInput = formElem.querySelector('#prodId');
  if (idInput) {
    if (!ValidatorRules.isNotEmpty(idInput.value)) {
      setFieldInvalid(idInput, 'Product ID is required (e.g. STN-105).');
      isValid = false;
    } else {
      setFieldValid(idInput);
    }
  }

  const nameInput = formElem.querySelector('#prodName');
  if (nameInput) {
    if (!ValidatorRules.isNotEmpty(nameInput.value) || nameInput.value.trim().length < 3) {
      setFieldInvalid(nameInput, 'Product name must be at least 3 characters.');
      isValid = false;
    } else {
      setFieldValid(nameInput);
    }
  }

  const catInput = formElem.querySelector('#prodCategory');
  if (catInput) {
    if (!catInput.value) {
      setFieldInvalid(catInput, 'Please select a category.');
      isValid = false;
    } else {
      setFieldValid(catInput);
    }
  }

  const priceInput = formElem.querySelector('#prodPrice');
  if (priceInput) {
    if (!ValidatorRules.isValidPrice(priceInput.value)) {
      setFieldInvalid(priceInput, 'Please enter a valid price greater than 0.');
      isValid = false;
    } else {
      setFieldValid(priceInput);
    }
  }

  const stockInput = formElem.querySelector('#prodStock');
  if (stockInput) {
    if (!ValidatorRules.isValidStock(stockInput.value)) {
      setFieldInvalid(stockInput, 'Please enter a valid non-negative whole number stock.');
      isValid = false;
    } else {
      setFieldValid(stockInput);
    }
  }

  const descInput = formElem.querySelector('#prodDesc');
  if (descInput) {
    if (!ValidatorRules.isNotEmpty(descInput.value)) {
      setFieldInvalid(descInput, 'Product description is required.');
      isValid = false;
    } else {
      setFieldValid(descInput);
    }
  }

  return isValid;
}

// Global window exports
if (typeof window !== 'undefined') {
  window.ValidatorRules = ValidatorRules;
  window.setFieldValid = setFieldValid;
  window.setFieldInvalid = setFieldInvalid;
  window.resetFieldValidation = resetFieldValidation;
  window.validateRegistrationForm = validateRegistrationForm;
  window.validateCheckoutForm = validateCheckoutForm;
  window.validateContactForm = validateContactForm;
  window.validateProductForm = validateProductForm;
}

