import { APIClient } from "../../../../helpers/api_helper";
import * as url from "./url_helper";
import moment from "moment";
import 'moment/locale/es';

moment.locale('es');

const api = new APIClient();

export class StockHelper {

  //getRecentAdjustmentStock
  getRecentAdjustmentStock = (page, limit) => api.get(`${url.GET_RECENT_ADJUSTMENT}`, {page, limit});

}

export const optionsSnackbarDanger = {
  position: 'bottom-left',
  style: {
    backgroundColor: '#ffece3',
    border: '2px solid #de6c37',
    color: '#de6c37',
    fontFamily: 'Menlo, monospace',
    fontSize: '1.2em',
    textAlign: 'center',
  },
  closeStyle: {
    color: '#de6c37',
    fontSize: '16px',
  },
};

export const optionsSnackbarSuccess = {
  position: 'bottom-left',
  style: {
    backgroundColor: '#dbf8f4',
    border: '2px solid #0eb6b6',
    color: '#0eb6b6',
    fontFamily: 'Menlo, monospace',
    fontSize: '1.2em',
    textAlign: 'center',
  },
  closeStyle: {
    color: '#0eb6b6',
    fontSize: '16px',
  },
};

export const numberFormatPrice = (value = "") => {
  if(typeof value !== 'string') {
    String(value)
  }
  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  let operator = USDollar.format(value).split(".")[0]

  return operator;
};



export const handleValidDate = (date) => {
  const date1 = moment(new Date(date)).format("DD MMM Y");
  return date1;
};

export const handleValidTime = (time) => {
  const time1 = new Date(time);
  const getHour = time1.getUTCHours();
  const getMin = time1.getUTCMinutes();
  const getTime = `${getHour}:${getMin}`;
  var meridiem = "";
  if (getHour >= 12) {
    meridiem = "PM";
  } else {
    meridiem = "AM";
  }
  const updateTime = moment(getTime, 'hh:mm').format('hh:mm') + " " + meridiem;
  return updateTime;
};