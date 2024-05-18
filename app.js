const form = document.querySelector('form');
const firstName = document.querySelector('#first-name');
const lastName = document.querySelector('#last-name');
const email = document.querySelector('#email');
const phone = document.querySelector('#phone');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirm-password');

const passwordToggle = document.querySelector('#password + .field-icon');
const confirmPasswordToggle = document.querySelector('#confirm-password + .field-icon');

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
  const regex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/i;
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

// Limits phone field inputs to 0-9, , +, -, (, and )
function allowedPhoneCharacters(event) {
  var charCode = (event.which) ? event.which : event.keyCode;
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
  onlyCountries: ["ae", "au", "br", "ca", "cn", "de", "es", "fr", "gb", "in", "it", "mx", "nl", "ru", "tr", "us", "za"], 
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

  const maskPatterns = {
    ae: "999 999 9999", // United Arab Emirates
    au: "(99) 9999 9999", // Australia
    br: "(99) 99999-9999", // Brazil
    ca: "(999) 999-9999", // Canada
    cn: "999 9999 9999", // China
    de: "(9999) 999999", // Germany
    es: "999 999 999", // Spain
    fr: "99 99 99 99 99", // France
    gb: "99 9999 9999", // United Kingdom
    in: "9999 999 999", // India
    it: "999 9999999", // Italy
    mx: "(999) 999 9999", // Mexico
    nl: "99 999 9999", // Netherlands
    ru: "(999) 999-99-99", // Russia
    tr: "(999) 999 99 99", // Turkey
    us: "(999) 999-9999", // United States
    za: "(999) 999-9999", // South Africa
  };
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
    if (isSubmitEvent) {
      alert('Passwords do not match.');
    }
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

// Validates all inputs
function validateInputs() {
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
    alert('Passwords do not match.');
    return;
  }
  alert('Form submitted successfully.');
  return true;
}

passwordToggle.addEventListener('click', () => {
  togglePasswordVisibility(password, passwordToggle);
});

confirmPasswordToggle.addEventListener('click', () => {
  togglePasswordVisibility(confirmPassword, confirmPasswordToggle);
});

// Hides or displays password on click of eye icon
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
  
  document.querySelector('#rule-length').style.color = passwordValue.length >= 8 ? 'green' : 'darkred';
  document.querySelector('#rule-uppercase').style.color = /[A-Z]/.test(passwordValue) ? 'green' : 'darkred';
  document.querySelector('#rule-lowercase').style.color = /[a-z]/.test(passwordValue) ? 'green' : 'darkred';
  document.querySelector('#rule-number').style.color = /\d/.test(passwordValue) ? 'green' : 'darkred';
  document.querySelector('#rule-special').style.color = /[!@#$%+^&*()/|-]/.test(passwordValue) ? 'green' : 'darkred';
});