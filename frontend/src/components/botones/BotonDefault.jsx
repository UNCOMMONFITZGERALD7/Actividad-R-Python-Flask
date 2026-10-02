export function BotonDefault({ tipo = "button", nombre = "", className = "", btnormal = true, onClick, ...props }) {
    return (
        <button
            type={tipo}
            onClick={onClick}
            className={`${btnormal && 'boton-dxd '} transition-all bg-orange-500 text-white px-6 py-2 rounded-lg border-orange-600 border-b-[4px]
                enabled:cursor-pointer enabled:hover:brightness-110 enabled:hover:-translate-y-[1px] enabled:hover:border-b-[6px]
                enabled:active:border-b-[2px] enabled:active:brightness-90 enabled:active:translate-y-[2px]
                disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
        >
            {nombre}
        </button>
    )
}