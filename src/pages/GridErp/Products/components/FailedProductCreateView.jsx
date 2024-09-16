import { Fragment } from "react";
import { BtnLoader } from "./BtnLoader";


export function FailedProductCreateView() {

    return (
        <Fragment>
            <h5>Ocurrió un error al crear el producto !</h5>
            <p className="text-muted">
                Deseas modificar los datos del producto?
            </p>
        </Fragment>
    )
}