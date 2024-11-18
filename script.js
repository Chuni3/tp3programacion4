// Selección de elementos del DOM
const form = document.getElementById("flightForm");
const fullName = document.getElementById("fullName");
const passport = document.getElementById("passport");
const birthDate = document.getElementById("birthDate");
const nationality = document.getElementById("nationality");
const origin = document.getElementById("origin");
const destination = document.getElementById("destination");
const departureDate = document.getElementById("departureDate");
const returnDate = document.getElementById("returnDate");
const flightClass = document.getElementById("flightClass");
const tickets = document.getElementById("tickets");
const cardNumber = document.getElementById("cardNumber");
const expiryDate = document.getElementById("expiryDate");
const cvv = document.getElementById("cvv");
const cardName = document.getElementById("cardName");
const submitButton = document.getElementById("submitButton");
const formFeedback = document.getElementById("formFeedback");

// URLs para cargar datos JSON
const airportsURL = "https://jsonformatter.org/bb077f";
const countriesURL = "https://gist.github.com/eduardolat/b2a252d17b17363fab0974bb0634d259";

// Cargar datos JSON para aeropuertos y países
async function loadDropdowns() {
    try {
        // Cargar aeropuertos
        const airportsResponse = await fetch(airportsURL);
        const airports = await airportsResponse.json();
        airports.forEach(airport => {
            const optionOrigin = document.createElement("option");
            const optionDestination = document.createElement("option");
            optionOrigin.value = airport;
            optionDestination.value = airport;
            optionOrigin.textContent = airport;
            optionDestination.textContent = airport;
            origin.appendChild(optionOrigin);
            destination.appendChild(optionDestination);
        });

        // Cargar países
        const countriesResponse = await fetch(countriesURL);
        const countries = await countriesResponse.json();
        countries.forEach(country => {
            const option = document.createElement("option");
            option.value = country.name;
            option.textContent = country.name;
            nationality.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar listas:", error);
    }
}

// Llamar a la función de carga al inicio
loadDropdowns();

// Funciones para mostrar/ocultar errores
function showError(input, message) {
    const errorMessage = input.nextElementSibling;
    errorMessage.textContent = message;
    errorMessage.style.visibility = "visible";
    input.classList.add("invalid");
}

function clearError(input) {
    const errorMessage = input.nextElementSibling;
    errorMessage.textContent = "";
    errorMessage.style.visibility = "hidden";
    input.classList.remove("invalid");
}

// Validaciones con expresiones regulares
function validateFullName() {
    const nameRegex = /^[a-zA-Z\s]{3,}$/;
    return validateWithRegex(fullName, nameRegex, "El nombre debe tener al menos 3 caracteres y solo letras y espacios.");
}

function validatePassport() {
    const passportRegex = /^[A-Z0-9]{6,9}$/; // Patrón para Argentina
    return validateWithRegex(passport, passportRegex, "El pasaporte debe ser alfanumérico (6-9 caracteres).");
}

function validateBirthDate() {
    const birth = new Date(birthDate.value);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    return age >= 18 && !isNaN(birth.getTime())
        ? clearError(birthDate)
        : showError(birthDate, "Debes tener al menos 18 años.");
}

function validateDates() {
    const departure = new Date(departureDate.value);
    const returnD = new Date(returnDate.value);
    if (departure <= new Date()) {
        showError(departureDate, "La fecha de salida debe ser posterior a la fecha actual.");
        return false;
    }
    if (returnDate.value && returnD <= departure) {
        showError(returnDate, "La fecha de regreso debe ser posterior a la salida.");
        return false;
    }
    clearError(departureDate);
    clearError(returnDate);
    return true;
}

function validateTickets() {
    const ticketsRegex = /^[1-9]$|^10$/;
    return validateWithRegex(tickets, ticketsRegex, "Selecciona entre 1 y 10 boletos.");
}

function validateCardNumber() {
    const cardRegex = /^\d{16}$/;
    return validateWithRegex(cardNumber, cardRegex, "El número de tarjeta debe tener 16 dígitos.");
}

function validateExpiryDate() {
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const [month, year] = expiryDate.value.split("/");
    const expiry = new Date(`20${year}`, month - 1);
    if (!expiryRegex.test(expiryDate.value) || expiry <= new Date()) {
        showError(expiryDate, "La fecha debe estar en formato MM/AA y ser futura.");
        return false;
    }
    clearError(expiryDate);
    return true;
}

function validateCVV() {
    const cvvRegex = /^\d{3,4}$/;
    return validateWithRegex(cvv, cvvRegex, "El CVV debe tener 3 o 4 dígitos.");
}

function validateCardName() {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return validateWithRegex(cardName, nameRegex, "El nombre debe contener solo letras y espacios.");
}

// Función genérica para validaciones con regex
function validateWithRegex(input, regex, errorMessage) {
    if (!regex.test(input.value.trim())) {
        showError(input, errorMessage);
        return false;
    }
    clearError(input);
    return true;
}

// Validación general
function validateForm() {
    const validations = [
        validateFullName(),
        validatePassport(),
        validateBirthDate(),
        validateDates(),
        validateTickets(),
        validateCardNumber(),
        validateExpiryDate(),
        validateCVV(),
        validateCardName()
    ];
    const isValid = validations.every(Boolean);
    submitButton.disabled = !isValid;
    formFeedback.textContent = isValid
        ? "Formulario listo para enviar."
        : "Corrige los errores para continuar.";
    formFeedback.style.color = isValid ? "green" : "red";
}

// Eventos
form.addEventListener("input", validateForm);

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!submitButton.disabled) {
        alert("Reserva completada con éxito.");
        form.reset();
        validateForm();
    }
});
