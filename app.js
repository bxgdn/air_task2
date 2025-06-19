// Store the loaded data globally for filtering
let salaryData = {};
let countriesList = [];
let languagesList = {};
let chart = null;

// DOM elements
const countrySelect = document.getElementById('country-select');
const languageSelect = document.getElementById('language-select');
const tooltip = document.getElementById('tooltip');

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Show loading state
        showLoadingState();

        // Fetch salary data from the API
        const response = await fetch('/api/salaries');

        if (!response.ok) {
            throw new Error('Failed to fetch salary data');
        }

        salaryData = await response.json();
        console.log('Loaded salary data:', salaryData);

        // Extract unique values for filters
        processDataForFilters();

        // Populate the dropdowns
        populateCountryDropdown();

        // Set up event listeners for filters
        setupFilterListeners();

        // Initialize chart
        initializeChart();

        // Hide loading state
        hideLoadingState();

        console.log('Application initialized successfully');

    } catch (error) {
        console.error('Error initializing the application:', error);
        displayErrorMessage('Failed to load salary data. Please try again later.');
        hideLoadingState();
    }
});

// Show loading state
function showLoadingState() {
    document.querySelector('.calculator-container').classList.add('loading');
}

// Hide loading state
function hideLoadingState() {
    document.querySelector('.calculator-container').classList.remove('loading');
}

// Process the data to extract unique values for filters
function processDataForFilters() {
    // Extract countries
    countriesList = Object.keys(salaryData).sort();

    // Extract languages for each country
    countriesList.forEach(country => {
        languagesList[country] = Object.keys(salaryData[country]).sort();
    });

    console.log('Countries:', countriesList);
    console.log('Languages by country:', languagesList);
}

// Populate the country dropdown
function populateCountryDropdown() {
    // Clear existing options except the first one
    countrySelect.innerHTML = '<option value="">Select a country</option>';

    countriesList.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}

// Populate the language dropdown based on selected country
function populateLanguageDropdown() {
    const selectedCountry = countrySelect.value;
    languageSelect.innerHTML = '<option value="">Select a language</option>';

    if (selectedCountry && languagesList[selectedCountry]) {
        languagesList[selectedCountry].forEach(language => {
            const option = document.createElement('option');
            option.value = language;
            option.textContent = language;
            languageSelect.appendChild(option);
        });
    }

    // Clear chart if no country selected
    if (!selectedCountry) {
        clearChart();
    }
}

// Set up event listeners for the filter dropdowns
function setupFilterListeners() {
    countrySelect.addEventListener('change', () => {
        populateLanguageDropdown();
        updateChart();
    });

    languageSelect.addEventListener('change', () => {
        updateChart();
    });
}

// Map experience categories to numeric values for proper ordering and normalize category names
function normalizeExperienceCategory(category) {
    // Normalize different variations to standard format
    const normalized = category.toLowerCase().trim();

    if (normalized.includes('less than 1') || normalized === '<1 year' || normalized.includes('< 1')) {
        return '<1 year';
    }
    if (normalized.includes('1-2') || normalized.includes('1–2')) {
        return '1–2 years';
    }
    if (normalized.includes('3-5') || normalized.includes('3–5')) {
        return '3–5 years';
    }
    if (normalized.includes('6-10') || normalized.includes('6–10')) {
        return '6–10 years';
    }
    if (normalized.includes('11-15') || normalized.includes('11–15') || normalized.includes('11-16') || normalized.includes('11–16')) {
        return '11–16 years';
    }
    if (normalized.includes('16-20') || normalized.includes('16–20') || normalized.includes('more than 20') || normalized.includes('16+')) {
        return '16+ years';
    }

    return category; // Return original if no match
}

function getExperienceOrder(category) {
    const orderMap = {
        '<1 year': 0.5,
        '1–2 years': 1.5,
        '3–5 years': 4,
        '6–10 years': 8,
        '11–16 years': 13.5,
        '16+ years': 20
    };
    return orderMap[category] || 999;
}

// Initialize the Chart.js chart
function initializeChart() {
    const ctx = document.getElementById('salaryChart').getContext('2d');

    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'point'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false,
                    external: function(context) {
                        const tooltipModel = context.tooltip;

                        if (tooltipModel.opacity === 0) {
                            hideTooltip();
                            return;
                        }

                        if (tooltipModel.dataPoints && tooltipModel.dataPoints.length > 0) {
                            const dataPoint = tooltipModel.dataPoints[0];
                            const rawData = dataPoint.raw;
                            const experience = rawData.experience;
                            const salary = rawData.y;
                            const country = countrySelect.value;
                            const language = languageSelect.value;

                            // Get the position from the tooltip model
                            const canvasRect = context.chart.canvas.getBoundingClientRect();

                            showTooltip(experience, salary, country, language, {
                                x: canvasRect.left + tooltipModel.caretX,
                                y: canvasRect.top + tooltipModel.caretY
                            });
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Years of Experience',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            // Custom labels for experience levels
                            if (value === 0.5) return '<1 year';
                            if (value === 1.5) return '1–2 years';
                            if (value === 4) return '3–5 years';
                            if (value === 8) return '6–10 years';
                            if (value === 13.5) return '11–16 years';
                            if (value === 20) return '16+ years';
                            return '';
                        },
                        stepSize: 1
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    min: 0,
                    max: 25
                },
                y: {
                    title: {
                        display: true,
                        text: 'Salary (USD)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value + 'K';
                        },
                        stepSize: 25,
                        min: 0,
                        max: 300
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    min: 0,
                    max: 300
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6,
                    backgroundColor: '#0066CC',
                    borderColor: '#ffffff',
                    borderWidth: 1
                }
            }
        }
    });
}

