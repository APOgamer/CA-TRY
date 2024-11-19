def sort_transactions(data):
    # algoritmo para ordenar por fecha y monto
    try:
        transactions = [line.strip().split(': $') for line in data.split('\n')]
        transactions = [(date, float(amount)) for date, amount in transactions]
        
        sorted_by_date = merge_sort(transactions, key=lambda x: x[0])
        sorted_by_amount = merge_sort(transactions, key=lambda x: x[1])
        
        return {
            'por_fecha': [f"{date}: ${amount}" for date, amount in sorted_by_date],
            'por_monto': [f"{date}: ${amount}" for date, amount in sorted_by_amount]
        }
    except Exception as e:
        return {'error': str(e)}

def merge_sort(arr, key=lambda x: x):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid], key)
    right = merge_sort(arr[mid:], key)
    
    return merge(left, right, key)

def merge(left, right, key):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if key(left[i]) <= key(right[j]):
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result

def find_financing_routes(data):  # busqueda de rutas de financiamiento
    try:
        options = [line.strip().split(', ') for line in data.split('\n')]
        processed_options = []
        
        for option in options:
            amount = float(option[0].split('$')[1])
            rate = float(option[1].split('%')[0])
            term = int(option[2].split()[0])
            
            monthly_payment = calculate_monthly_payment(amount, rate/100/12, term)
            total_cost = monthly_payment * term
            
            processed_options.append({
                'monto': amount,
                'tasa': rate,
                'plazo': term,
                'pago_mensual': round(monthly_payment, 2),
                'costo_total': round(total_cost, 2)
            })
        
        return sorted(processed_options, key=lambda x: x['costo_total'])
    except Exception as e:
        return {'error': str(e)}

def calculate_monthly_payment(principal, monthly_rate, term):
    return principal * (monthly_rate * (1 + monthly_rate)**term) / ((1 + monthly_rate)**term - 1)

def group_debts(data):
    # aca se aplico union find
    try:
        lines = data.split('\n')
        clients = {}
        
        def find(client):
            if clients[client] != client:
                clients[client] = find(clients[client])
            return clients[client]
        
        def union(client1, client2):
            root1 = find(client1)
            root2 = find(client2)
            if root1 != root2:
                clients[root2] = root1
        
        for line in lines:
            debtor, creditor = line.split(' debe ')[0], line.split(' a ')[1]
            if debtor not in clients:
                clients[debtor] = debtor
            if creditor not in clients:
                clients[creditor] = creditor
            union(debtor, creditor)
        
        groups = {}
        for client in clients:
            root = find(client)
            if root not in groups:
                groups[root] = []
            groups[root].append(client)
        
        return list(groups.values())
    except Exception as e:
        return {'error': str(e)}

def minimize_branch_costs(data): # MST-kruskal
    try:
        lines = data.split('\n')
        edges = []
        vertices = set()
        
        for line in lines:
            cities, cost = line.split(': $')
            city1, city2 = cities.split(' - ')
            cost = int(cost)
            edges.append((cost, city1, city2))
            vertices.add(city1)
            vertices.add(city2)
        parent = {city: city for city in vertices}
        
        def find(city):
            if parent[city] != city:
                parent[city] = find(parent[city])
            return parent[city]
        
        def union(city1, city2):
            parent[find(city2)] = find(city1)
        
        minimum_spanning_tree = []
        total_cost = 0
        
        for cost, city1, city2 in sorted(edges):
            if find(city1) != find(city2):
                union(city1, city2)
                minimum_spanning_tree.append((city1, city2, cost))
                total_cost += cost
        
        return {
            'conexiones': [f"{city1} - {city2}: ${cost}" for city1, city2, cost in minimum_spanning_tree],
            'costo_total': total_cost
        }
    except Exception as e:
        return {'error': str(e)}

def optimize_savings(data): # progrmacion dinamica
    try:
        lines = data.split('\n')
        goal = float(lines[0].split('$')[1])
        years = int(lines[1].split(':')[1].split()[0])
        monthly_save = float(lines[2].split('$')[1])
        
        scenarios = []
        interest_rates = [0.03, 0.05, 0.07]  # tasas de interes
        
        for rate in interest_rates:
            monthly_rate = rate / 12
            months = years * 12
            
            future_value = 0
            for month in range(months):
                future_value += monthly_save
                future_value *= (1 + monthly_rate)
            
            scenarios.append({
                'tasa_anual': f"{rate*100}%",
                'ahorro_mensual': monthly_save,
                'valor_futuro': round(future_value, 2)
            })
        
        return scenarios
    except Exception as e:
        return {'error': str(e)}

def calculate_minimum_debt(data):#bellman ford
    try:
        lines = data.split('\n')
        debts = []
        
        for line in lines:
            bank, info = line.split(': $')
            amount, rate = info.split(' al ')
            amount = float(amount)
            rate = float(rate.split('%')[0])
            
            monthly_rate = rate/100/12
            term = 24
            monthly_payment = calculate_monthly_payment(amount, monthly_rate, term)
            total_cost = monthly_payment * term
            
            debts.append({
                'banco': bank,
                'monto': amount,
                'tasa': rate,
                'pago_mensual': round(monthly_payment, 2),
                'costo_total': round(total_cost, 2)
            })
        
        return sorted(debts, key=lambda x: x['costo_total'])
    except Exception as e:
        return {'error': str(e)}

def compare_bank_rates(data): # floyd warshall
    try:
        lines = data.split('\n')
        banks = {}
        current_bank = None
        
        for line in lines:
            if ':' in line and 'Hipoteca' not in line:
                current_bank = line.split(':')[0]
                banks[current_bank] = {}
            elif current_bank and '%' in line:
                product, rate = line.split(': ')
                banks[current_bank][product] = float(rate.split('%')[0])
        
        comparison = []
        for bank, rates in banks.items():
            for product, rate in rates.items():
                comparison.append({
                    'banco': bank,
                    'producto': product,
                    'tasa': rate
                })
        
        return {
            'hipotecas': sorted([x for x in comparison if x['producto'] == 'Hipoteca'], 
                              key=lambda x: x['tasa']),
            'prestamos_personales': sorted([x for x in comparison if x['producto'] == 'Préstamo personal'], 
                                         key=lambda x: x['tasa'])
        }
    except Exception as e:
        return {'error': str(e)} 