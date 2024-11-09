def compare_bank_rates(data):
    """Implementa el algoritmo de Floyd-Warshall para comparar tasas entre bancos"""
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