document.getElementById('toggle').addEventListener('change', function() {
    const isChecked = this.checked;
    const loginTitle = document.getElementById('login-title');
    const companyField = document.getElementById('company-field');

    if (isChecked) {
        loginTitle.textContent = "Login Geschäftlich";
        companyField.style.display = 'block';
    } else {
        loginTitle.textContent = "Login Privat";
        companyField.style.display = 'none';
    }
});