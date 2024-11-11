def compare_bank_rates(data):
    """tasas"""
    try:
        lines = data.split('\n')
        banks = {}
        rates_matrix = {}
        current_bank = None
        
        # parseo
        for line in lines:
            if ':' in line and 'Hipoteca' not in line and 'Préstamo' not in line:
                current_bank = line.split(':')[0]
                banks[current_bank] = {}
            elif current_bank and '%' in line:
                product, rate = line.split(': ')
                banks[current_bank][product] = float(rate.split('%')[0])
                
                # matriz
                if current_bank not in rates_matrix:
                    rates_matrix[current_bank] = {}
                for other_bank in banks:
                    if other_bank not in rates_matrix:
                        rates_matrix[other_bank] = {}
                    rates_matrix[current_bank][other_bank] = float('inf')
                    rates_matrix[other_bank][current_bank] = float('inf')
        
        # diferencias
        bank_list = list(banks.keys())
        for i in range(len(bank_list)):
            for j in range(len(bank_list)):
                if i != j:
                    bank1, bank2 = bank_list[i], bank_list[j]
                    for product in ['Hipoteca', 'Préstamo personal']:
                        if product in banks[bank1] and product in banks[bank2]:
                            diff = banks[bank1][product] - banks[bank2][product]
                            rates_matrix[bank1][bank2] = min(rates_matrix[bank1][bank2], diff)
        
        # arbitraje
        arbitrage_opportunities = []
        for k in bank_list:
            for i in bank_list:
                for j in bank_list:
                    if rates_matrix[i][j] > rates_matrix[i][k] + rates_matrix[k][j]:
                        rates_matrix[i][j] = rates_matrix[i][k] + rates_matrix[k][j]
                        arbitrage_opportunities.append({
                            'ruta': f"{i} → {k} → {j}",
                            'diferencia': abs(rates_matrix[i][j])
                        })
        
        # resultados
        hipotecas = [{'banco': bank, 'tasa': banks[bank]['Hipoteca']} 
                    for bank in banks if 'Hipoteca' in banks[bank]]
        prestamos = [{'banco': bank, 'tasa': banks[bank]['Préstamo personal']} 
                    for bank in banks if 'Préstamo personal' in banks[bank]]
        
        return {
            'hipotecas': sorted(hipotecas, key=lambda x: x['tasa']),
            'prestamos_personales': sorted(prestamos, key=lambda x: x['tasa']),
            'arbitraje': sorted(arbitrage_opportunities, key=lambda x: x['diferencia'], reverse=True)[:3]
        }
    except Exception as e:
        return {'error': str(e)}