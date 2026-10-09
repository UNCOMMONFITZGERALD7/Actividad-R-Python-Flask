import { useState } from "react";
import { BotonTarea } from "./botones/BotonTarea";
import { PareImpar } from "./contenedores/ParIempar";
import { Cargando } from "./modales/Cargando";
import { TablasMultiplicar } from "./contenedores/TablasMultiplicar";
import { AdivinarNumero } from "./contenedores/AdivinarNumero";
import DecryptedText from "./titulos/Menciones";
import Promesas from "./ejemplificaciones/Promesas";

function GeneradorTarea({ dato, setCargando, cargando }) {
    switch (dato) {
        case 'primero':
            return <PareImpar cargando={cargando} setCargando={setCargando} />
        case 'segundo':
            return <TablasMultiplicar cargando={cargando} setCargando={setCargando} />
        case 'tercero':
            return <AdivinarNumero cargando={cargando} setCargando={setCargando} />
        default:
            return (
                <div className="contenedortitulo">
                    <DecryptedText
                        text="¡Elije una tarea!"
                        speed={50}
                        maxIterations={10}
                        characters="abcdefghijklmopqrstuvwxyz+-%&$#!.,234!?"
                        className="revealed texto-subtitulos"
                        parentClassName="all-letters"
                        encryptedClassName="encrypted texto-subtitulos"
                    />
                </div>
            )
    }
}

export function Contenedor() {
    const [tarea, setTarea] = useState('')
    const [cargando, setCargando] = useState(false)
    const switchTarea = (valor) => (
        setTarea(valor)
    )

    return (
        <div className="contenedor-padre">
            <div className="contenedor-principal">
                <BotonTarea onClick={() => switchTarea('primero')} nombre={"num_par_impar"} />
                <BotonTarea onClick={() => switchTarea('segundo')} nombre={"tablas_multiplicar"} />
                <BotonTarea onClick={() => switchTarea('tercero')} nombre={"adivinar_numero"} />
            </div>
            <section className="contenedor-secundario">
                <GeneradorTarea dato={tarea} setCargando={setCargando} cargando={cargando} />
                <Promesas />
                <Cargando estado={cargando} />
            </section>
        </div>
    )
}