const form = document.querySelector('form');
const firstName = document.querySelector('#first-name');
const lastName = document.querySelector('#last-name');
const email = document.querySelector('#email');
const phone = document.querySelector('#phone');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirm-password');

const passwordToggle = document.querySelector('#password + .field-icon');
const confirmPasswordToggle = document.querySelector('#confirm-password + .field-icon');

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
  console.log('validateEmptyFields returned true');
  return true;
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

// function validateInputPattern(input, pattern) {
//   const regex = new RegExp(pattern);
//   return regex.test(input.value);
// }

function validateEmail(email) {
  const regex = /^([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})$/i;
  return regex.test(String(email).toLowerCase());
}

// function validateName(name) {

// }

function validateInputs() {
  if (!validateEmptyFields()) {
    return;
  }
  if (!validateEmail(email.value)) {
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

function togglePasswordVisibility(passwordInput, toggleIcon) {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.querySelector('img').src = './assets/hide.svg';
  } else {
    passwordInput.type = 'password';
    toggleIcon.querySelector('img').src = './assets/show.svg';
  }
}
