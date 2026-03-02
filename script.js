// helper utilities
function showSpinner(show) {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.toggle('hidden', !show);
}

function showError(message) {
    const errEl = document.getElementById('error-message');
    errEl.textContent = message;
    errEl.classList.toggle('hidden', !message);
}

function displayCountryInfo(data) {
    // assume data is the first element of the array returned by the API
    const country = data[0];
    const info = document.getElementById('country-info');

    info.innerHTML = `
    <h2>${country.name.common}</h2>
    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <img src="${country.flags.svg}" alt="${country.name.common} flag">
    `;

    // show bordering countries if available
    const borderSection = document.getElementById('bordering-countries');
    borderSection.innerHTML = '';

    if (country.borders && country.borders.length) {
        country.borders.forEach(code => {
            const span = document.createElement('span');
            span.className = 'border-item';
            span.textContent = code;
            borderSection.appendChild(span);
        });
    }
}

async function searchCountry(countryName) {
    if (!countryName) {
        showError('Please enter a country name');
        return;
    }

    showError('');
    showSpinner(true);

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        displayCountryInfo(data);
    } catch (error) {
        showError('Unable to find that country.');
        alert(error.message);
    } finally {
        showSpinner(false);
    }
}


document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value.trim();
    searchCountry(country);
});

// allow enter key
document.getElementById('country-input').addEventListener('keyup', e => {
    if (e.key === 'Enter') document.getElementById('search-btn').click();
});