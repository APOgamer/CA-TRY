from flask import Flask, render_template, jsonify, request
from algorithms import (
    sort_transactions,
    find_financing_routes,
    group_debts,
    minimize_branch_costs,
    optimize_savings,
    calculate_minimum_debt,
    compare_bank_rates
)
import random
from datetime import datetime, timedelta
from werkzeug.middleware.proxy_fix import ProxyFix
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import logging

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Global cache for rates
_rates_cache = {
    'data': None,
    'timestamp': None
}

def get_cached_rates():
    """Obtiene las tasas del cache o las actualiza si es necesario"""
    global _rates_cache
    
    # Si no hay cache o han pasado más de 24 horas
    if (_rates_cache['data'] is None or 
        _rates_cache['timestamp'] is None or 
        datetime.now() - _rates_cache['timestamp'] > timedelta(hours=24)):
        
        print("Fetching fresh rates")
        rates = fetch_sbs_rates()
        if rates:
            _rates_cache['data'] = rates
            _rates_cache['timestamp'] = datetime.now()
    else:
        print("Using cached rates")
    
    return _rates_cache['data']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/load_example/<type>')
def load_example(type):
    if type == 'rates':
        result = generate_rates_example()
    else:
        examples = {
            'transactions': generate_transaction_example(),
            'financing': generate_financing_example(),
            'debts': generate_debts_example(),
            'branches': generate_branches_example(),
            'savings': generate_savings_example(),
            'min-debt': generate_min_debt_example(),
        }
        result = examples.get(type, "Ejemplo no disponible")
    
    print(f"Returning example for {type}:", result)
    return jsonify({'example': result})

algorithms = {
    'sort_transactions': sort_transactions,
    'financing_routes': find_financing_routes,
    'group_debts': group_debts,
    'minimize_costs': minimize_branch_costs,
    'optimize_savings': optimize_savings,
    'minimum_debt': calculate_minimum_debt,
    'compare_rates': compare_bank_rates
}

@app.route('/calculate/<operation>', methods=['POST'])
def calculate(operation):
    try:
        data = request.json['data']
        if not data:
            return jsonify({'error': 'No se proporcionaron datos'})
        
        if operation in algorithms:
            result = algorithms[operation](data)
            return jsonify(result)
        
        return jsonify({'error': 'Operación no válida'})
    except Exception as e:
        return jsonify({'error': f'Error al procesar la solicitud: {str(e)}'})

def generate_transaction_example():
    transactions = []
    current_date = datetime.now()
    
    for _ in range(5):
        amount = round(random.uniform(1000, 10000), 2)
        date = (current_date - timedelta(days=random.randint(0, 30))).strftime('%Y-%m-%d')
        transactions.append(f"{date}: ${amount}")
    
    return "\n".join(sorted(transactions))  

def generate_financing_example():
    options = []
    for i in range(3):  
        amount = random.randint(50000, 500000) 
        rate = round(random.uniform(8, 15), 2)  
        term = random.choice([12, 24, 36, 48, 60]) 
        options.append(f"Opción {i+1}: ${amount}, {rate}% anual, {term} meses")
    return "\n".join(options)

def generate_debts_example():
    clients = ['Juan Pérez', 'María García', 'Pedro López', 'Ana Martínez', 'Luis Rodríguez']
    debts = []
    used_pairs = set()
    
    for _ in range(4):  
        while True:
            debtor = random.choice(clients)
            creditor = random.choice([c for c in clients if c != debtor])
            if (debtor, creditor) not in used_pairs:
                used_pairs.add((debtor, creditor))
                amount = round(random.uniform(500, 5000), 2) 
                debts.append(f"{debtor} debe ${amount} a {creditor}")
                break
    
    return "\n".join(debts)

def generate_branches_example():
    cities = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao']
    connections = []
    used_pairs = set()
    
    for i in range(len(cities)-1):
        city1 = cities[i]
        city2 = cities[i+1]
        cost = random.randint(5000, 20000)
        connections.append(f"{city1} - {city2}: ${cost}")
        used_pairs.add((city1, city2))
    
    for _ in range(2):
        while True:
            city1, city2 = random.sample(cities, 2)
            if (city1, city2) not in used_pairs and (city2, city1) not in used_pairs:
                cost = random.randint(5000, 20000)
                connections.append(f"{city1} - {city2}: ${cost}")
                used_pairs.add((city1, city2))
                break
    
    return "\n".join(connections)

