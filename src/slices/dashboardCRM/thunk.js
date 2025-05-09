import { createAsyncThunk } from "@reduxjs/toolkit";
//Include Both Helper File with needed methods


export const getBalanceChartsData = createAsyncThunk("dashboardCrm/getBalanceChartsData", async (data) => {
  try {
    var response;
    return response;
  } catch (error) {
    return error;
  }
});

export const getDialChartsData = createAsyncThunk("dashboardCrm/getDialChartsData", async (data) => {
  try {
    var response;
   
    return response;
  }
  catch (error) {
    return error;
  }
});

export const getSalesChartsData = createAsyncThunk("dashboardCrm/getSalesChartsData", async (data) => {
  try {
    var response;
    
    return response;
  }
  catch (error) {
    return response;
  }
});