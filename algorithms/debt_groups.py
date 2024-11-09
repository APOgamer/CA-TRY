def group_debts(data):
    """Implementa el algoritmo Union-Find para agrupar deudas relacionadas y optimizar pagos"""
    try:
        lines = data.split('\n')
        clients = {}
        debt_graph = {}  # Grafo de deudas
        
        def find(client):
            if clients[client] != client:
                clients[client] = find(clients[client])
            return clients[client]
        
        def union(client1, client2):
            root1 = find(client1)
            root2 = find(client2)
            if root1 != root2:
                clients[root2] = root1
        
        # Construir grafo de deudas
        for line in lines:
            debtor, rest = line.split(' debe $')
            amount, creditor = rest.split(' a ')
            amount = float(amount)
            
            if debtor not in debt_graph:
                debt_graph[debtor] = {'balance': 0, 'transactions': []}
            if creditor not in debt_graph:
                debt_graph[creditor] = {'balance': 0, 'transactions': []}
            
            debt_graph[debtor]['balance'] -= amount
            debt_graph[creditor]['balance'] += amount
            debt_graph[debtor]['transactions'].append((creditor, amount))
            
            if debtor not in clients:
                clients[debtor] = debtor
            if creditor not in clients:
                clients[creditor] = creditor
            union(debtor, creditor)
        
        # Agrupar clientes relacionados
        groups = {}
        for client in clients:
            root = find(client)
            if root not in groups:
                groups[root] = []
            groups[root].append(client)
        
        # Optimizar transacciones dentro de cada grupo
        optimized_groups = []
        for group in groups.values():
            group_transactions = []
            # Encontrar deudores y acreedores en el grupo
            debtors = [(c, debt_graph[c]['balance']) for c in group if debt_graph[c]['balance'] < 0]
            creditors = [(c, debt_graph[c]['balance']) for c in group if debt_graph[c]['balance'] > 0]
            
            # Ordenar por monto
            debtors.sort(key=lambda x: x[1])
            creditors.sort(key=lambda x: x[1], reverse=True)
            
            # Optimizar pagos
            i, j = 0, 0
            while i < len(debtors) and j < len(creditors):
                debtor, debt = debtors[i]
                creditor, credit = creditors[j]
                amount = min(abs(debt), credit)
                
                if amount > 0:
                    group_transactions.append({
                        'from': debtor,
                        'to': creditor,
                        'amount': round(amount, 2)
                    })
                
                debtors[i] = (debtor, debt + amount)
                creditors[j] = (creditor, credit - amount)
                
                if abs(debtors[i][1]) < 0.01:
                    i += 1
                if abs(creditors[j][1]) < 0.01:
                    j += 1
            
            optimized_groups.append({
                'members': group,
                'transactions': group_transactions
            })
        
        return optimized_groups
    except Exception as e:
        return {'error': str(e)}