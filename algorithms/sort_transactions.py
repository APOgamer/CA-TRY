def merge_sort(arr, key=lambda x: x):
    """ordenar"""
    if len(arr) <= 1:
        return arr
    
    # dividir
    mid = len(arr) // 2
    left = merge_sort(arr[:mid], key)
    right = merge_sort(arr[mid:], key)
    
    # combinar
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

def sort_transactions(data):
    """Implementa el algoritmo de ordenamiento por fecha y monto"""
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