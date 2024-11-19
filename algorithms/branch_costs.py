def minimize_branch_costs(data):
    try:
        lines = data.split('\n')
        edges = []
        vertices = set()
        
        # aristas
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