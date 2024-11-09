const algorithmSteps = {
    'sort_transactions': (result) => `
        <div class="algorithm-steps">
            <h4>Procedimiento del Algoritmo Merge Sort:</h4>
            <ol>
                <li>División: Se divide la lista de ${result.por_fecha.length} transacciones en mitades.</li>
                <li>Ordenamiento recursivo: Se ordenan las sublistas.</li>
                <li>Combinación: Se fusionan las sublistas ordenadas.</li>
                <li>Complejidad: O(n log n) para ${result.por_fecha.length} elementos.</li>
            </ol>
            <div class="complexity">
                Número de operaciones ≈ ${Math.round(result.por_fecha.length * Math.log2(result.por_fecha.length))}
            </div>
        </div>`,

    'financing_routes': (result) => `
        <div class="algorithm-steps">
            <h4>Procedimiento del Algoritmo de Búsqueda de Rutas:</h4>
            <ol>
                <li>Cálculo de pagos mensuales usando la fórmula de amortización.</li>
                <li>Evaluación de ${result.length} opciones de financiamiento.</li>
                <li>Ordenamiento por costo total para encontrar la ruta óptima.</li>
                <li>Complejidad: O(n log n) para comparación de rutas.</li>
            </ol>
            <div class="formula">
                PMT = P * (r(1+r)^n) / ((1+r)^n - 1)
                <br>
                Donde: P = Principal, r = Tasa mensual, n = Número de pagos
            </div>
        </div>`,

    'group_debts': (result) => `
        <div class="algorithm-steps">
            <h4>Procedimiento del Algoritmo Union-Find:</h4>
            <ol>
                <li>Inicialización de ${result.reduce((sum, g) => sum + g.members.length, 0)} nodos.</li>
                <li>Union de nodos conectados por deudas.</li>
                <li>Optimización de transacciones dentro de cada grupo.</li>
                <li>Complejidad: O(α(n)) por operación, donde α es la función inversa de Ackermann.</li>
            </ol>
            <div class="optimization">
                Transacciones originales: ${result.reduce((sum, g) => sum + g.transactions.length, 0)}
                <br>
                Transacciones optimizadas: ${result.reduce((sum, g) => sum + g.transactions.length, 0)}
            </div>
        </div>`,

    'minimize_costs': (result) => `
        <div class="algorithm-steps">
            <h4>Procedimiento del Algoritmo de Kruskal (MST):</h4>
            <ol>
                <li>Ordenamiento de ${result.conexiones.length} conexiones por costo.</li>
                <li>Selección iterativa de aristas mínimas.</li>
                <li>Verificación de ciclos usando Union-Find.</li>
                <li>Complejidad: O(E log E) donde E es el número de conexiones.</li>
            </ol>
            <div class="tree-info">
                Conexiones totales posibles: ${Math.pow(result.conexiones.length + 1, 2)/2}
                <br>
                Conexiones en MST: ${result.conexiones.length}
            </div>
        </div>`,

    'optimize_savings': (result) => `
        <div class="algorithm-steps">
            <h4>Procedimiento de Programación Dinámica:</h4>
            <ol>
                <li>Cálculo de subproblemas para ${result.length} tasas diferentes.</li>
                <li>Construcción de tabla de valores futuros.</li>
                <li>Optimización de la ruta de ahorro.</li>
                <li>Complejidad: O(n*m) donde n = períodos, m = escenarios.</li>
            </ol>
            <div class="calculations">
                Fórmula: FV = PMT * ((1 + r)^n - 1) / r
                <br>
                Donde: FV = Valor Futuro, PMT = Pago Mensual, r = Tasa, n = Períodos
            </div>
        </div>`,

    'minimum_debt': (result) => `
        <div class="algorithm-steps">
            <h4>Procedimiento del Algoritmo Bellman-Ford:</h4>
            <ol>
                <li>Construcción del grafo con ${result.length} vértices (bancos).</li>
                <li>Relajación iterativa de aristas (tasas).</li>
                <li>Detección de ciclos negativos (arbitraje).</li>
                <li>Complejidad: O(VE) donde V = vértices, E = aristas.</li>
            </ol>
            <div class="path-info">
                Iteraciones realizadas: ${result.length * (result.length - 1)}
                <br>
                Camino óptimo encontrado con costo: $${result[0].costo_total.toLocaleString()}
            </div>
        </div>`,

    'compare_rates': (result) => `
        <div class="algorithm-steps">
            <h4>Procedimiento del Algoritmo Floyd-Warshall:</h4>
            <ol>
                <li>Inicialización de matriz de distancias para ${result.hipotecas.length} bancos.</li>
                <li>Actualización iterativa de caminos mínimos.</li>
                <li>Detección de arbitraje entre tasas.</li>
                <li>Complejidad: O(n³) donde n es el número de bancos.</li>
            </ol>
            <div class="matrix-info">
                Comparaciones realizadas: ${Math.pow(result.hipotecas.length, 3)}
                <br>
                Oportunidades de arbitraje encontradas: ${result.arbitraje ? result.arbitraje.length : 0}
            </div>
        </div>`
};

