# Developer Ecosystem IT Salary Calculator

This web application provides an interactive data visualization of developer salaries based on the JetBrains Developer Ecosystem Survey 2024. It allows users to filter salary data by country, programming language, and years of experience.

## Features

- Interactive data visualization of developer salaries
- Filters for country, programming language, and experience level
- Responsive design that works on desktop and mobile devices
- Accessible UI with keyboard navigation and screen reader support
- Visualizes salary ranges with min, 25th percentile, median, 75th percentile, and max values

## Technology Stack

- **Backend**: Python with Flask
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Data**: JSON-based salary dataset

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Start the Flask server

```bash
python salary_app.py
```

The server will start at http://127.0.0.1:5000/ by default.

### 4. Access the application

Open your web browser and navigate to:

```
http://127.0.0.1:5000/
```

## Data Options

### Using the Flask API (default)

The application by default serves the salary data through a Flask API endpoint at `/api/salaries`.

### Using Static Data (Alternative)

If you prefer to use static data instead of the Flask API, you can modify the JavaScript code to load the data directly:

1. Open `/static/js/app.js`
2. Replace the fetch code block:

```javascript
// Replace this:
const response = await fetch('/api/salaries');
if (!response.ok) {
    throw new Error('Failed to fetch salary data');
}
salaryData = await response.json();

// With this (for static data):
const response = await fetch('/templates/calculatorData.json');
if (!response.ok) {
    throw new Error('Failed to fetch salary data');
}
salaryData = await response.json();
```

## Browser Compatibility

This application is tested and compatible with:
- Google Chrome (latest version)
- Mozilla Firefox (latest version)
- Microsoft Edge (latest version)
- Safari (latest version)

## Accessibility

The application supports:
- Keyboard navigation
- Screen readers
- Focus states on interactive elements
- Proper ARIA attributes for improved accessibility

## License

This project is based on data from the JetBrains Developer Ecosystem Survey 2024. All rights reserved by JetBrains s.r.o.
