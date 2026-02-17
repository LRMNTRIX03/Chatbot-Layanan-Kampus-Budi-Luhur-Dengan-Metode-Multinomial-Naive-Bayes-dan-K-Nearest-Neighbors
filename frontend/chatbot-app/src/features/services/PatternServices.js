import api from "./api"

export const fetchPattern = async()=>{
    try {
        const res = await api.get("/pattern")
        return res.data.data
    } catch (error) {
        console.log(`Error : ${error}`)
    }
}

export const fetchPatternById = async(id)=>{
    try {
        const res = await api.get(`/pattern/${id}`)
        return res.data.data
    } catch (error) {
        console.log(`Error : ${error}`)
    }
}

export const createPattern = async(data)=>{
    try {
        const res = await api.post("/pattern", data)
        return res.data.data
    } catch (error) {
        console.log(`Error : ${error}`)
        
    }
}

export const updatePattern = async(data,id)=>{
    try {
        const res = await api.put(`/pattern/${id}`, data)
        return res.data.data
    } catch (error) {
        console.log(`Error : ${error}`)
        
    }
}

export const deletePattern = async(id)=>{
    try {
        const res = await api.delete(`/pattern/${id}`)
        return res.data.data
    } catch (error) {
        console.log(`Error : ${error}`)
    }
}

export const uploadPattern = async(file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post("/pattern/upload", formData, {
            headers:{
                'Content-Type' : 'multipart/form-data'
            }
        })
        return res.data;
    } catch (error) {
        console.log(`error : ${error}`)
        return error.response ? error.response.data : {message: error.message};
    }
}