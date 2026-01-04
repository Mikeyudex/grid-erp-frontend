import { BASE_URL } from "../../../../helpers/url_helper";

export const BASE_URL_API = BASE_URL;
export const companyId = "66becedd790bddbc9b1e2cbc";


export const SIGN_IN = BASE_URL_API + '/auth/login';
export const SIGN_UP = BASE_URL_API + '/users/create';
export const GET_RESORCES_BY_ROLE = BASE_URL_API + '/role-user/get-resources-by-role';
export const GENERATE_QR_OTP = BASE_URL_API + '/users/generateQrCode';
export const REQUEST_PASSWORD_RESET = BASE_URL_API + '/users/request-password-reset';
export const GET_ZONES = BASE_URL_API + '/users/zones/getAll';
export const GET_ZONE_BY_ID = BASE_URL_API + '/users/zones/getById';
export const VERIFY_OTP = BASE_URL_API + '/users/verifyOtp';