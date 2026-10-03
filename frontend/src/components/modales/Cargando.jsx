import { useEffect, useRef } from "react"

export function Cargando({ estado }) {
    const dialogRef = useRef(null)

    useEffect(() => {
        const dialog = dialogRef.current
        if (estado && !dialog.open) dialog.showModal()
        if (!estado && dialog.open) dialog.close()
    }, [estado])

    return (
        <dialog
            ref={dialogRef}
            onCancel={(e) => e.preventDefault()}
            id="modalCargando"
            className="fixed inset-0 m-auto bg-transparent border-none p-0 outline-none overflow-hidden max-w-none max-h-none flex items-center justify-center backdrop:bg-black/50 backdrop:backdrop-blur-sm"
        >
            {
            estado && <div className="flex items-center justify-center w-32 h-32">
                <div className="honeycomb">
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                </div>
            </div>
            }
        </dialog>
    )
}