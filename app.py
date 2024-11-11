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

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/load_example/<type>')
def load_example(type):
    examples = {
        'transactions': generate_transaction_example(),
        'financing': generate_financing_example(),
        'debts': generate_debts_example(),
        'branches': generate_branches_example(),
        'savings': generate_savings_example(),
        'min-debt': generate_min_debt_example(),
        'rates': generate_rates_example()
    }
    return jsonify({'example': examples.get(type, "Ejemplo no disponible")})

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

def generate_rates_example():
    banks = ['Santander', 'BBVA', 'CaixaBank', 'Sabadell', 'Bankinter']
    rates = []
    
    for bank in banks:
        mortgage_rate = round(random.uniform(2.5, 4.5), 2) 
        personal_rate = round(random.uniform(6, 12), 2)     
        rates.append(f"{bank}:\nHipoteca: {mortgage_rate}%\nPréstamo personal: {personal_rate}%")
    
    return "\n".join(rates)

if __name__ == '__main__':
    try:
        from waitress import serve
        print("Iniciando servidor en http://0.0.0.0:5000")
        serve(app, host='0.0.0.0', port=5000)
    except ImportError:
        print("Ejecutando en modo desarrollo...")
        app.run(host='0.0.0.0', port=5000, debug=True) 