function loadExample(type) {
    fetch(`/load_example/${type}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById(type).value = data.example;
            fillFormFromExample(type, data.example);
        });
}

function fillFormFromExample(type, exampleData) {
    try {
        const lines = exampleData.split('\n');
        
        switch(type) {
            case 'transactions':
                const transForm = document.getElementById('transactions-form');
                transForm.innerHTML = '';
                
                lines.forEach(line => {
                    const [date, amount] = line.split(': $');
                    if (date && amount && !isNaN(parseFloat(amount))) {
                        const entry = createTransactionEntry(date, parseFloat(amount).toFixed(2));
                        transForm.appendChild(entry);
                    }
                });
                break;

            case 'financing':
                const finForm = document.getElementById('financing-form');
                finForm.innerHTML = '';
                
                lines.forEach(line => {
                    const [_, amount, rate, term] = line.match(/Opción \d+: \$(\d+), (\d+\.?\d*)% anual, (\d+) meses/);
                    const entry = createFinancingEntry(amount, rate, term);
                    finForm.appendChild(entry);
                });
                break;

            case 'debts':
                const debtsForm = document.getElementById('debts-form');
                debtsForm.innerHTML = '';
                
                lines.forEach(line => {
                    const [debtor, rest] = line.split(' debe $');
                    const [amount, creditor] = rest.split(' a ');
                    const entry = createDebtEntry(debtor, amount, creditor);
                    debtsForm.appendChild(entry);
                });
                break;

            case 'branches':
                const branchForm = document.getElementById('branches-form');
                branchForm.innerHTML = '';
                
                lines.forEach(line => {
                    const [cities, cost] = line.split(': $');
                    const [city1, city2] = cities.split(' - ');
                    const entry = createBranchEntry(city1, city2, cost);
                    branchForm.appendChild(entry);
                });
                break;

            case 'savings':
                const [goal, years, monthly] = lines.map(line => line.split('$')[1] || line.split(': ')[1]);
                document.getElementById('savings-goal').value = goal;
                document.getElementById('savings-years').value = years.split(' ')[0];
                document.getElementById('monthly-savings').value = monthly;
                break;

            case 'min-debt':
                const minDebtForm = document.getElementById('min-debt-form');
                minDebtForm.innerHTML = '';
                
                lines.forEach(line => {
                    const [bank, rest] = line.split(': $');
                    const [amount, rate] = rest.split(' al ');
                    const rateValue = rate.split('%')[0];
                    const entry = createMinDebtEntry(bank, amount, rateValue);
                    minDebtForm.appendChild(entry);
                });
                break;

            case 'rates':
                const ratesForm = document.getElementById('rates-form');
                ratesForm.innerHTML = '';
                
                let currentBank = '';
                let rates = {};
                
                lines.forEach(line => {
                    if (!line.includes('%')) {
                        currentBank = line.split(':')[0];
                        rates = {};
                    } else {
                        const [product, rate] = line.split(': ');
                        rates[product] = rate.split('%')[0];
                        if (Object.keys(rates).length === 2) {
                            const entry = createBankRateEntry(currentBank, rates['Hipoteca'], rates['Préstamo personal']);
                            ratesForm.appendChild(entry);
                        }
                    }
                });
                break;
        }
    } catch (error) {
        console.error('Error al llenar el formulario:', error);
    }
}

// Funciones auxiliares para crear entradas de formulario
function createTransactionEntry(date = '', amount = '') {
    const div = document.createElement('div');
    div.className = 'transaction-entry';
    div.innerHTML = `
        <input type="date" class="date-input" required value="${date}">
        <input type="number" step="0.01" min="0" placeholder="Monto" class="amount-input" required value="${amount}">
        <button type="button" class="remove-entry">-</button>
    `;
    return div;
}

function createFinancingEntry(amount = '', rate = '', term = '') {
    const div = document.createElement('div');
    div.className = 'financing-entry';
    div.innerHTML = `
        <input type="number" step="1000" min="0" placeholder="Monto del préstamo" class="amount-input" required value="${amount}">
        <input type="number" step="0.01" min="0" max="100" placeholder="Tasa anual %" class="rate-input" required value="${rate}">
        <input type="number" step="1" min="1" max="360" placeholder="Plazo (meses)" class="term-input" required value="${term}">
        <button type="button" class="remove-entry">-</button>
    `;
    return div;
}

function createDebtEntry(debtor = '', amount = '', creditor = '') {
    const div = document.createElement('div');
    div.className = 'debt-entry';
    div.innerHTML = `
        <input type="text" placeholder="Deudor" class="debtor-input" required value="${debtor}">
        <input type="number" step="0.01" min="0" placeholder="Monto" class="amount-input" required value="${amount}">
        <input type="text" placeholder="Acreedor" class="creditor-input" required value="${creditor}">
        <button type="button" class="remove-entry">-</button>
    `;
    return div;
}

function createBranchEntry(city1 = '', city2 = '', cost = '') {
    const div = document.createElement('div');
    div.className = 'branch-entry';
    div.innerHTML = `
        <input type="text" placeholder="Ciudad 1" class="city1-input" required value="${city1}">
        <input type="text" placeholder="Ciudad 2" class="city2-input" required value="${city2}">
        <input type="number" step="1" min="0" placeholder="Costo de conexión" class="cost-input" required value="${cost}">
        <button type="button" class="remove-entry">-</button>
    `;
    return div;
}

function createMinDebtEntry(bank = '', amount = '', rate = '') {
    const div = document.createElement('div');
    div.className = 'debt-min-entry';
    div.innerHTML = `
        <input type="text" placeholder="Nombre del banco" class="bank-input" required value="${bank}">
        <input type="number" step="0.01" min="0" placeholder="Monto" class="amount-input" required value="${amount}">
        <input type="number" step="0.01" min="0" max="100" placeholder="Tasa anual %" class="rate-input" required value="${rate}">
        <button type="button" class="remove-entry">-</button>
    `;
    return div;
}

function createBankRateEntry(bank = '', mortgageRate = '', personalRate = '') {
    const div = document.createElement('div');
    div.className = 'bank-rate-entry';
    div.innerHTML = `
        <input type="text" placeholder="Nombre del banco" class="bank-input" required value="${bank}">
        <div class="rates-inputs">
            <label>Hipoteca:</label>
            <input type="number" step="0.01" min="0" max="100" placeholder="Tasa %" class="mortgage-rate" required value="${mortgageRate}">
            <label>Préstamo personal:</label>
            <input type="number" step="0.01" min="0" max="100" placeholder="Tasa %" class="personal-rate" required value="${personalRate}">
        </div>
        <button type="button" class="remove-entry">-</button>
    `;
    return div;
}

function calculate(operation) {
    const formMapping = {
        'sort_transactions': 'transactions',
        'financing_routes': 'financing',
        'group_debts': 'debts',
        'minimize_costs': 'branches',
        'optimize_savings': 'savings',
        'minimum_debt': 'min-debt',
        'compare_rates': 'rates'
    };

    const baseId = formMapping[operation];
    if (!baseId) {
        console.error('Operación no válida:', operation);
        return;
    }

    const formId = `${baseId}-form`;
    const resultDiv = document.getElementById(`${baseId}-result`);
    
    console.log('Intentando procesar formulario:', formId);

    if (!updateTextarea(formId, baseId, operation)) {
        resultDiv.innerHTML = `<div class="error">Por favor, complete todos los campos requeridos.</div>`;
        return;
    }

    const data = document.getElementById(baseId).value;
    console.log('Datos a enviar:', data);

    fetch(`/calculate/${operation}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({data: data}),
    })
    .then(response => response.json())
    .then(result => {
        console.log('Resultado recibido:', result);
        if (result.error) {
            resultDiv.innerHTML = `<div class="error">${result.error}</div>`;
            return;
        }
        
        try {
            const formattedResult = formatResult(operation, result);
            resultDiv.innerHTML = formattedResult;
        } catch (error) {
            console.error('Error al formatear resultado:', error);
            resultDiv.innerHTML = `<div class="error">Error al procesar el resultado: ${error.message}</div>`;
        }
    })
    .catch(error => {
        console.error('Error en la petición:', error);
        resultDiv.innerHTML = `<div class="error">Error al procesar la solicitud: ${error.message}</div>`;
    });
}

