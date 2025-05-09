import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAllData = createAsyncThunk("dashboardAnalytics/getAllData", async (data) => {
  try {
    var response;


    return response;
  } catch (error) {
    return error;
  }
});

export const getAudiencesMetricsChartsData = createAsyncThunk("dashboardAnalytics/getAudiencesMetricsChartsData", async (data) => {
  try {
    var response;

    

    return response;
  } catch (error) {
    return error;
  }
});

export const getUserDeviceChartsData = createAsyncThunk("dashboardAnalytics/getUserDeviceChartsData", async (data) => {
  try {
    var response;
    

    return response;
  } catch (error) {
    return error;
  }
});

export const getAudiencesSessionsChartsData = createAsyncThunk("dashboardAnalytics/getAudiencesSessionsChartsData", async (data) => {
  try {
    var response;
   
    return response;
  } catch (error) {
    return error;
  }
});