import { Input } from "reactstrap";


export default function InputSpin({
    setState,
    value,
    inputClassname,
    min,
    max,
    containerClass
}) {

    function countUP() {
        setState((value + 1));
    }

    function countDown() {
        setState((value - 1));
    }

    return (

        <div className={containerClass}
            style={{
                border: 'none',
                borderBottom: '2px solid #ccc',
                backgroundColor: 'transparent',
                padding: '10px 0',
                fontSize: '0.7em',
                height:'3.1em'
            }}>
            <button
                type="button"
                className="minus"
                onClick={countDown}
            >
                –
            </button>
            <Input
                type="number"
                className={`${inputClassname} product-quantity form-control`}
                value={value}
                min={min}
                max={max}
                readOnly
            />
            <button
                type="button"
                className="plus"
                onClick={countUP}
            >
                +
            </button>
        </div>
    )

}