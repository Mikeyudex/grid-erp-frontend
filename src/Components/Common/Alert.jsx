
import React, { useState } from 'react';
import { Alert } from 'reactstrap';

function AlertCustom({ isOpen, messsageAlert, typeAlert }) {
    const [visible, setVisible] = useState(isOpen);

    const onDismiss = () => setVisible(false);

    const handleDismiss = () => {
        setTimeout(() => {
            setVisible(false);
        }, 4000);
    };

    handleDismiss();

    return (
        <div className='p-2 mt-1 position-fixed top-0 start-50 translate-middle-x z-50'>
            <Alert
                color={typeAlert}
                isOpen={visible}
                toggle={onDismiss}
            >
                {messsageAlert ?? "Alerta"}
            </Alert>
        </div>

    );
}

export default AlertCustom;