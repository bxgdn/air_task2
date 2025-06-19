from flask import Flask, render_template, jsonify, request
import json
import os
from statistics import median, mean
from collections import defaultdict

app = Flask(__name__)


# Load the calculator data
def load_calculator_data():
    try:
        with open('calculatorData.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


calculator_data = load_calculator_data()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/countries')
def get_countries():
    """Get list of available countries"""
    countries = sorted(list(calculator_data.keys()))
    return jsonify(countries)


@app.route('/api/languages')
def get_languages():
    """Get list of all programming languages across all countries"""
    languages = set()
    for country_data in calculator_data.values():
        languages.update(country_data.keys())
    return jsonify(sorted(list(languages)))


@app.route('/api/salary-data')
def get_salary_data():
    """Get salary data based on filters"""
    country = request.args.get('country', '')
    language = request.args.get('language', '')

    if not country or not language:
        return jsonify({'error': 'Country and language are required'}), 400

    if country not in calculator_data or language not in calculator_data[country]:
        return jsonify({'error': 'Data not found for specified filters'}), 404

    data = calculator_data[country][language]['entries']

    # Group data by experience level
    experience_groups = defaultdict(list)
    for entry in data:
        exp = entry['category']
        salary = entry['value']
        experience_groups[exp].append(salary)

    # Calculate statistics for each experience level
    result = []
    experience_order = ['<1 year', '1–2 years', '3–5 years', '6–10 years', '11–16 years', '16+ years']

    for exp in experience_order:
        if exp in experience_groups:
            salaries = sorted(experience_groups[exp])
            if salaries:
                result.append({
                    'experience': exp,
                    'min': min(salaries),
                    'max': max(salaries),
                    'median': median(salaries),
                    'mean': round(mean(salaries), 1),
                    'count': len(salaries),
                    'percentile_10': salaries[int(len(salaries) * 0.1)] if len(salaries) > 1 else salaries[0],
                    'percentile_25': salaries[int(len(salaries) * 0.25)] if len(salaries) > 1 else salaries[0],
                    'percentile_75': salaries[int(len(salaries) * 0.75)] if len(salaries) > 1 else salaries[0],
                    'percentile_90': salaries[int(len(salaries) * 0.9)] if len(salaries) > 1 else salaries[0],
                    'all_values': salaries
                })

    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