function formatResult(operation, result) {
    // Verificar si el resultado es válido
    if (!result || typeof result === 'string' || result.error) {
        return `<div class="error">${result.error || 'Error al procesar los datos'}</div>`;
    }

    try {
        let baseHtml = '';
        
        switch(operation) {
            case 'sort_transactions':
                if (!result.por_fecha || !result.por_monto) {
                    throw new Error('Datos de transacciones inválidos');
                }
                const maxTransaction = result.por_monto[result.por_monto.length - 1];
                const [maxDate, maxAmount] = maxTransaction.split(': $');
                baseHtml = `
                    <h3>Ordenado por Fecha:</h3>
                    <table>
                        <tr><th>Fecha</th><th>Monto</th></tr>
                        ${result.por_fecha.map(trans => {
                            const [date, amount] = trans.split(': $');
                            return `<tr><td>${date}</td><td>$${amount}</td></tr>`;
                        }).join('')}
                    </table>
                    <h3>Ordenado por Monto:</h3>
                    <table>
                        <tr><th>Fecha</th><th>Monto</th></tr>
                        ${result.por_monto.map(trans => {
                            const [date, amount] = trans.split(': $');
                            return `<tr><td>${date}</td><td>$${amount}</td></tr>`;
                        }).join('')}
                    </table>
                    <div class="conclusion">
                        <h4>Conclusión:</h4>
                        <p>La transacción más significativa fue de $${maxAmount} realizada el ${maxDate}.</p>
                        <p>Total de transacciones analizadas: ${result.por_fecha.length}</p>
                    </div>`;
                break;

            case 'financing_routes':
                if (!Array.isArray(result)) {
                    throw new Error('Datos de financiamiento inválidos');
                }
                const bestOption = result[0];
                const worstOption = result[result.length - 1];
                const savings = worstOption.costo_total - bestOption.costo_total;
                baseHtml = `
                    <table>
                        <tr>
                            <th>Monto</th>
                            <th>Tasa Anual</th>
                            <th>Plazo (meses)</th>
                            <th>Pago Mensual</th>
                            <th>Costo Total</th>
                        </tr>
                        ${result.map(option => `
                            <tr>
                                <td>$${option.monto.toLocaleString()}</td>
                                <td>${option.tasa}%</td>
                                <td>${option.plazo}</td>
                                <td>$${option.pago_mensual.toLocaleString()}</td>
                                <td>$${option.costo_total.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </table>
                    <div class="conclusion">
                        <h4>Conclusión:</h4>
                        <p>La opción más económica requiere un pago mensual de $${bestOption.pago_mensual.toLocaleString()} 
                           con una tasa del ${bestOption.tasa}% a ${bestOption.plazo} meses.</p>
                        <p>Eligiendo esta opción, se ahorraría $${savings.toLocaleString()} 
                           comparado con la opción más costosa.</p>
                    </div>`;
                break;

            case 'group_debts':
                if (!Array.isArray(result)) {
                    throw new Error('Datos de deudas inválidos');
                }
                baseHtml = `
                    <h3>Grupos de Deudas Relacionadas:</h3>
                    ${result.map((group, index) => `
                        <div class="debt-group">
                            <strong>Grupo ${index + 1}:</strong> ${group.members.join(', ')}
                            <h4>Transacciones optimizadas:</h4>
                            <ul>
                                ${group.transactions.map(t => `
                                    <li>${t.from} debe pagar $${t.amount.toLocaleString()} a ${t.to}</li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}
                    <div class="conclusion">
                        <h4>Conclusión:</h4>
                        <p>Se identificaron ${result.length} grupos de deudas relacionadas.</p>
                        <p>Total de transacciones optimizadas: ${result.reduce((sum, group) => 
                            sum + group.transactions.length, 0)}</p>
                    </div>`;
                break;

            case 'minimize_costs':
                if (!result.conexiones) {
                    throw new Error('Datos de costos inválidos');
                }
                const savings_percentage = ((result.conexiones.length / 
                    (Math.pow(result.conexiones.length + 1, 2) - (result.conexiones.length + 1)) * 2) * 100).toFixed(1);
                baseHtml = `
                    <h3>Conexiones Óptimas:</h3>
                    <table>
                        <tr><th>Conexión</th><th>Costo</th></tr>
                        ${result.conexiones.map(conn => `
                            <tr><td>${conn.split(': $')[0]}</td><td>$${conn.split(': $')[1]}</td></tr>
                        `).join('')}
                    </table>
                    <div class="total-cost">
                        <strong>Costo Total:</strong> $${result.costo_total.toLocaleString()}
                    </div>
                    <div class="conclusion">
                        <h4>Conclusión:</h4>
                        <p>Se logró una red óptima con ${result.conexiones.length} conexiones.</p>
                        <p>Esta solución utiliza solo el ${savings_percentage}% de las posibles conexiones,
                           maximizando la eficiencia de la red.</p>
                    </div>`;
                break;

            case 'optimize_savings':
                if (!Array.isArray(result)) {
                    throw new Error('Datos de ahorro inválidos');
                }
                const bestScenario = result.reduce((max, scenario) => 
                    parseFloat(scenario.valor_futuro) > parseFloat(max.valor_futuro) ? scenario : max
                );
                baseHtml = `
                    <table>
                        <tr>
                            <th>Tasa Anual</th>
                            <th>Ahorro Mensual</th>
                            <th>Valor Futuro</th>
                        </tr>
                        ${result.map(scenario => `
                            <tr>
                                <td>${scenario.tasa_anual}</td>
                                <td>$${scenario.ahorro_mensual.toLocaleString()}</td>
                                <td>$${scenario.valor_futuro.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </table>
                    <div class="conclusion">
                        <h4>Conclusión:</h4>
                        <p>El mejor escenario se logra con una tasa anual del ${bestScenario.tasa_anual},
                           alcanzando un valor futuro de $${bestScenario.valor_futuro.toLocaleString()}.</p>
                        <p>Con un ahorro mensual de $${bestScenario.ahorro_mensual.toLocaleString()},
                           se maximiza el retorno de la inversión.</p>
                    </div>`;
                break;

            case 'minimum_debt':
                if (!Array.isArray(result)) {
                    throw new Error('Datos de deuda mínima inválidos');
                }
                const bestDebt = result[0];
                const totalDebt = result.reduce((sum, debt) => sum + debt.monto, 0);
                baseHtml = `
                    <table>
                        <tr>
                            <th>Banco</th>
                            <th>Monto</th>
                            <th>Tasa Anual</th>
                            <th>Pago Mensual</th>
                            <th>Costo Total</th>
                        </tr>
                        ${result.map(debt => `
                            <tr>
                                <td>${debt.banco}</td>
                                <td>$${debt.monto.toLocaleString()}</td>
                                <td>${debt.tasa}%</td>
                                <td>$${debt.pago_mensual.toLocaleString()}</td>
                                <td>$${debt.costo_total.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </table>
                    <div class="conclusion">
                        <h4>Conclusión:</h4>
                        <p>La deuda más conveniente es con ${bestDebt.banco} con una tasa del ${bestDebt.tasa}%.</p>
                        <p>Deuda total: $${totalDebt.toLocaleString()}</p>
                        <p>Pago mensual más bajo: $${bestDebt.pago_mensual.toLocaleString()}</p>
                    </div>`;
                break;

            case 'compare_rates':
                if (!result.hipotecas || !result.prestamos_personales) {
                    throw new Error('Datos de tasas inválidos');
                }
                const bestMortgage = result.hipotecas[0];
                const bestPersonal = result.prestamos_personales[0];
                baseHtml = `
                    <h3>Tasas Hipotecarias:</h3>
                    <table>
                        <tr><th>Banco</th><th>Tasa</th></tr>
                        ${result.hipotecas.map(h => `
                            <tr><td>${h.banco}</td><td>${h.tasa}%</td></tr>
                        `).join('')}
                    </table>
                    <h3>Tasas de Préstamos Personales:</h3>
                    <table>
                        <tr><th>Banco</th><th>Tasa</th></tr>
                        ${result.prestamos_personales.map(p => `
                            <tr><td>${p.banco}</td><td>${p.tasa}%</td></tr>
                        `).join('')}
                    </table>
                    ${result.arbitraje.length > 0 ? `
                        <h3>Oportunidades de Arbitraje:</h3>
                        <ul>
                            ${result.arbitraje.map(a => `
                                <li>Ruta: ${a.ruta} (diferencia: ${a.diferencia.toFixed(2)}%)</li>
                            `).join('')}
                        </ul>
                    ` : ''}
                    <div class="conclusion">
                        <h4>Conclusión:</h4>
                        <p>Mejor tasa hipotecaria: ${bestMortgage.banco} con ${bestMortgage.tasa}%</p>
                        <p>Mejor tasa personal: ${bestPersonal.banco} con ${bestPersonal.tasa}%</p>
                        <p>Diferencia entre mejor y peor tasa hipotecaria: 
                           ${(result.hipotecas[result.hipotecas.length-1].tasa - bestMortgage.tasa).toFixed(2)}%</p>
                        ${result.arbitraje.length > 0 ? `
                            <p>Se encontraron ${result.arbitraje.length} oportunidades de arbitraje entre bancos.</p>
                        ` : ''}
                    </div>`;
                break;

            default:
                return `<div class="error">Operación no soportada</div>`;
        }

        return baseHtml + (algorithmSteps[operation] || '');
    } catch (error) {
        console.error('Error al formatear resultado:', error);
        return `<div class="error">Error al procesar los datos: ${error.message}</div>`;
    }
}

function initializeForms() {
    document.querySelectorAll('.add-entry').forEach(button => {
        button.addEventListener('click', function() {
            const container = this.closest('.form-container');
            const entryType = container.id.replace('-form', '');
            let newEntry;
            
            // Crear una nueva entrada vacía del tipo correcto
            switch(entryType) {
                case 'transactions':
                    newEntry = createTransactionEntry();
                    break;
                case 'financing':
                    newEntry = createFinancingEntry();
                    break;
                case 'debts':
                    newEntry = createDebtEntry();
                    break;
                case 'branches':
                    newEntry = createBranchEntry();
                    break;
                case 'min-debt':
                    newEntry = createMinDebtEntry();
                    break;
                case 'rates':
                    newEntry = createBankRateEntry();
                    break;
            }
            
            if (newEntry) {
                // Cambiar el botón + por -
                const addButton = newEntry.querySelector('button');
                addButton.textContent = '-';
                addButton.classList.remove('add-entry');
                addButton.classList.add('remove-entry');
                addButton.addEventListener('click', function() {
                    this.closest('div').remove();
                });
                
                container.appendChild(newEntry);
            }
        });
    });
}

function updateTextarea(formId, baseId, operation) {
    const form = document.getElementById(formId);
    const textarea = document.getElementById(baseId);

    if (!form || !textarea) {
        console.error('No se encontraron los elementos del formulario', {
            formId,
            baseId,
            formExists: !!form,
            textareaExists: !!textarea
        });
        return false;
    }

    try {
        let text = '';
        let isValid = false;

        switch(operation) {
            case 'sort_transactions':
                const transactions = Array.from(form.querySelectorAll('.transaction-entry'))
                    .map(entry => ({
                        date: entry.querySelector('.date-input')?.value,
                        amount: entry.querySelector('.amount-input')?.value
                    }))
                    .filter(t => t.date && t.amount);

                if (transactions.length > 0) {
                    text = transactions.map(t => `${t.date}: $${t.amount}`).join('\n');
                    isValid = true;
                }
                break;

            case 'financing_routes':
                const financings = Array.from(form.querySelectorAll('.financing-entry'))
                    .map(entry => ({
                        amount: entry.querySelector('.amount-input').value,
                        rate: entry.querySelector('.rate-input').value,
                        term: entry.querySelector('.term-input').value
                    }))
                    .filter(f => f.amount && f.rate && f.term);

                if (financings.length > 0) {
                    text = financings.map((f, i) => 
                        `Opción ${i + 1}: $${f.amount}, ${f.rate}% anual, ${f.term} meses`
                    ).join('\n');
                    isValid = true;
                }
                break;

            case 'group_debts':
                const debts = Array.from(form.querySelectorAll('.debt-entry'))
                    .map(entry => ({
                        debtor: entry.querySelector('.debtor-input').value,
                        amount: entry.querySelector('.amount-input').value,
                        creditor: entry.querySelector('.creditor-input').value
                    }))
                    .filter(d => d.debtor && d.amount && d.creditor);

                if (debts.length > 0) {
                    text = debts.map(d => 
                        `${d.debtor} debe $${d.amount} a ${d.creditor}`
                    ).join('\n');
                    isValid = true;
                }
                break;

            case 'minimize_costs':
                const branches = Array.from(form.querySelectorAll('.branch-entry'))
                    .map(entry => ({
                        city1: entry.querySelector('.city1-input').value,
                        city2: entry.querySelector('.city2-input').value,
                        cost: entry.querySelector('.cost-input').value
                    }))
                    .filter(b => b.city1 && b.city2 && b.cost);

                if (branches.length > 0) {
                    text = branches.map(b => 
                        `${b.city1} - ${b.city2}: $${b.cost}`
                    ).join('\n');
                    isValid = true;
                }
                break;

            case 'optimize_savings':
                const goal = document.getElementById('savings-goal').value;
                const years = document.getElementById('savings-years').value;
                const monthly = document.getElementById('monthly-savings').value;

                if (goal && years && monthly) {
                    text = `Meta: $${goal}\nPlazo: ${years} años\nAhorro mensual sugerido: $${monthly}`;
                    isValid = true;
                }
                break;

            case 'minimum_debt':
                const minDebts = Array.from(form.querySelectorAll('.debt-min-entry'))
                    .map(entry => ({
                        bank: entry.querySelector('.bank-input').value,
                        amount: entry.querySelector('.amount-input').value,
                        rate: entry.querySelector('.rate-input').value
                    }))
                    .filter(d => d.bank && d.amount && d.rate);

                if (minDebts.length > 0) {
                    text = minDebts.map(d => 
                        `${d.bank}: $${d.amount} al ${d.rate}% anual`
                    ).join('\n');
                    isValid = true;
                }
                break;

            case 'compare_rates':
                const banks = Array.from(form.querySelectorAll('.bank-rate-entry'))
                    .map(entry => ({
                        bank: entry.querySelector('.bank-input').value,
                        mortgage: entry.querySelector('.mortgage-rate').value,
                        personal: entry.querySelector('.personal-rate').value
                    }))
                    .filter(b => b.bank && b.mortgage && b.personal);

                if (banks.length > 0) {
                    text = banks.map(b => 
                        `${b.bank}:\nHipoteca: ${b.mortgage}%\nPréstamo personal: ${b.personal}%`
                    ).join('\n');
                    isValid = true;
                }
                break;
        }

        if (!isValid) {
            console.error('No hay datos válidos para procesar en', formId);
            return false;
        }

        textarea.value = text;
        console.log('Texto actualizado para', baseId, ':', text);
        return true;

    } catch (error) {
        console.error('Error al actualizar textarea:', error);
        return false;
    }
}

function toggleTutorial(tutorialId) {
    const tutorial = document.getElementById(tutorialId);
    const isHidden = tutorial.style.display === 'none';
    
    // Ocultar todos los tutoriales primero
    document.querySelectorAll('.tutorial').forEach(t => {
        t.style.display = 'none';
    });
    
    // Mostrar u ocultar el tutorial seleccionado
    tutorial.style.display = isHidden ? 'block' : 'none';
    
    // Cambiar el texto del botón
    const button = tutorial.previousElementSibling.querySelector('.tutorial-btn');
    button.textContent = isHidden ? 'Ocultar Tutorial' : 'Ver Tutorial';
}

document.addEventListener('DOMContentLoaded', initializeForms); 