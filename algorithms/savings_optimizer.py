def optimize_savings(data):
    """Implementa programación dinámica para optimización de ahorros"""
    try:
        lines = data.split('\n')
        goal = float(lines[0].split('$')[1])
        years = int(lines[1].split(':')[1].split()[0])
        monthly_save = float(lines[2].split('$')[1])
        
        scenarios = []
        interest_rates = [0.03, 0.05, 0.07]
        
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