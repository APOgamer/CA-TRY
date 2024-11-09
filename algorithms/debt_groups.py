def group_debts(data):
    """Implementa el algoritmo Union-Find para agrupar deudas relacionadas"""
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