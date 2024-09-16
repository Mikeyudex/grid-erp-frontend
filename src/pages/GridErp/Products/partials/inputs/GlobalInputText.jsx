

export default function GlobalInputText({
    value,
    onChange,
    placeholder,
    name,
    type,
    className,
    id,
    required,
    disabled
}) {

    return (
        <>
            <input
                name={name}
                className={className}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                id={id}
                required={required}
                disabled={disabled}
            />
            <span className="underline"></span>
        </>
    )

}