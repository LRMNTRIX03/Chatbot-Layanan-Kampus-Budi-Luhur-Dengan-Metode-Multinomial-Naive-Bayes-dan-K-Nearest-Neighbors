import api from "./api"

export const trainingProses = async(rasio)=>{
    try {
        const res = await api.post("/training", {rasio});
        return res.data;
    } catch (error) {
        console.error("Error during training process:", error);
        return error.response.data;
    }
}

export const trainingKNN = async(rasio, kVal)=>{
    try {
        console.log(rasio, kVal)
        const res = await api.post("/training/knn", {rasio, k_val:kVal});
        return res.data;
    } catch (error) {
        console.error("Error during training process:", error);
        return error.response.data;
    }
}

export const predictNB = async(message)=>{
    try {
        const res = await api.post("/training/predict", {text:message});
        return res.data;
    } catch (error) {
        console.error("Error during prediction process:", error);
        return error.response.data;
    }
}

export const predictKNN = async(message)=>{
    try {
        const res = await api.post("/training/knn/predict", {text:message});
        return res.data;
    } catch (error) {
        console.error("Error during prediction process:", error);
        return error.response.data;
    }
}
