import { IndexedDBService } from "./indexedDb/indexed-db-helper";

const indexedDBService = new IndexedDBService();

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validateEmailDomain = (email) => {
  const re = /^[a-zA-Z0-9._-]+@galilea.co$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  //Solo numeros
  const re = /^[0-9]+$/;
  return re.test(String(phone));
};

export const validatePassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&+=]).{6,}$/;
  return re.test(password);
}

export const isAdminValidate = async () => {
  let userId = localStorage.getItem("userId");
  if (userId) {
    let user = await indexedDBService.getItemById(userId);
    if (user?.role?.name === "root" || user?.role?.name === "admin") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export const validateOtp = (otp) => {
  const re = /^[0-9]{6}$/;
  return re.test(otp);
}