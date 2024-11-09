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
    // Mapeo correcto de operaciones a IDs de formulario
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
    console.log('Intentando procesar formulario:', formId);

    if (!updateTextarea(formId, baseId, operation)) {
        document.getElementById(`${baseId}-result`).innerHTML = 
            `<div class="error">Por favor, complete todos los campos requeridos.</div>`;
        return;
    }

    const data = document.getElementById(baseId).value;

    fetch(`/calculate/${operation}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({data: data}),
    })
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            document.getElementById(`${baseId}-result`).innerHTML = 
                `<div class="error">${result.error}</div>`;
            return;
        }
        
        const resultDiv = document.getElementById(`${baseId}-result`);
        resultDiv.innerHTML = formatResult(operation, result);
    })
    .catch(error => {
        document.getElementById(`${baseId}-result`).innerHTML = 
            `<div class="error">Error al procesar la solicitud: ${error}</div>`;
    });
}

function formatResult(operation, result) {
    switch(operation) {
        case 'sort_transactions':
            return `
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
                </table>`;

        case 'financing_routes':
            return `
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
                </table>`;

        case 'group_debts':
            return `
                <h3>Grupos de Deudas Relacionadas:</h3>
                ${result.map((group, index) => `
                    <div class="debt-group">
                        <strong>Grupo ${index + 1}:</strong> ${group.join(', ')}
                    </div>
                `).join('')}`;

        case 'minimize_costs':
            return `
                <h3>Conexiones Óptimas:</h3>
                <table>
                    <tr><th>Conexión</th><th>Costo</th></tr>
                    ${result.conexiones.map(conn => `
                        <tr><td>${conn.split(': $')[0]}</td><td>$${conn.split(': $')[1]}</td></tr>
                    `).join('')}
                </table>
                <div class="total-cost">
                    <strong>Costo Total:</strong> $${result.costo_total.toLocaleString()}
                </div>`;

        case 'optimize_savings':
            return `
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
                </table>`;

        case 'minimum_debt':
            return `
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
                </table>`;

        case 'compare_rates':
            return `
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
                </table>`;

        default:
            return JSON.stringify(result, null, 2);
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