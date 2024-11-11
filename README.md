# Calculadora Financiera con Algoritmos Avanzados

Esta aplicación web implementa siete algoritmos financieros diferentes para resolver casos específicos utilizando Python y Flask para el backend, y HTML/JavaScript para el frontend.

## Requisitos Previos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- Navegador web moderno

## Instalación

1. Clonar el repositorio:
2. Crear un nuevo directorio para el proyecto y copiar todos los archivos manteniendo la estructura de carpetas (static/, templates/, algorithms/).
3. Crear un entorno virtual usando `python -m venv venv` y actívalo con `venv\Scripts\activate` en Windows o `source venv/bin/activate` en Linux/Mac.
4. Instalar las dependencias necesarias con `pip install flask waitress`.
5. La estructura del proyecto debe tener:
	* En la carpeta raíz: el archivo `app.py` y `README.md`.
	* En la carpeta `static/`: los archivos `style.css`, `script.js` y `visualizations.js`.
	* En la carpeta `templates/`: el archivo `index.html`.
	* En la carpeta `algorithms/`: todos los archivos Python de los algoritmos (`init.py`, `sort_transactions.py`, `financing_routes.py`, `debt_groups.py`, `branch_costs.py`, `savings_optimizer.py`, `minimum_debt.py`, `bank_rates.py`).
6. Ejecutar el proyecto con `python app.py`.
7. La aplicación estará disponible en `http://localhost:5000`. Para acceder desde otras computadoras en la red local, usar la IP del servidor en lugar de `localhost`.
8. Si es necesario cambiar el puerto (por defecto 5000), modificarlo en `app.py`.
9. La aplicación usa Waitress como servidor WSGI en producción para mejor rendimiento y seguridad. Asegurarse de que el firewall permita conexiones al puerto 5000 si se planea acceder desde otras máquinas.
10. Los archivos estáticos (CSS, JavaScript) se cargarán automáticamente gracias a la configuración de Flask.