import api from "./api"

export const fetchStopword = async()=>{
    try {
        const res = await api.get("/stopword")
        return res.data.data
    } catch (error) {
        console.log(`Error : ${error}`)
    }
}

export const fetchStopwordById = async(id)=>{
    try {
        const res = await api.get(`/stopword/${id}`)
        return res.data.data
    } catch (error) {
        console.log(`Error : ${error}`)
    }
}

export const createStopword = async(data)=>{
    try {
        const res = await api.post("/stopword", data)
        return res.data.data
    } catch (error) {
        console.log(`Error : ${error}`)
        
    }
}

export const updateStopword = async(data,id)=>{
    try {
        const res = await api.put(`/stopword/${id}`, data)
        return res.data.data
    } catch (error) {
        console.log(`Error : ${error}`)
        
    }
}

export const deleteStopword = async(id)=>{
    try {
        const res = await api.delete(`/stopword/${id}`)
        return res.data.data
    } catch (error) {
        console.log(`Error : ${error}`)
    }
}
