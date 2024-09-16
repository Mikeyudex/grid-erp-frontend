import { Button, Spinner } from "reactstrap";



export function BtnLoader({
    isLoader,
    title,
    type,
    onClick,
    color
}) {


    return (
        <Button onClick={onClick} type={type} color={color} className="btn-load" outline>
            <span className="d-flex align-items-center">
                {
                    isLoader && (
                        <Spinner size="sm" className="flex-shrink-0"> Loading... </Spinner>
                    )
                }
                <span className="flex-grow-1 ms-2">
                    {title}
                </span>
            </span>
        </Button>
    )
}