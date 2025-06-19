class SalaryCalculator {
    constructor() {
        this.countries = [];
        this.languages = [];
        this.selectedCountry = '';
        this.selectedLanguage = '';
        this.salaryData = [];

        this.init();
    }

    async init() {
        await this.loadCountries();
        await this.loadLanguages();
        this.setupEventListeners();
    }

    async loadCountries() {
        try {
            const response = await fetch('/api/countries');
            this.countries = await response.json();
            this.populateCountryDropdown();
        } catch (error) {
            console.error('Error loading countries:', error);
        }
    }

    async loadLanguages() {
        try {
            const response = await fetch('/api/languages');
            this.languages = await response.json();
            this.populateLanguageDropdown();
        } catch (error) {
            console.error('Error loading languages:', error);
        }
    }

    populateCountryDropdown() {
        const select = document.getElementById('country');
        select.innerHTML = '<option value="">Select country</option>';

        this.countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            select.appendChild(option);
        });
    }

    populateLanguageDropdown() {
        const select = document.getElementById('language');
        select.innerHTML = '<option value="">Select programming language</option>';

        this.languages.forEach(language => {
            const option = document.createElement('option');
            option.value = language;
            option.textContent = language;
            select.appendChild(option);
        });
    }

    setupEventListeners() {
        const countrySelect = document.getElementById('country');
        const languageSelect = document.getElementById('language');

        countrySelect.addEventListener('change', (e) => {
            this.selectedCountry = e.target.value;
            this.checkAndCalculate();
        });

        languageSelect.addEventListener('change', (e) => {
            this.selectedLanguage = e.target.value;
            this.checkAndCalculate();
        });
    }

    checkAndCalculate() {
        if (this.selectedCountry && this.selectedLanguage) {
            this.calculateSalary();
        } else {
            this.hideResults();
        }
    }

    async calculateSalary() {
        this.showLoading();

        try {
            const url = `/api/salary-data?country=${encodeURIComponent(this.selectedCountry)}&language=${encodeURIComponent(this.selectedLanguage)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Data not found');
            }

            const data = await response.json();
            this.salaryData = data;
            this.displayResults(data);
        } catch (error) {
            console.error('Error calculating salary:', error);
            this.showError();
        }
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
        document.getElementById('results-container').style.display = 'none';
        document.getElementById('error-message').style.display = 'none';
    }

    showError() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('results-container').style.display = 'none';
        document.getElementById('error-message').style.display = 'block';
    }

    hideResults() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('results-container').style.display = 'none';
        document.getElementById('error-message').style.display = 'none';
    }

    displayResults(data) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error-message').style.display = 'none';

        // Update text
        document.getElementById('selected-country').textContent = this.selectedCountry;
        document.getElementById('selected-language').textContent = this.selectedLanguage;

        // Create chart
        this.createChart(data);

        document.getElementById('results-container').style.display = 'block';
    }

    createChart(data) {
        const chartContainer = document.getElementById('salary-chart');
        const legendContainer = document.getElementById('chart-legend');

        if (data.length === 0) {
            chartContainer.innerHTML = '<p>No data available</p>';
            return;
        }

        // Fixed salary range from $0K to $300K
        const globalMin = 0;
        const globalMax = 300;
        const range = globalMax - globalMin;

        // Experience level order and vibrant colors
        const experienceOrder = ['<1 year', '1–2 years', '3–5 years', '6–10 years', '11–16 years', '16+ years'];
        const experienceColors = {
            '<1 year': '#FF6B35',        // Vibrant Orange
            '1–2 years': '#F7931E',      // Bright Orange
            '3–5 years': '#9B59B6',      // Vibrant Purple
            '6–10 years': '#3498DB',     // Bright Blue
            '11–16 years': '#E91E63',    // Vibrant Pink
            '16+ years': '#1ABC9C'       // Vibrant Teal
        };

        // Create chart HTML
        let chartHTML = '';

        experienceOrder.forEach((expLevel, index) => {
            const dataForLevel = data.find(d => d.experience === expLevel);

            if (dataForLevel) {
                const color = experienceColors[expLevel];

                chartHTML += `
                    <div class="experience-level">
                        <div class="salary-line-container">
                            <div class="salary-line" style="left: ${((Math.max(dataForLevel.min, globalMin) - globalMin) / range) * 100}%; width: ${((Math.min(dataForLevel.max, globalMax) - Math.max(dataForLevel.min, globalMin)) / range) * 100}%; background-color: ${color};"></div>
                            <div class="salary-dots">
                `;

                // Add dots for each salary value
                dataForLevel.all_values.forEach((salary, salaryIndex) => {
                    if (salary >= globalMin && salary <= globalMax) {
                        const position = ((salary - globalMin) / range) * 100;
                        chartHTML += `
                            <div class="salary-dot" 
                                 style="left: ${position}%; background: ${color};"
                                 data-experience="${expLevel}"
                                 data-salary="${salary}"
                                 onmouseover="salaryApp.showTooltip(event, '${expLevel}', ${salary})"
                                 onmouseout="salaryApp.hideTooltip()">
                            </div>
                        `;
                    }
                });

                chartHTML += `
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // Empty row for missing experience levels
                chartHTML += `
                    <div class="experience-level">
                        <div class="salary-line-container"></div>
                    </div>
                `;
            }
        });

        // Add fixed axis labels
        const axisLabels = ['$0K', '$25K', '$50K', '$75K', '$100K', '$125K', '$150K', '$175K', '$200K', '$225K', '$250K', '$275K', '$300K'];
        chartHTML += `
            <div class="chart-axis">
                ${axisLabels.map(label => `<span>${label}</span>`).join('')}
            </div>
        `;

        chartContainer.innerHTML = chartHTML;

        // Create legend - reverse order so highest experience is on top
        let legendHTML = '';
        const reversedOrder = [...experienceOrder].reverse();
        reversedOrder.forEach(exp => {
            const hasData = data.some(d => d.experience === exp);
            if (hasData) {
                legendHTML += `
                    <div class="legend-item">
                        <div class="legend-color" style="background: ${experienceColors[exp]};"></div>
                        <span>${exp}</span>
                    </div>
                `;
            }
        });

        legendContainer.innerHTML = legendHTML;
    }

    showTooltip(event, experience, salary) {
        const tooltip = document.getElementById('experience-info');

        document.getElementById('info-country').textContent = this.selectedCountry;
        document.getElementById('info-language').textContent = this.selectedLanguage;
        document.getElementById('info-experience').textContent = experience;
        document.getElementById('info-salary').textContent = `$${salary}K / year`;

        tooltip.style.display = 'block';

        // Position tooltip relative to the chart container
        const chartContainer = document.querySelector('.chart-container');
        const rect = chartContainer.getBoundingClientRect();

        let left = event.clientX - rect.left + 10;
        let top = event.clientY - rect.top - 10;

        // Keep tooltip within chart bounds
        if (left + 130 > rect.width) {
            left = event.clientX - rect.left - 140;
        }
        if (top < 0) {
            top = event.clientY - rect.top + 10;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    hideTooltip() {
        document.getElementById('experience-info').style.display = 'none';
    }
}

// Share button functionality
function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: 'IT Salary Calculator - JetBrains',
            text: 'Check out this salary calculator for developers!',
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard!');
        }).catch(() => {
            // If clipboard API is not supported, show the URL
            prompt('Copy this link:', window.location.href);
        });
    }
}

// Initialize the application
const salaryApp = new SalaryCalculator();
