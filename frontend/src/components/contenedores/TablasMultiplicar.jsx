import { BotonDefault } from "../botones/BotonDefault";
import { InputPlantilla } from "../inputs/InputPlantilla";
import { useState, useEffect } from "react";
import { API } from "../../config/config";
import DecryptedText from "../titulos/Menciones";


export function TablasMultiplicar({ setCargando, cargando }) {
    const [valor, setValor] = useState("")
    const [historial, setHistorial] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        async function cargarHistorial() {
            try {
                const respuesta = await fetch(API + "/api/tablamult")
                if (!respuesta.ok) {
                    const cuerpo = await respuesta.json().catch(() => ({}))
                    throw new Error(cuerpo.error ?? `Error de servicio (${respuesta.status})`)
                }
                const datos = await respuesta.json()
                setHistorial(datos)
            } catch (err) {
                console.error(err)
                setError("No se pudo cargar el historial")
            }
        }
        cargarHistorial()
    }, [])

    function esNumeroValido(n, min, max) {
        return Number.isInteger(n) && n >= min && n <= max
    }

    async function manejarFormulario(e) {
        e.preventDefault();
        const n = Number(valor)

        if (valor === "" || !esNumeroValido(n, 0, 250)) {
            setError("Ingresa un numero valido entre 0 y 250")
            return
        }

        setCargando(true);
        setError(null);

        const esperar = (ms) => new Promise((resultado) => setTimeout(resultado, ms));

        try {
            const respuesta = await fetch(API + "/api/tablamult", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numero: Number(valor) })
            })

            if (!respuesta.ok) {
                const cuerpo = await respuesta.json().catch(() => ({}))
                throw new Error(cuerpo.error ?? `Error de servicio (${respuesta.status})`)
            }

            const datos = await respuesta.json()
            await esperar(2500)
            setHistorial((actuales) => [datos, ...actuales])

            setValor("")
        } catch (err) {
            setError(
                err instanceof TypeError ? "No se pudo conectar al servidor" : err.message
            )
        } finally {
            setCargando(false)
        }
    }

    async function eliminarTabla(ide) {

        setCargando(true);
        setError(null);
        const esperar = (ms) => new Promise((resultado) => setTimeout(resultado, ms));
        try {
            const respuesta = await fetch(API + `/api/tablamult`, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_eliminar: Number(ide) })
            })

            if (!respuesta.ok) {
                const cuerpo = await respuesta.json().catch(() => ({}))
                throw new Error(cuerpo.error ?? `Error de servicio (${respuesta.status})`)
            }

            const datos = await respuesta.json()
            await esperar(2000)
            setHistorial(datos);

        } catch (err) {
            console.log(err);
            setError(
                err instanceof TypeError
                    ? "No se pudo conectar con el servidor"
                    : err.message
            )
        } finally {
            setCargando(false)
        }
    }

    function CapsulaMultiplicadora({ numero }) {
        const datos = []
        for (let i = 0; i < 11; i++) {
            datos.push({ id: numero, segundo: i, resultado: numero * i })
        }
        return (
            datos.map((r) => (
                <div key={r.resultado * + 1} className="capsula-multiplicadora">
                    <div className="dato-multiplicado">{r.id}</div>
                    <div className="dato-multiplicado">&times;</div>
                    <div className="dato-multiplicado">{r.segundo}</div>
                    <div className="dato-multiplicado">=</div>
                    <div className="dato-multiplicado">{r.resultado}</div>
                </div>
            ))
        )
    }

    return (
        <>
            <div className="contenedortitulo">
                <DecryptedText
                    text={"Generador de Tablas de Multiplicar"}
                    speed={30}
                    maxIterations={10}
                    characters="abcdefghijklmopqrstuvwxyz+-%&$#!.,234!?"
                    className="revealed texto-subtitulos"
                    parentClassName="all-letters"
                    encryptedClassName="encrypted texto-subtitulos"
                />
            </div>
            <form className="formulario-default my-6" onSubmit={manejarFormulario}>
                <InputPlantilla
                    label="Ingresa el numero"
                    ident="numeroImPar"
                    inputtype="number"
                    entero
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                />
                <BotonDefault btnormal={false} disabled={cargando || valor === ""} tipo="submit" nombre={cargando ? "Haciendo tabla..." : "Hacer tabla"} />
            </form>

            {error && <p className="text-red-600">{error}</p>}

            <div className="historial-resultados">
                {historial.length === 0 && <p className="opacity-50">Aún no hay consultas.</p>}
                {historial.length > 0 &&
                    <div className="contenedor-iterable-histrial">
                        {historial.map((item) => (
                            <div className="tabla-de-multiplicar" key={item.id}>
                                <CapsulaMultiplicadora numero={item.numero} />
                                <BotonDefault className="boton-eliminar-item" onClick={() => (eliminarTabla(item.id))} nombre="Eliminar" />
                            </div>
                        ))}
                    </div>}
            </div>
        </>

    )
}