def optimize_savings(data):
    """Implementa programación dinámica para optimización de ahorros"""
    try:
        lines = data.split('\n')
        goal = float(lines[0].split('$')[1])
        years = int(lines[1].split(':')[1].split()[0])
        monthly_save = float(lines[2].split('$')[1])
        
        # Tasas base para diferentes tipos de inversión
        base_rates = {
            'Conservador': [0.04, 0.06],      # 4-6% anual
            'Moderado': [0.07, 0.12],         # 7-12% anual
            'Agresivo': [0.13, 0.18]          # 13-18% anual
        }
        
        # Matriz de programación dinámica para almacenar los mejores resultados
        dp = {}
        scenarios = []
        
        def calculate_future_value(monthly_amount, rate, months, inflation=0.04):
            real_rate = (1 + rate) / (1 + inflation) - 1  # Ajuste por inflación
            future_value = 0
            accumulated = monthly_amount
            
            # Usar programación dinámica para calcular el valor futuro
            for month in range(months):
                month_key = (monthly_amount, rate, month)
                if month_key in dp:
                    future_value = dp[month_key]
                else:
                    if month > 0:
                        # Aplicar interés al acumulado y sumar el nuevo ahorro
                        accumulated = accumulated * (1 + real_rate/12) + monthly_amount
                        future_value = accumulated
                    else:
                        future_value = monthly_amount
                    dp[month_key] = future_value
            
            return future_value
        
        months = years * 12
        
        # Calcular escenarios para cada perfil de riesgo
        for profile, rate_range in base_rates.items():
            min_rate, max_rate = rate_range
            # Calcular tasas intermedias
            rates = [min_rate + (max_rate - min_rate) * i / 2 for i in range(3)]
            
            for rate in rates:
                # Calcular diferentes montos de ahorro mensual
                for adjustment in [0.8, 1.0, 1.2]:  # -20%, +0%, +20% del ahorro sugerido
                    adjusted_monthly = monthly_save * adjustment
                    future_value = calculate_future_value(adjusted_monthly, rate, months)
                    
                    # Calcular métricas adicionales
                    total_invested = adjusted_monthly * months
                    investment_return = future_value - total_invested
                    roi_percentage = (investment_return / total_invested) * 100
                    
                    scenarios.append({
                        'perfil': profile,
                        'tasa_anual': f"{rate*100:.1f}%",
                        'ahorro_mensual': round(adjusted_monthly, 2),
                        'valor_futuro': round(future_value, 2),
                        'retorno_inversion': round(investment_return, 2),
                        'roi_porcentaje': round(roi_percentage, 2)
                    })
        
        # Ordenar escenarios por valor futuro
        scenarios.sort(key=lambda x: x['valor_futuro'], reverse=True)
        
        return scenarios
    except Exception as e:
        return {'error': str(e)} 