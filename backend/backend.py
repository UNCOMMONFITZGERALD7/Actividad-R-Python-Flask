import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import psycopg2
from datetime import datetime
from psycopg2.extras import RealDictCursor
import random
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])    

def conexionpsql():
    return psycopg2.connect(
        host=os.environ.get("DB_HOST", "localhost"),
        port=int(os.environ.get("DB_PORT", 5432)),
        dbname=os.environ["DB_NAME"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
    )


@app.get("/")
def introduccion():
    return "bienvenido, tienes API"


# @app.get("/api/sumar")
# def sumar():
#     a = request.args.get("a", type=int)
#     b = request.args.get("b", type=int)
#     if a is None or b is None:
#         return jsonify({'error': 'Faltan los parametros a o b'}), 400
#     return jsonify({'resultado': a + b})

# @app.get("/api/hora")
# def hora_actual():
#     return jsonify({'Hora': datetime.now().isoformat()})

# @app.get("/api/doble/<int:n>")
# def doble(n):
#     return jsonify({'resultado': n * 2})

# @app.post("/api/saludar")
# def saludar():
#     datos = request.get_json(silent=True) or {}
#     nombre = datos.get("nombre")
#     if not nombre:
#         return jsonify({"error": "Ingresa el nombre"}), 400
#     return jsonify({"mensaje": f"Hola, {nombre}"})

# @app.get("/api/bd")
# def probar_bd():
#     try:
#         conn = conexionpsql()
#     except psycopg2.OperationalError:
#         return jsonify({'error': 'No se ha podido conectar'})
    
#     try:
#         with conn.cursor() as cur:
#             cur.execute("SELECT version();")
#             version = cur.fetchone()[0]
#     finally:
#         conn.close()
        
#     return jsonify({'estado': "Conectado", "version": version})

# @app.get("/api/tareas")
# def lista_tareas():
#     conn = conexionpsql()
#     try:
#         with conn.cursor(cursor_factory=RealDictCursor) as cur:
#             cur.execute("SELECT * FROM tareas ORDER BY id")
#             datos = cur.fetchall()
#     finally:
#         conn.close()
        
#     return jsonify(datos)



# @app.put("/api/tareas/<int:id>")
# def modificar_tarea(id):
#     datos = request.get_json(silent=True) or {}
#     tarea = datos.get("completada")
#     if not isinstance(tarea, bool):
#         return jsonify({'error': 'Datos invalidos'}), 401
    
#     conn = conexionpsql()
    
#     try:
#         with conn.cursor(cursor_factory=RealDictCursor) as cur:
#             cur.execute(
#                 "UPDATE tareas SET completada = %s WHERE id = %s "
#                 "RETURNING id, titulo, completada",
#                 (tarea, id)
#             )
#             nueva = cur.fetchone()
#             if not nueva:
#                 return jsonify({'error' : 'Valor invalido'}), 401
#         conn.commit()
#     except Exception:
#         conn.rollback()
#         raise
#     finally:
#         conn.close()

#     return jsonify(nueva), 201


    
# @app.post("/api/tareas")
# def ingresar_tareas():
#     datos = request.get_json(silent=True) or {}
#     titulo = datos.get("titulo")
    
#     if not titulo:
#         return jsonify({'error': 'Valor invalido'}), 401
    
#     conn = conexionpsql()
    
#     try:
#         with conn.cursor(cursor_factory=RealDictCursor) as cur:
#             cur.execute(
#                 "INSERT INTO tareas (titulo) VALUES (%s) "
#                 "RETURNING id, tareas, completada",
#                 (titulo,)
#             )
#             nueva = cur.fetchone()
#         conn.commit()
#     except Exception:
#         conn.rollback()
#         raise
#     finally:
#         conn.close()
    
#     return jsonify(nueva), 201





### APARTADO PAR E IMPAR

@app.post("/api/paridad")
def ingresar_tareas():
    datos = request.get_json(silent=True) or {}
    numero = datos.get("numero")
    
    if not numero:
        return jsonify({'error': 'Valor invalido'}), 401
    
    conn = conexionpsql()
    
    try:
        resultado = False
        if (numero % 2 == 0):
            resultado = True
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "INSERT INTO paridad (numero, resultado) VALUES (%s, %s) "
                "RETURNING id, numero, resultado",
                (numero, resultado,)
            )
            nueva = cur.fetchone()
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
    
    return jsonify(nueva), 201
    
    
@app.get("/api/paridad")
def mostrar_historial():
    conn = conexionpsql()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM paridad ORDER BY id")
            datos = cur.fetchall()
    finally:
        conn.close()
        
    return jsonify(datos)

@app.delete("/api/paridad")
def eliminar_item():
    requisicion = request.get_json(silent=True) or {}
    id_eliminar = requisicion.get("id_eliminar")    

    if isinstance(id_eliminar, str):
        return jsonify({'error': 'Valor invalido'}), 400
    
    conn = conexionpsql()
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "DELETE FROM paridad WHERE id = %s ", (id_eliminar,))
            cur.execute("SELECT * FROM paridad ORDER BY id")
            datos = cur.fetchall()
            conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
    
    return jsonify(datos), 200


### TABLA DE MULTIPLICAR

@app.get("/api/tablamult")
def mostrar_tablamult():
    conn = conexionpsql()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM tablamult ORDER BY id")
            datos = cur.fetchall()
    finally:
        conn.close()
        
    return jsonify(datos)

@app.post("/api/tablamult")
def ingresar_tablas():
    datos = request.get_json(silent=True) or {}
    numero = datos.get("numero")
    
    if not numero:
        return jsonify({'error': 'Valor invalido'}), 401
    
    conn = conexionpsql()
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "INSERT INTO tablamult (numero) VALUES (%s) "
                "RETURNING id, numero",
                (numero,)
            )
            nueva = cur.fetchone()
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
    
    return jsonify(nueva), 201

    
    
@app.delete("/api/tablamult")
def eliminar_tabla():
    requisicion = request.get_json(silent=True) or {}
    id_eliminar = requisicion.get("id_eliminar")    

    if isinstance(id_eliminar, str):
        return jsonify({'error': 'Valor invalido'}), 400
    
    conn = conexionpsql()
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("DELETE FROM tablamult WHERE id = %s ", (id_eliminar,))
            cur.execute("SELECT * FROM tablamult ORDER BY id")
            datos = cur.fetchall()
            conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
    
    return jsonify(datos), 200

### NUMERO SECRETO

@app.get("/api/numerorandom")
def numero_random():
    conn = conexionpsql()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT numero FROM numerorandom WHERE id = 1")
            fila = cur.fetchone()
            if fila is None:
                randomnum = random.randint(1, 10)
                cur.execute(
                    "INSERT INTO numerorandom (id, numero) VALUES (1, %s) "
                    "RETURNING numero",
                    (randomnum,)
                )
                fila = cur.fetchone()
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

    return jsonify(fila), 200

@app.post("/api/numerorandom")
def cambiar_numero():
    conn = conexionpsql()
    randomnum = random.randint(1, 10)
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "UPDATE numerorandom SET numero = %s WHERE id = 1 "
                "RETURNING numero",
                (randomnum,)
            )
            numero_nuevo = cur.fetchone()
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
        
    return jsonify(numero_nuevo), 200