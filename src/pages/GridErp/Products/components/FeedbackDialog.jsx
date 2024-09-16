



export function FeedbackDialog({hassuccess, body, icon}) {

    return (
        <>
            <div className="text-center">
                <div className="avatar-md mt-5 mb-4 mx-auto">
                    <div className={`avatar-title bg-light display-4 rounded-circle ${hassuccess ? 'text-success' : 'text-danger'}`}>
                        {icon}
                    </div>
                </div>
                {body}
            </div>
        </>
    )
}