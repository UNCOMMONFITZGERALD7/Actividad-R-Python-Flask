import { useState, useEffect } from "react";
import { InputPlantilla } from "../inputs/InputPlantilla";
import { BotonDefault } from "../botones/BotonDefault";
import { API } from "../../config/config";
import DecryptedText from "../titulos/Menciones";

const esperar = (ms) => new Promise((resultado) => setTimeout(resultado, ms));


export function AdivinarNumero({ cargando, setCargando }) {
    const [numero, setNumero] = useState(null);
    const [valor, setValor] = useState("");
    const [error, setError] = useState(null);
    const [aviso, setAviso] = useState(null);

    const esperar = (ms) => new Promise((resultado) => setTimeout(resultado, ms));

    useEffect(() => {
        const inicializarNumero = async () => {
            try {
                const respuesta = await fetch(API + '/api/numerorandom');
                if (!respuesta.ok) {
                    throw new Error('El registro ya existe o hubo un error');
                }

                const datos = await respuesta.json();
                setNumero(datos.numero)
                console.log(datos.numero);
            } catch (err) {
                console.log("Error al inicializar:", err.message);
                setError(err.message);
            }
        };

        inicializarNumero();
    }, []);

    const actualizarNumero = async () => {
        setCargando(true);
        setError(null);
        setAviso(null);
        setValor("");

        try {
            await esperar(1000)
            const respuesta = await fetch(API + '/api/numerorandom', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!respuesta.ok) {
                throw new Error('Error al actualizar el número');
            }

            const datos = await respuesta.json();
            await esperar(1200);
            setNumero(datos.numero);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    async function evaluarResultado(val) {
        setAviso(null)
        setCargando(true)

        
        try {
            await esperar(1600)
            if (Number(val) === numero) {
                setAviso(true)
            } else {
                setValor("")
                setAviso(false)
            }
        } finally {
            setCargando(false)
        }

    }

    return (
        <>
            <div className="contenedortitulo">
                <DecryptedText
                    text={numero === null ? 'Generando numero...' : '¡Juego del numero secreto!'}
                    speed={50}
                    maxIterations={10}
                    characters="abcdefghijklmopqrstuvwxyz+-%&$#!.,234!?"
                    className="revealed texto-subtitulos"
                    parentClassName="all-letters"
                    encryptedClassName="encrypted texto-subtitulos"
                />
            </div>
            <p className="opacity-70">Adivina el numero entre el 1 al 10. ¡Buena suerte!</p>
            {error && <p className="text-red-600">{error}</p>}
            <p className={aviso ? 'my-4 opacity-85 text-green-500' : 'my-2 opacity-85 text-gray-800'}>
                {aviso ? `¡Ganaste! el numero es ${numero}` : aviso === null ? '¡ADIVINA!' : 'Sigue intentando.'}
            </p>
            <InputPlantilla label="Ingresa el numero" ident="guessnumero" inputtype="number" entero value={valor} onChange={(e) => setValor(e.target.value)} />
            <div className="bt-conjunto">
                <BotonDefault
                    nombre={cargando ? "Evaluando..." : "Evaluar"}
                    disabled={cargando || valor === "" || numero === null}
                    className="btn-adivinar-enviar"
                    onClick={() => evaluarResultado(valor)}
                />

                <BotonDefault
                    nombre="Reiniciar Valor"
                    className="btn-adivinar-reset"
                    disabled={cargando}
                    onClick={actualizarNumero}
                />
            </div>
        </>
    )

}