// Página de acceso no autorizado
export const UnauthorizedPage = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="text-center">
            <h1 className="display-1 fw-bold">403</h1>
            <p className="fs-3">
                <span className="text-danger">Oops!</span> Acceso no autorizado.
            </p>
            <p className="lead">No tienes permisos para acceder a este recurso.</p>
            <a href="/home" className="btn btn-primary">Ir al inicio</a>
        </div>
    </div>
);
