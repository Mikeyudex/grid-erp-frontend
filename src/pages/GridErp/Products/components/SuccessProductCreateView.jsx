import { Fragment } from "react";
import { BtnLoader } from "./BtnLoader";
import { useNavigate } from "react-router-dom";


export function SuccessProductCreateView() {
    const navigate = useNavigate();

    const handleReturnNewProduct = () => {
        return navigate('/products/create-tapete');
    }

    return (
        <Fragment>
            <div className="page-content">

                <div className="text-center">
                    <div className="avatar-md mt-5 mb-4 mx-auto">
                        <div className={`avatar-title display-4 rounded-circle text-success`} style={{backgroundColor:'#e8e8e8'}}>
                            <i className="ri-checkbox-circle-fill"></i>
                        </div>
                    </div>
                    <h5>Producto creado !</h5>
                    <p className="text-muted">
                        Deseas crear otro producto?
                    </p>
                    <BtnLoader
                        isLoader={false}
                        title={'Sí, otro más!'}
                        type={'button'}
                        onClick={handleReturnNewProduct}
                        color={'primary'}
                    />
                </div>
            </div>

        </Fragment>
    )
}