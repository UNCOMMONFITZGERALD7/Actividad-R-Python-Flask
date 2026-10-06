import { useState, useEffect } from "react";
import { InputPlantilla } from "../inputs/InputPlantilla";
import { BotonDefault } from "../botones/BotonDefault";
import { API } from "../../config/config";
import DecryptedText from "../titulos/Menciones";


export function PareImpar({ setCargando, cargando }) {
    const [valor, setValor] = useState("");
    const [historial, setHistorial] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        async function cargarHistorial() {
            try {
                const respuesta = await fetch(API + "/api/paridad")
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


    async function manejarFormulario(e) {
        e.preventDefault();
        if (valor === "") return;

        setCargando(true);
        setError(null);
        const esperar = (ms) => new Promise((resultado) => setTimeout(resultado, ms));
        try {
            const respuesta = await fetch(API + "/api/paridad", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numero: Number(valor) })
            })

            if (!respuesta.ok) {
                const cuerpo = await respuesta.json().catch(() => ({}))
                throw new Error(cuerpo.error ?? `Error de servicio (${respuesta.status})`)
            }

            const datos = await respuesta.json()
            await esperar(3000)
            setHistorial((prev) => [
                datos,
                ...prev,
            ]);

            setValor("");
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
    async function eliminarDato(ide) {

        setCargando(true);
        setError(null);
        const esperar = (ms) => new Promise((resultado) => setTimeout(resultado, ms));
        try {
            const respuesta = await fetch(API + `/api/paridad`, {
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

    return (
        <>
            <div className="contenedortitulo">
                <DecryptedText
                    text={valor != "" ? 'Verificando Numero' : 'Verificar Paridad de Numero'}
                    speed={30}
                    maxIterations={10}
                    characters="abcdefghijklmopqrstuvwxyz+-%&$#!.,234!?"
                    className="revealed texto-subtitulos"
                    parentClassName="all-letters"
                    encryptedClassName="encrypted texto-subtitulos"
                />
            </div>
            <form className="formulario-default" onSubmit={manejarFormulario}>
                <InputPlantilla
                    label="Ingresa el numero"
                    ident="numeroImPar"
                    inputtype="number"
                    entero
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                />
                <BotonDefault btnormal={false} disabled={cargando || valor === ""} tipo="submit" nombre={cargando ? "Verificando..." : "Verificar"} />
            </form>

            {error && <p className="text-red-600 mx-2">{error}</p>}

            <div className="historial-resultados">
                {historial.length === 0 && <p className="opacity-50">Aún no hay consultas.</p>}
                {historial.length > 0 && <ul className="contenedor-iterable-histrial">
                    {historial.map((item) => (
                        <li key={item.id}>
                            {item.numero} es {item.resultado ? 'par' : 'impar'}
                            <BotonDefault className="boton-eliminar-item" onClick={() => (eliminarDato(item.id))} nombre="&times;" />
                        </li>
                    ))}
                </ul>}
            </div>
        </>
    )
}