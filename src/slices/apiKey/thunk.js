import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAPIKey = createAsyncThunk("apiKey/getAPIKey", async () => {
    try {
        const response = {}
        return response;
    } catch (error) {
        return error;
    }
});

