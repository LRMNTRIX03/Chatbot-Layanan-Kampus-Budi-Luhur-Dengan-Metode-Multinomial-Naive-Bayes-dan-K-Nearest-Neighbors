import api from "./api";

export const preprocessing = async()=>{
    try {
        const res = await api.post("/pre")
        return res.data
    } catch (error) {
        console.log(`error : ${error}`)
        return error
    }
}

export const fetchPreprocessing = async()=>{
    try {
        const res = await api.get("/pre")
        return res.data.data
    } catch (error) {
        console.log(`error : ${error}`)
        return error
        
    }
}