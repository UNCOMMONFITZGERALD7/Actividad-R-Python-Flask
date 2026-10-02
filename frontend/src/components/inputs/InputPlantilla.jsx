function getUnableCharsInput(inputtype, entero = false) {
    switch (inputtype) {
        case 'number':
            return entero
                ? ['e', 'E', '+', '-', '.', ',']
                : ['e', 'E', '+', '-']
        case 'email':
            return [' ', ',', ';', ':', '(', ')', '<', '>', '"', "'", '\\']
        case 'url':
            return [' ', '"', "'", '<', '>', '\\']
        case 'text':
            return ['<', '>', '\\', '`']
        default:
            return []
    }
}

export function InputPlantilla({ label, ident, inputtype = "text", autocomp = false, entero = false, placeholder = " ", value, onChange }) {
    const unableCharsInput = getUnableCharsInput(inputtype, entero)

    return (
        <div>
            <div className="flex items-center justify-center">
                <div className="relative">
                    <input
                        onKeyDown={(e) => unableCharsInput.includes(e.key) && e.preventDefault()}
                        id={ident}
                        name={ident}
                        type={inputtype}
                        value={value}
                        onChange={onChange}
                        autoComplete={autocomp ? "on" : "off"}
                        placeholder={placeholder}
                        className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-yellow-600 transition-colors focus:outline-none peer bg-inherit"
                    />
                    <label
                        htmlFor={ident}
                        className="opacity-40 absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-orange-400 peer-focus:opacity-100 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm"
                    >
                        {label}
                    </label>
                </div>
            </div>
        </div>
    )
}