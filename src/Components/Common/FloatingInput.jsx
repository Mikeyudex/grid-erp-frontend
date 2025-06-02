// Componente FloatingInput reutilizable
export function FloatingInput({
    id,
    type = "text",
    value,
    onChange,
    label,
    required = false,
    disabled = false,
    as = "input",
    rows = 3,
    name
}) {
    return (
        <div className="floating-input-container">
        {as === "textarea" ? (
            <textarea
                name={name}
                id={id}
                className={`floating-input ${value ? "has-value" : ""}`}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                rows={rows}
            />
        ) : (
            <input
                type={type}
                id={id}
                name={name}
                className={`floating-input ${value ? "has-value" : ""}`}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
            />
        )}
        <label htmlFor={id} className="floating-label">
            {label} {required && <span className="text-danger">*</span>}
        </label>
    </div>
    )
}