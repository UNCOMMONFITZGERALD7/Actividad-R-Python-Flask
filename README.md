# Actividad React + Flask + PostgreSQL

Se necesitan dos PowerShell abiertas al mismo tiempo: una para el backend y otra para el frontend.

## Backend (Flask)

Primera vez:

```
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install flask flask-cors psycopg2-binary python-dotenv
```

Crear un archivo `.env` dentro de `backend` con:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=actividad_flask
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

Ejecutar:

```
cd backend
.\venv\Scripts\Activate.ps1
flask --app app run --debug
```

Queda en http://localhost:5000

## Frontend (React + Vite)

Primera vez:

```
cd frontend
npm install
```

Ejecutar:

```
cd frontend
npm run dev
```

Queda en http://localhost:5173

## Notas

- PostgreSQL debe estar corriendo y con las tablas paridad, tablamult y numerorandom creadas.
- Si PowerShell no deja activar el entorno virtual, ejecutar una vez: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
- Cambiar `backend` y `frontend` por el nombre real de tus carpetas.