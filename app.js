const form = document.querySelector('form');
const firstName = document.querySelector('#first-name');
const lastName = document.querySelector('#last-name');
const email = document.querySelector('#email');
const phone = document.querySelector('#phone');
const password = document.querySelector('#password');
const confirmPassword = document.querySelector('#confirm-password');
const passwordToggle = document.querySelector('#password + .field-icon');
const confirmPasswordToggle = document.querySelector('#confirm-password + .field-icon');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  validateEmptyFields();
  validatePasswords(true);
  validateInputs();
});

function isEmpty(input) {
  return input.value === '';
}

function validateEmptyFields() {
  const fields = [firstName, lastName, email, password, confirmPassword];
  
  for (let field of fields) {
    if (isEmpty(field)) {
      alert('Please fill out all fields.');
      return false;
    }
  }
  
  return true;
}

password.addEventListener('input', function() {
  validatePasswords(false);
});
confirmPassword.addEventListener('input', function() {
  validatePasswords(false);
});

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

function validateInputs() {
  if (!validateEmptyFields() || !validatePasswords()) {
    return;
  }
}

passwordToggle.addEventListener('click', function() {
  togglePasswordVisibility(password, passwordToggle);
});

confirmPasswordToggle.addEventListener('click', function() {
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