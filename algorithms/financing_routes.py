def calculate_monthly_payment(principal, monthly_rate, term):
    return principal * (monthly_rate * (1 + monthly_rate)**term) / ((1 + monthly_rate)**term - 1)

def find_financing_routes(data):
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