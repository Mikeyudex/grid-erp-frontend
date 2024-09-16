import React from "react";
import { handleValidDate, handleValidTime } from "../helper/product_helper";


export const FormatDate = (cell) => {
  return (
    <React.Fragment>
        <h6>{handleValidDate(cell.getValue())} {handleValidTime(cell.getValue())}</h6>
    </React.Fragment>
  );
};