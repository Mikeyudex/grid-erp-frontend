import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Dashboard Analytics
import DashboardAnalyticsReducer from "./dashboardAnalytics/reducer";

// Dashboard CRM
import DashboardCRMReducer from "./dashboardCRM/reducer";

// API Key
import APIKeyReducer from "./apiKey/reducer";


const rootReducer = combineReducers({
    Layout: LayoutReducer,
    DashboardAnalytics: DashboardAnalyticsReducer,
    DashboardCRM: DashboardCRMReducer,
    APIKey: APIKeyReducer
});

export default rootReducer;