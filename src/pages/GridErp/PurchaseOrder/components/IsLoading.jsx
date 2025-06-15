

export default function IsLoading({
    loading,
    title,
}) {
    return (
        <>
            {
                loading && (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3">{title}</p>
                    </div>
                )
            }
        </>
    )
}