// Importar las bibliotecas necesarias en index.html
// <script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

const algorithmVisualizations = {
    'sort_transactions': (result, containerId) => {
        const container = document.getElementById(containerId);
        
        // Crear dos canvas: uno para el proceso y otro para el resultado
        const processContainer = document.createElement('div');
        processContainer.style.marginBottom = '20px';
        const resultCanvas = document.createElement('canvas');
        
        container.appendChild(processContainer);
        container.appendChild(resultCanvas);
        
        // Datos originales
        const originalData = result.por_fecha.map(t => parseFloat(t.split('$')[1]));
        
        // Simular el proceso de Merge Sort
        function mergeSortWithSteps(arr) {
            const steps = [{
                type: 'initial',
                array: [...arr],
                message: 'Array inicial'
            }];
            
            function merge(left, right, start) {
                const result = [];
                let i = 0, j = 0;
                
                while (i < left.length && j < right.length) {
                    if (left[i] <= right[j]) {
                        result.push(left[i]);
                        i++;
                    } else {
                        result.push(right[j]);
                        j++;
                    }
                }
                
                return result.concat(left.slice(i)).concat(right.slice(j));
            }
            
            function mergeSort(array, start = 0) {
                if (array.length <= 1) return array;
                
                const mid = Math.floor(array.length / 2);
                const left = array.slice(0, mid);
                const right = array.slice(mid);
                
                steps.push({
                    type: 'split',
                    left: [...left],
                    right: [...right],
                    message: `División: [${array.join(', ')}] → [${left.join(', ')}] | [${right.join(', ')}]`
                });
                
                const sortedLeft = mergeSort(left, start);
                const sortedRight = mergeSort(right, start + mid);
                const merged = merge(sortedLeft, sortedRight, start);
                
                steps.push({
                    type: 'merge',
                    result: [...merged],
                    message: `Fusión: [${sortedLeft.join(', ')}] + [${sortedRight.join(', ')}] → [${merged.join(', ')}]`
                });
                
                return merged;
            }
            
            mergeSort([...arr]);
            return steps;
        }
        
        // Generar los pasos del algoritmo
        const sortingSteps = mergeSortWithSteps(originalData);
        
        // Visualizar el proceso
        processContainer.innerHTML = `
            <div class="merge-sort-visualization">
                <h4>Proceso de Merge Sort</h4>
                ${sortingSteps.map((step, index) => `
                    <div class="merge-sort-step">
                        <div class="step-number">Paso ${index + 1}</div>
                        <div class="step-description">${step.message}</div>
                        <div class="step-arrays">
                            ${step.type === 'initial' ? 
                                `<div class="array">[${step.array.map(n => `<span>${n.toFixed(2)}</span>`).join(', ')}]</div>` :
                                step.type === 'split' ?
                                `<div class="split">
                                    <div class="array left">[${step.left.map(n => `<span>${n.toFixed(2)}</span>`).join(', ')}]</div>
                                    <div class="array right">[${step.right.map(n => `<span>${n.toFixed(2)}</span>`).join(', ')}]</div>
                                </div>` :
                                `<div class="array merged">[${step.result.map(n => `<span>${n.toFixed(2)}</span>`).join(', ')}]</div>`
                            }
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Visualizar el resultado final
        new Chart(resultCanvas, {
            type: 'bar',
            data: {
                labels: result.por_fecha.map(t => t.split(': ')[0]),
                datasets: [{
                    label: 'Transacciones Ordenadas',
                    data: result.por_monto.map(t => parseFloat(t.split('$')[1])),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Resultado Final Ordenado'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Monto ($)'
                        }
                    }
                }
            }
        });
    },

    'financing_routes': (result, containerId) => {
        const container = document.getElementById(containerId);
        
        // Crear tres canvas: grafo de búsqueda, proceso de exploración y resultado
        const graphCtx = document.createElement('canvas');
        const explorationCtx = document.createElement('canvas');
        const resultCtx = document.createElement('canvas');
        
        container.appendChild(graphCtx);
        container.appendChild(explorationCtx);
        container.appendChild(resultCtx);
        
        // Visualización del grafo de búsqueda
        const nodes = result.map((opt, index) => ({
            id: index,
            label: `Opción ${index + 1}`,
            x: opt.plazo,
            y: opt.tasa,
            size: opt.monto / 10000,
            color: index === 0 ? '#2ecc71' : '#e74c3c'
        }));

        const edges = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                edges.push({
                    from: nodes[i].id,
                    to: nodes[j].id,
                    value: Math.abs(result[i].costo_total - result[j].costo_total),
                    title: `Diferencia: $${Math.abs(result[i].costo_total - result[j].costo_total).toLocaleString()}`
                });
            }
        }

        // Crear red de visualización
        const network = new vis.Network(graphCtx, {
            nodes: new vis.DataSet(nodes),
            edges: new vis.DataSet(edges)
        }, {
            physics: {
                stabilization: true,
                barnesHut: {
                    gravitationalConstant: -2000,
                    springConstant: 0.04
                }
            }
        });

        // Visualización del proceso de exploración
        new Chart(explorationCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Espacio de Búsqueda',
                    data: result.map((opt, index) => ({
                        x: opt.plazo,
                        y: opt.tasa,
                        r: opt.monto / 10000
                    })),
                    backgroundColor: (context) => {
                        const index = context.dataIndex;
                        return index === 0 ? 'rgba(46, 204, 113, 0.6)' : 'rgba(231, 76, 60, 0.6)';
                    }
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Exploración de Opciones'
                },
                scales: {
                    x: {title: {display: true, text: 'Plazo (meses)'}},
                    y: {title: {display: true, text: 'Tasa (%)'}}
                }
            }
        });

        // Visualización del resultado
        new Chart(resultCtx, {
            type: 'line',
            data: {
                labels: result.map((_, i) => `Opción ${i + 1}`),
                datasets: [{
                    label: 'Costo Total',
                    data: result.map(opt => opt.costo_total),
                    borderColor: 'rgb(75, 192, 192)',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Comparación de Costos'
                }
            }
        });
    },

    'group_debts': (result, containerId) => {
        const container = document.getElementById(containerId);
        const networkContainer = document.createElement('div');
        networkContainer.style.height = '400px';
        container.appendChild(networkContainer);

        // Visualizar el proceso de Union-Find
        const nodes = new vis.DataSet();
        const edges = new vis.DataSet();
        
        // Crear nodos para cada persona
        result.forEach((group, groupIndex) => {
            group.members.forEach(member => {
                nodes.add({
                    id: member,
                    label: member,
                    group: groupIndex,
                    color: {
                        background: `hsl(${groupIndex * 360/result.length}, 70%, 80%)`,
                        border: `hsl(${groupIndex * 360/result.length}, 70%, 60%)`
                    }
                });
            });
            
            // Agregar aristas para las transacciones optimizadas
            group.transactions.forEach(t => {
                edges.add({
                    from: t.from,
                    to: t.to,
                    label: `$${t.amount}`,
                    arrows: 'to',
                    color: {
                        color: `hsl(${groupIndex * 360/result.length}, 70%, 60%)`,
                        highlight: '#2ecc71'
                    }
                });
            });
        });

        new vis.Network(networkContainer, {
            nodes: nodes,
            edges: edges
        }, {
            physics: {
                solver: 'forceAtlas2Based',
                forceAtlas2Based: {
                    gravitationalConstant: -50,
                    springLength: 200
                }
            },
            groups: {
                useDefaultGroups: false
            }
        });
    },

    'minimize_costs': (result, containerId) => {
        const container = document.getElementById(containerId);
        const networkContainer = document.createElement('div');
        networkContainer.style.height = '400px';
        container.appendChild(networkContainer);

        // Visualizar el proceso de Kruskal MST
        const nodes = new vis.DataSet();
        const edges = new vis.DataSet();
        const cities = new Set();

        // Extraer todas las ciudades
        result.conexiones.forEach(conn => {
            const [city1, city2] = conn.split(': $')[0].split(' - ');
            cities.add(city1);
            cities.add(city2);
        });

        // Crear nodos
        Array.from(cities).forEach(city => {
            nodes.add({
                id: city,
                label: city,
                color: {
                    background: '#81ecec',
                    border: '#00cec9'
                }
            });
        });

        // Agregar aristas del MST
        result.conexiones.forEach((conn, index) => {
            const [cities, cost] = conn.split(': $');
            const [city1, city2] = cities.split(' - ');
            edges.add({
                from: city1,
                to: city2,
                label: `$${cost}`,
                color: {
                    color: '#00b894',
                    highlight: '#00cec9'
                },
                width: 3,
                physics: false
            });
        });

        new vis.Network(networkContainer, {
            nodes: nodes,
            edges: edges
        }, {
            physics: {
                enabled: true,
                solver: 'forceAtlas2Based'
            }
        });
    },

    'optimize_savings': (result, containerId) => {
        const container = document.getElementById(containerId);
        const dpCanvas = document.createElement('canvas');
        container.appendChild(dpCanvas);

        // Visualizar la tabla de programación dinámica
        const labels = result.map(r => r.tasa_anual);
        const datasets = [
            {
                label: 'Valor Futuro',
                data: result.map(r => r.valor_futuro),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true
            },
            {
                label: 'Ahorro Mensual',
                data: result.map(r => r.ahorro_mensual),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true
            }
        ];

        new Chart(dpCanvas, {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valor ($)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Optimización de Ahorros - Programación Dinámica'
                    }
                }
            }
        });
    },

    'minimum_debt': (result, containerId) => {
        const container = document.getElementById(containerId);
        const bellmanCanvas = document.createElement('canvas');
        container.appendChild(bellmanCanvas);

        // Visualizar el proceso de Bellman-Ford
        const steps = result.map((debt, index) => ({
            x: index,
            y: debt.costo_total,
            label: debt.banco
        }));

        new Chart(bellmanCanvas, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Ruta de Minimización de Deuda',
                    data: steps,
                    backgroundColor: steps.map((_, i) => 
                        i === 0 ? 'rgba(46, 204, 113, 0.6)' : 'rgba(231, 76, 60, 0.6)'
                    ),
                    borderColor: steps.map((_, i) => 
                        i === 0 ? 'rgb(46, 204, 113)' : 'rgb(231, 76, 60)'
                    ),
                    pointRadius: 10
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Costo Total ($)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const point = context.raw;
                                return [
                                    `Banco: ${point.label}`,
                                    `Costo Total: $${point.y.toLocaleString()}`
                                ];
                            }
                        }
                    }
                }
            }
        });
    },

    'compare_rates': (result, containerId) => {
        const container = document.getElementById(containerId);
        const floydCanvas = document.createElement('canvas');
        container.appendChild(floydCanvas);

        // Visualizar el proceso de Floyd-Warshall
        const banks = result.hipotecas.map(h => h.banco);
        const datasets = [
            {
                label: 'Tasas Hipotecarias',
                data: result.hipotecas.map(h => h.tasa),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                type: 'line',
                fill: true
            },
            {
                label: 'Tasas Préstamos Personales',
                data: result.prestamos_personales.map(p => p.tasa),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgb(54, 162, 235)',
                type: 'line',
                fill: true
            }
        ];

        if (result.arbitraje && result.arbitraje.length > 0) {
            datasets.push({
                label: 'Oportunidades de Arbitraje',
                data: result.arbitraje.map(a => a.diferencia),
                backgroundColor: 'rgba(255, 206, 86, 0.5)',
                borderColor: 'rgb(255, 206, 86)',
                type: 'bar'
            });
        }

        new Chart(floydCanvas, {
            type: 'line',
            data: {
                labels: banks,
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Tasa (%)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Análisis de Tasas y Arbitraje'
                    }
                }
            }
        });
    }
}; 

// Función auxiliar para merge sort
function mergeArrays(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
}