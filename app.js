const form = document.querySelector('form');
const firstName = document.querySelector('#first-name');
const lastName = document.querySelector('#last-name');
const email = document.querySelector('#email');
const phone = document.querySelector('#phone');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirm-password');
const passwordInputs = document.querySelectorAll('.password-input');
const success = document.querySelector('#submit-success');

const passwordToggle = document.querySelector('#password + .field-icon');
const confirmPasswordToggle = document.querySelector('#confirm-password + .field-icon');

const countries = [
  "ae", "ar", "at", "au", "be", "br", "ca", "ch", "cn", "co", "de", "dk", "es", "fi",
  "fr", "gb", "gr", "hk", "hu", "id", "ie", "il", "in", "it", "jp", "kr", "mx", "my",
  "nl", "no", "nz", "pl", "pt", "ro", "ru",  "sa", "se", "sg","th", "tr", "tw", "us", "za"
];
const maskPatterns = {
  ae: "999 999 9999", // United Arab Emirates
  ar: "9999-9999", // Argentina
  at: "99999 99999", // Austria
  au: "(99) 9999 9999", // Australia
  be: "9999 99 99 99", // Belgium
  br: "(99) 99999-9999", // Brazil
  ca: "(999) 999-9999", // Canada
  ch: "99 999 99 99", // Switzerland
  cn: "999 9999 9999", // China
  co: "(999) 999 9999", // Colombia
  de: "(9999) 999999", // Germany
  dk: "99 99 99 99", // Denmark
  es: "999 999 999", // Spain
  fi: "999 999 99 99", // Finland
  fr: "99 99 99 99 99", // France
  gb: "99 9999 9999", // United Kingdom
  gr: "999 999 9999", // Greece
  hk: "9999 9999", // Hong Kong
  hu: "(99) 999 9999", // Hungary
  id: "(99) 9999 999999", // Indonesia
  ie: "999 999 9999", // Ireland
  il: "999-999-9999", // Israel
  in: "9999 999 999", // India
  it: "999 9999999", // Italy
  jp: "99-9999-9999", // Japan
  kr: "99-9999-9999", // South Korea
  mx: "(999) 999 9999", // Mexico
  my: "99-999 9999", // Malaysia
  nl: "99 999 9999", // Netherlands
  no: "999 99 999", // Norway
  nz: "99 999 9999", // New Zealand
  pl: "999 999 999", // Poland
  pt: "999 999 999", // Portugal
  ro: "9999 999 999", // Romania
  ru: "(999) 999-99-99", // Russia
  sa: "999 999 9999", // Saudi Arabia
  se: "99 999 99 99", // Sweden
  sg: "9999 9999", // Singapore
  th: "99 999 9999", // Thailand
  tr: "(999) 999 99 99", // Turkey
  tw: "9999 999 999", // Taiwan
  us: "(999) 999-9999", // United States
  za: "(999) 999-9999", // South Africa
};

// Validates inputs on submit
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (validateInputs()) {
    // Logs form data
    const formData = new FormData(form);
    let formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
  
    // Removes password and confirmPassword from the logged form data
    formObject['password']  = '*****';
    delete formObject['confirm-password'];
    console.log(formObject);

    success.style.display = 'inline-block';
    firstName.value = '';
    lastName.value = '';
    email.value = '';
    phone.value = '';
    password.value = '';
    confirmPassword.value = '';
  }
});

// Checks to make sure form fields are not empty
function validateEmptyFields() {
  const fields = [firstName, lastName, email, password, confirmPassword];
  
  for (let field of fields) {
    if (field.value === '') {
      alert('Please fill out all fields.');
      return false;
    }
  }
  return true;
}

// Creates RegExp object
function validateInputPattern(input, pattern) {
  const regex = new RegExp(pattern);
  return regex.test(input.value);
}

// Checks to make sure name follows name pattern
function validateName(name) {
  const regex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]*$/i;
  return validateInputPattern(name, regex);
}

// Checks to make sure email follows email pattern
function validateEmail(email) {
  const regex = /^([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})$/i;
  return regex.test(String(email.value).toLowerCase());
}

password.addEventListener('input', () => {
  validatePasswords(false);
});

confirmPassword.addEventListener('input', () => {
  validatePasswords(false);
});

phone.addEventListener('input', () => {
  validatePhoneNumber(phone.value);
});

phone.addEventListener('keypress', (event) => {
  if (!allowedPhoneCharacters(event)) {
    event.preventDefault();
  }
});

// Limits phone field inputs to 0-9, ' ', +, -, (, and )
function allowedPhoneCharacters(event) {
  const charCode = (event.which) ? event.which : event.keyCode;
  if ((charCode > 31 && (charCode < 48 || charCode > 57)) && // numeric (0-9)
      charCode !== 32 && // space  
      charCode !== 43 && // +
      charCode !== 45 && // -
      charCode !== 40 && // (
      charCode !== 41) { // )
    return false;
  }
  return true;
}

// Initialize the International Telephone Input library
let iti = window.intlTelInput(phone, {
  initialCountry: "auto",
  separateDialCode: true,
  autoPlaceholder: "aggressive",
  countryOrder: ["us"],
  onlyCountries: countries, 
  geoIpLookup: callback => {
    fetch("https://ipapi.co/json")
      .then(res => res.json())
      .then(data => callback(data.country_code))
      .catch(() => callback("us"));
  },
  utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
});

