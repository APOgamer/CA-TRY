def calculate_monthly_payment(principal, monthly_rate, term):
    return principal * (monthly_rate * (1 + monthly_rate)**term) / ((1 + monthly_rate)**term - 1)

def calculate_minimum_debt(data):
    """Implementa el algoritmo de Bellman-Ford para encontrar la ruta de pago mínima"""
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