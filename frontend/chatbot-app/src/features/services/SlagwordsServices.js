import api from "./api";

export const getAll = async() => {
try {
    const res = await api.get("/slangwords")
    return res.data.data
} catch (error) {
    return error
}
}

export const getById = async(id)=>{
    try {
        const res = await api.get(`/slangwords/${id}`)
        return res.data.data
    } catch (error) {
        return error
    }
}

export const updateSlangword = async(id, data)=>{
try {
    const res = await api.put(`/slangwords/${id}`, data)
    return res.data.data
} catch (error) {
    return error
}

}

export const addSlangword = async(data)=>{
    try {
        const res = await api.post("/slangwords", data)
        return res.data.data
    } catch (error) {
        return error
    }
}

export const deleteSlangword = async(id)=>{
    try {
        const res = await api.delete(`/slangwords/${id}`)
        return res.data.data
    } catch (error) {
        return error
    }
}