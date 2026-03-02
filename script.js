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
    const country = data[0];
    const info = document.getElementById('country-info');

    info.innerHTML = `
    <h2>${country.name.common}</h2>
    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <img class="country-flag" src="${country.flags.svg}" alt="${country.name.common} flag">
    `;

    const borderSection = document.getElementById('bordering-countries');
    borderSection.innerHTML = '';

    const borderCodes = (country.borders || []).filter(c => c !== country.cca3);
    if (borderCodes.length) {
        fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(',')}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(bordersData => {
                bordersData.forEach(borderCountry => {
                    const span = document.createElement('span');
                    span.className = 'border-item';
                    span.innerHTML = `
                        <div class="border-name">${borderCountry.name.common}</div>
                        <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" class="border-flag">
                    `;
                    borderSection.appendChild(span);
                });
            })
            .catch(err => {
                console.error('Failed to load border countries', err);
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
        const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);
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

document.getElementById('country-input').addEventListener('keyup', e => {
    if (e.key === 'Enter') document.getElementById('search-btn').click();
});