def generate_savings_example():
    goal = random.randint(100000, 500000)  
    years = random.randint(5, 15)         
    monthly_save = round(goal / (years * 12) * 1.1, 2)  
    return f"Meta: ${goal}\nPlazo: {years} años\nAhorro mensual sugerido: ${monthly_save}"

def generate_min_debt_example():
    banks = ['Banco Santander', 'BBVA', 'CaixaBank', 'Banco Sabadell']
    debts = []
    
    for bank in banks:
        amount = random.randint(10000, 100000)  
        rate = round(random.uniform(5, 15), 2)  
        debts.append(f"{bank}: ${amount} al {rate}% anual")
    
    return "\n".join(debts)

def fetch_sbs_rates():
    driver = None
    try:
        chrome_options = Options()
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--start-maximized')
        
        print("Initializing Chrome...")
        driver = webdriver.Chrome(options=chrome_options)
        
        print("Navigating to URL...")
        url = "https://www.sbs.gob.pe/app/pp/EstadisticasSAEEPortal/Paginas/TIActivaTipoCreditoEmpresa.aspx?tip=B"
        driver.get(url)
        
        time.sleep(10)
        
        print("Looking for table...")
        table = driver.find_element(By.ID, "ctl00_cphContent_rpgActualMn_ctl00_DataZone_DT")
        
        print("Processing table data...")
        rows = table.find_elements(By.TAG_NAME, "tr")
        print(f"Found {len(rows)} rows")
        
        # Obtener todas las filas primero
        table_data = []
        for row in rows:
            cells = row.find_elements(By.TAG_NAME, "td")
            row_data = [cell.text.strip() for cell in cells]
            if row_data:  # Solo agregar filas no vacías
                table_data.append(row_data)
        
        # Seleccionar solo las filas que nos interesan
        selected_rows = []
        if table_data:
            # Última fila (préstamos hipotecarios)
            selected_rows.append(table_data[-1])
            # Séptima fila desde el final
            selected_rows.append(table_data[-8])
        
        print(f"Selected rows:")
        for row in selected_rows:
            print(row)
            
        driver.quit()
        return selected_rows

    except Exception as e:
        logging.error(f"Error fetching SBS rates: {str(e)}")
        print(f"Detailed error: {str(e)}")
        if driver:
            try:
                driver.save_screenshot("error_screenshot.png")
                print("Screenshot saved as error_screenshot.png")
            except:
                pass
            driver.quit()
        return None

def generate_rates_example():
    try:
        selected_rows = get_cached_rates()
        
        if not selected_rows or len(selected_rows) < 2:
            raise ValueError("Could not fetch rates data")
        
        # Obtener los datos de las filas
        hipotecario_row = selected_rows[0]
        personal_row = selected_rows[1]
        
        # Lista de bancos disponibles
        banks = ['BBVA', 'Bancom', 'Crédito', 'Pichincha', 'BIF', 'Scotiabank', 
                'Citibank', 'Interbank', 'Mibanco', 'GNB', 'Falabella', 'Santander']
        
        # Crear lista de bancos que tienen al menos una tasa disponible
        valid_banks = []
        for i, bank in enumerate(banks, start=1):
            hipoteca = hipotecario_row[i] if hipotecario_row[i] != '-' else 'N/A'
            personal = personal_row[i] if personal_row[i] != '-' else 'N/A'
            
            if hipoteca != 'N/A' and personal != 'N/A':
                valid_banks.append((bank, i))  # Guardar el banco y su índice
        
        if not valid_banks:
            return "No hay tasas disponibles en este momento"
        
        # Seleccionar 4 bancos aleatorios
        selected_banks = random.sample(valid_banks, min(4, len(valid_banks)))
        
        rates = []
        for bank, i in selected_banks:
            hipoteca = hipotecario_row[i] if hipotecario_row[i] != '-' else 'N/A'
            personal = personal_row[i] if personal_row[i] != '-' else 'N/A'
            
            rates.append(
                f"{bank}:\n"
                f"Hipoteca: {hipoteca}%\n"
                f"Préstamo personal: {personal}%"
            )
        
        return "\n\n".join(rates)
    
    except Exception as e:
        logging.error(f"Error generating rates example: {str(e)}")
        return "Error al obtener tasas en tiempo real. Por favor, intente más tarde."

if __name__ == '__main__':
    try:
        from waitress import serve
        print("Iniciando servidor en http://0.0.0.0:5000")
        serve(app, host='0.0.0.0', port=5000)
    except ImportError:
        print("Ejecutando en modo desarrollo...")
        app.run(host='0.0.0.0', port=5000, debug=True) 