// Clear chart
function clearChart() {
    if (chart) {
        chart.data.datasets = [];
        chart.update();
    }

    // Show default message
    displayDefaultMessage();
}

// Update chart based on selected filters
function updateChart() {
    const selectedCountry = countrySelect.value;
    const selectedLanguage = languageSelect.value;

    // Clear chart if no country or language selected
    if (!selectedCountry || !selectedLanguage) {
        clearChart();
        return;
    }

    try {
        // Get data for selected filters
        const countryData = salaryData[selectedCountry];
        if (!countryData) {
            displayNoDataMessage();
            return;
        }

        const languageData = countryData[selectedLanguage];
        if (!languageData) {
            displayNoDataMessage();
            return;
        }

        const entries = languageData.entries;
        if (!entries || entries.length === 0) {
            displayNoDataMessage();
            return;
        }

        // Process all individual data points
        const dataPoints = entries.map(entry => {
            // Normalize category names
            const normalizedCategory = normalizeExperienceCategory(entry.category);

            return {
                x: getExperienceOrder(normalizedCategory),
                y: entry.value,
                experience: normalizedCategory,
                originalEntry: entry
            };
        }).filter(point => point.x !== 999); // Filter out unrecognized categories

        // Sort by experience level
        dataPoints.sort((a, b) => a.x - b.x);

        console.log('Processed data points:', dataPoints);

        if (dataPoints.length === 0) {
            displayNoDataMessage();
            return;
        }

        // Create dataset for scatter plot with line
        const dataset = {
            label: 'Salary Data',
            data: dataPoints,
            backgroundColor: '#0066CC',
            borderColor: '#0066CC',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            showLine: true,
            tension: 0.3,
            fill: false
        };

        // Update chart with new data
        chart.data.datasets = [dataset];
        chart.update();

        // Show success message
        displaySuccessMessage(selectedCountry, selectedLanguage, dataPoints.length);

    } catch (error) {
        console.error('Error updating chart:', error);
        displayErrorMessage('Failed to update the visualization. Please try different filters.');
    }
}

// Show custom tooltip
function showTooltip(experience, salary, country, language, position) {
    tooltip.querySelector('.tooltip-title').textContent = 'Salary Information';
    tooltip.querySelector('.tooltip-experience').textContent = experience;
    tooltip.querySelector('.tooltip-salary').textContent = `$${salary}K`;
    tooltip.querySelector('.tooltip-country').textContent = country;
    tooltip.querySelector('.tooltip-language').textContent = language;

    tooltip.classList.add('show');

    // Position tooltip near the data point
    const tooltipRect = tooltip.getBoundingClientRect();
    const x = position.x - tooltipRect.width / 2;
    const y = position.y - tooltipRect.height - 15;

    // Keep tooltip within viewport
    const maxX = window.innerWidth - tooltipRect.width - 10;
    const maxY = window.innerHeight - tooltipRect.height - 10;

    tooltip.style.left = `${Math.max(10, Math.min(x, maxX))}px`;
    tooltip.style.top = `${Math.max(10, Math.min(y, maxY))}px`;
}

// Hide tooltip
function hideTooltip() {
    tooltip.classList.remove('show');
}

// Display success message
function displaySuccessMessage(country, language, count) {
    const infoMessage = document.querySelector('.info-message');
    const infoContent = infoMessage.querySelector('p');

    infoContent.textContent = `Showing ${count} salary data points for ${language} developers in ${country}. Each dot represents an individual survey response.`;

    // Reset styling
    infoMessage.className = 'info-message';
}

// Display error message
function displayErrorMessage(message) {
    const infoMessage = document.querySelector('.info-message');
    const infoContent = infoMessage.querySelector('p');

    infoContent.textContent = message;
    infoMessage.className = 'info-message error-message';
}

// Display no data message
function displayNoDataMessage() {
    const infoMessage = document.querySelector('.info-message');
    const infoContent = infoMessage.querySelector('p');

    infoContent.textContent = 'No salary data available for the selected combination. Please try different filters.';
    infoMessage.className = 'info-message error-message';

    // Clear chart
    clearChart();
}

// Display default message
function displayDefaultMessage() {
    const infoMessage = document.querySelector('.info-message');
    const infoContent = infoMessage.querySelector('p');

    infoContent.textContent = 'Salary data is based on the Developer Ecosystem Survey 2024. Select a country and programming language to view salary distribution by experience level.';

    // Reset styling
    infoMessage.className = 'info-message';
}

// Close tooltip when clicking the close button
tooltip.addEventListener('click', (e) => {
    if (e.target.classList.contains('tooltip-close')) {
        hideTooltip();
    }
});

// Add resize handler for responsive behavior
window.addEventListener('resize', () => {
    if (chart) {
        chart.resize();
    }
});
