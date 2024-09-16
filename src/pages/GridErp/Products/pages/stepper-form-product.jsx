import { useEffect, useState } from "react"



export function StepperFormProduct({ steps, progress }) {

    const [btnsClassname, setBtnsClassname] = useState(
        [
            { btn: 1, style: 'btn-primary' },
            { btn: 2, style: 'btn-light' },
            { btn: 3, style: 'btn-light' }
        ]
    );

    useEffect(() => {
        let _btns = [];
        switch (progress) {
            case '0%':
                _btns = [
                    { btn: 1, style: 'btn-primary' },
                    { btn: 2, style: 'btn-light' },
                    { btn: 3, style: 'btn-light' }
                ]
                setBtnsClassname(_btns);
                break;
            case '50%':
                _btns = [
                    { btn: 1, style: 'btn-primary' },
                    { btn: 2, style: 'btn-primary' },
                    { btn: 3, style: 'btn-light' }
                ]
                setBtnsClassname(_btns);
                break;
            case '100%':
                _btns = [
                    { btn: 1, style: 'btn-primary' },
                    { btn: 2, style: 'btn-primary' },
                    { btn: 3, style: 'btn-primary' }
                ]
                setBtnsClassname(_btns);
                break;
            default:
                _btns = [
                    { btn: 1, style: 'btn-primary' },
                    { btn: 2, style: 'btn-primary' },
                    { btn: 3, style: 'btn-primary' }
                ]
                setBtnsClassname(_btns);
                break;
        }
    }, [progress]);

    return (
        <div className="position-relative m-4 pb-2">
            <div className="progress" style={{ height: "1px" }}>
                <div className="progress-bar" role="progressbar" style={{ width: progress }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>

            {
                steps && steps.map((step, idx) => {
                    return (<button
                        key={idx}
                        type="button"
                        className={
                            step.index === 1 ? "position-absolute top-0 start-0 translate-middle btn btn-sm rounded-pill " + btnsClassname[idx].style :
                                step.index === 2 ? "position-absolute top-0 start-50 translate-middle btn btn-sm rounded-pill " + btnsClassname[idx].style  :
                                    step.index === 3 ? "position-absolute top-0 start-100 translate-middle btn btn-sm  rounded-pill " + btnsClassname[idx].style  :
                                        "position-absolute top-0 start-100 translate-middle btn btn-sm rounded-pill " + btnsClassname[idx].style 
                        }
                        style={{ width: '2rem', height: '2rem' }}>{step?.index}</button>)
                })
            }
        </div>
    )
}