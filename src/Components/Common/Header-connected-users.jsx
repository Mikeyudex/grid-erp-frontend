"use client"

import { ConnectedUsers } from "../../Components/Common/Connected-users"
import { URL_BASE_WEBSOCKET } from "../../helpers/url_helper"

export function HeaderConnectedUsers({
    websocketUrl = `${URL_BASE_WEBSOCKET}`,
    className = "",
    currentUserId,
}) {
    return (
        <div className={`d-flex align-items-center ${className}`}>
            <ConnectedUsers
                websocketUrl={websocketUrl}
                maxVisibleAvatars={5}
                showConnectionStatus={false}
                currentUserId={currentUserId}
            />
        </div>
    )
}