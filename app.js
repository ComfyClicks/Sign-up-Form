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
  validateEmptyFields();
  validatePasswords(true);
  validateInputs();
});

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
  if (!allowedCharacters(event)) {
    event.preventDefault();
  }
});

function allowedCharacters(event) {
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

function validateInputPattern(input, pattern) {
  const regex = new RegExp(pattern);
  return regex.test(input.value);
}

function validateInputs() {
  const emailPattern = '^([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})$';
  if (!validateEmptyFields() ||
  !validatePasswords()  ||
  !validateInputPattern(email, emailPattern) ||
  !validatePhoneNumber(phone.value)) {
    return;
  }
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
