# IT Salary Calculator - Interactive Web Application

An interactive salary visualization web application based on JetBrains Developer Ecosystem Survey 2024 data. Built with Python Flask, HTML, CSS, and JavaScript with Chart.js for dynamic visualizations.

## Features

- **Dropdown menus** for programming language and country selection (matching JetBrains design)
- **Optional experience level filtering** for detailed analysis
- **Dynamic Chart.js visualizations** with multiple chart types:
  - Bar charts showing salary ranges by experience level
  - Histogram distributions for specific experience levels
  - Interactive tooltips and legends
- **Real-time data filtering** via REST API
- **Responsive design** matching the JetBrains Figma design
- **Professional UI** with glassmorphism effects and gradient backgrounds

## Technology Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Charts**: Chart.js for dynamic visualizations
- **Data**: JSON file with salary survey data
- **Styling**: Custom CSS with modern glassmorphism design

## Project Structure

```
it-salary-calculator/
├── salary_app.py              # Flask application with REST API
├── calculatorData.json        # Salary data from JetBrains survey
├── requirements.txt           # Python dependencies
├── templates/
│   └── index.html            # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css         # Modern stylesheet with glassmorphism
│   └── js/
│       └── app.js            # JavaScript with Chart.js integration
└── README.md                 # This file
```

## Setup Instructions

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Create project directory and add files**
```bash
mkdir it-salary-calculator
cd it-salary-calculator
# Add all the project files
```

2. **Create a virtual environment**
```bash
python -m venv venv
```

3. **Activate the virtual environment**
```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

## Running the Application

1. **Start the Flask development server**
```bash
python salary_app.py
```

2. **Access the application**
- Open your web browser
- Navigate to `http://localhost:5000`
- The application will be running and ready to use

## How to Use

### Step 1: Select Parameters
1. **Choose Country**: Select from the dropdown menu
   - Available countries: United States, Germany, etc.
   
2. **Choose Programming Language**: Select from the dropdown menu
   - Languages update based on selected country
   - Examples: JavaScript / TypeScript, Python, etc.

3. **Optional Experience Level**: 
   - Appears after selecting country and language
   - Choose specific experience level or leave as "All experience levels"

### Step 2: View Interactive Charts
- **Multiple Experience Levels**: Shows comparative bar chart with ranges
- **Single Experience Level**: Shows histogram distribution
- **Interactive Features**:
  - Hover tooltips with detailed salary information
  - Chart legends for data series identification
  - Responsive scaling based on data ranges

## API Endpoints

### GET `/api/countries`
Returns list of available countries.
```json
["United States", "Germany"]
```

### GET `/api/languages/<country>`
Returns programming languages for a specific country.
```json
["JavaScript / TypeScript", "Python"]
```

### GET `/api/experience-levels/<country>/<language>`
Returns available experience levels for country and language combination.
```json
["<1 year", "1–2 years", "3–5 years", "6–10 years", "11+ years"]
```

### GET `/api/salary-data?country=<country>&language=<language>&experience=<experience>`
Returns salary statistics. Response varies based on experience parameter:

**Multiple experience levels** (no experience parameter):
```json
[
  {
    "experience": "<1 year",
    "min": 35,
    "max": 90,
    "median": 54,
    "mean": 57.3,
    "count": 5,
    "percentile_25": 42,
    "percentile_75": 77
  }
]
```

**Single experience level** (with experience parameter):
```json
{
  "experience": "<1 year",
  "salaries": [35, 42, 51, 77, 90],
  "min": 35,
  "max": 90,
  "median": 51,
  "mean": 59.0,
  "count": 5,
  "percentile_10": 35,
  "percentile_25": 42,
  "percentile_75": 77,
  "percentile_90": 90
}
```

## Chart Types

### Multi-Experience Bar Chart
- **Use Case**: When no specific experience level is selected
- **Features**:
  - Comparative bars showing 25th-75th percentile ranges
  - Min-max range indicators
  - Median points overlay
  - Experience level labels on X-axis

### Single-Experience Histogram
- **Use Case**: When specific experience level is selected
- **Features**:
  - Salary distribution bins
  - Number of developers per salary range
  - Detailed tooltips with counts

## Design Features

### Visual Elements
- **Gradient Background**: Multi-color gradient matching JetBrains design
- **Glassmorphism Cards**: Semi-transparent cards with backdrop blur
- **Custom Dropdowns**: Styled select elements with custom arrows
- **Loading States**: Animated spinner during data loading
- **Error Handling**: User-friendly error messages

### Responsive Design
- **Desktop**: Two-column layout with sidebar controls
- **Tablet**: Stacked layout with full-width components
- **Mobile**: Optimized for touch interaction

## Data Structure

The `calculatorData.json` contains salary data organized by:
- **Countries**: United States, Germany, etc.
- **Programming Languages**: JavaScript/TypeScript, Python, etc.
- **Experience Levels**: <1 year, 1–2 years, 3–5 years, 6–10 years, 11+ years
- **Individual Entries**: Each with salary value and metadata

## Customization

### Adding New Data
1. Edit `calculatorData.json`
2. Follow the existing structure
3. Restart the Flask application

### Styling Modifications
- **Colors**: Update CSS variables in `style.css`
- **Layout**: Modify flexbox properties
- **Charts**: Customize Chart.js options in `app.js`

### Functionality Extensions
- **New API Endpoints**: Add to `salary_app.py`
- **Chart Types**: Extend JavaScript chart creation methods
- **Filters**: Add new dropdown options and API parameters

## Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Required Features**:
  - ES6 JavaScript support
  - CSS Grid an