// Initialize the InputMask library with a default mask
let im = new Inputmask("(999) 999-9999");
im.mask(phone);

// Function to update the input mask based on the selected country
function updateInputMask(countryData) {
  const countryCode = countryData.iso2;

  // Check if the country code has a defined mask pattern
  const maskPattern = maskPatterns[countryCode] || "(999) 999-9999";

  // Set the placeholder of the phone input field to the mask pattern
  phone.placeholder = maskPattern.replace(/9/g, '_');

  im = new Inputmask({
    mask: maskPattern,
    onBeforeMask: function(value, opts) {
      // Remove the parentheses before the value is masked
      return value.replace(/\(/g, '').replace(/\)/g, '');
    },
    onBeforeWrite: function(event, buffer, caretPos, opts) {
      // If the caret is at the end of the area code, move it to the start of the next group of digits
      if (caretPos === 4 && buffer[caretPos] === ' ') {
        return { caret: caretPos + 1 };
      }
    },
  });
  im.mask(phone);
}

// Listen for the "countrychange" event and update the input mask
phone.addEventListener("countrychange", function() {
  let countryDropdown = document.querySelector(".iti__selected-country");
  if (countryDropdown) {
    countryDropdown.setAttribute("tabindex", "1");
  }
  const countryData = iti.getSelectedCountryData();
  updateInputMask(countryData);
  phone.value = '';
});


// Checks that both password inputs match
function validatePasswords(isSubmitEvent) {
  if (password.value !== confirmPassword.value) {
    confirmPassword.classList.add('invalid');
    return false;
  }

  confirmPassword.classList.remove('invalid');
  return true;
}

// Checks against the libphonenumber library to make sure a valid phone number has been entered
function validatePhoneNumber(phoneNumber) {
  const parsedNumber = libphonenumber.parsePhoneNumberFromString(phoneNumber, 'US');
  const isValid = parsedNumber && parsedNumber.isValid();
  if (!isValid) {
    phone.classList.remove('valid');
    phone.classList.add('invalid');
  } else {
    phone.classList.remove('invalid');
    phone.classList.add('valid');
  }
  return isValid;
}

// Removes any existing error message under the given input field
function removeErrorMessage(inputField) {
  const error = inputField.parentNode.querySelector('.error-message');
  if (error) {
    inputField.parentNode.removeChild(error);
  }
}

// Adds an error message under the given input field
function addErrorMessage(inputField, message) {
  removeErrorMessage(inputField);

  const error = document.createElement('span');
  error.className = 'error-message';
  error.textContent = message;
  inputField.parentNode.appendChild(error);
}

passwordInputs.forEach(input => {
  input.addEventListener('input', () => {
    if (validatePasswords(false)) {
      passwordInputs.forEach(removeErrorMessage);
    }
  });
});

// Validates all inputs
function validateInputs() {
  let isValid = true;

  if (!validateEmptyFields()) {
    return;
  }
  if (!validateName(firstName)) {
    alert('Invalid first name.');
    return;
  }
  if (!validateName(lastName)) {
    alert('Invalid last name');
    return;
  }
  if (!validateEmail(email)) {
    alert('Invalid email address.');
    return;
  }
  if (!validatePhoneNumber(phone.value)) {
    alert('Invalid phone number.');
    return;
  }
  if (!validatePasswords(true)) {
    addErrorMessage(password, 'Passwords do not match.');
    addErrorMessage(confirmPassword, 'Passwords do not match.');
    isValid = false;
  }

  return isValid;
}

// Hides or displays password on click of eye icon
passwordToggle.addEventListener('click', () => {
  togglePasswordVisibility(password, passwordToggle);
});

confirmPasswordToggle.addEventListener('click', () => {
  togglePasswordVisibility(confirmPassword, confirmPasswordToggle);
});

function togglePasswordVisibility(passwordInput, toggleIcon) {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.querySelector('img').src = './assets/hide.svg';
  } else {
    passwordInput.type = 'password';
    toggleIcon.querySelector('img').src = './assets/show.svg';
  }
}

// Display the password rules when users start typing in the password field
const passwordRules = document.querySelector('#password-rules');

password.addEventListener('keydown', () => {
  passwordRules.style.display = 'block';
});

password.addEventListener('blur', () => {
  passwordRules.style.display = 'none';
});

// Changes color of password rules to green as conditions are met
password.addEventListener('input', () => {
  const passwordValue = password.value;
  const invalid = '#FF0000';
  
  document.querySelector('#rule-length').style.color = passwordValue.length >= 8 ? 'green' : invalid;
  document.querySelector('#rule-uppercase').style.color = /[A-Z]/.test(passwordValue) ? 'green' : invalid;
  document.querySelector('#rule-lowercase').style.color = /[a-z]/.test(passwordValue) ? 'green' : invalid;
  document.querySelector('#rule-number').style.color = /\d/.test(passwordValue) ? 'green' : invalid;
  document.querySelector('#rule-special').style.color = /[!@#$%+^&*()/|-]/.test(passwordValue) ? 'green' : invalid;
});