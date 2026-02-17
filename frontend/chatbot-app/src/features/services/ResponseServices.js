import api from "./api";

export const fetchAllResponse = async()=>{
    try {
        const res = await api.get('/response')
        return res.data.data
    } catch (error) {
        console.log(`error : ${error}`)        
    }
}

export const fetchResponById = async(id)=>{
    try {
        const res = await api.get(`/response/${id}`)
        return res.data.data
    } catch (error) {
        console.log(`error : ${error}`)
    }
}

export const createResponse = async(data)=>{
    try {
        const res = await api.post('/response', data)
        return res.data.data
    } catch (error) {
        console.log(`error : ${error}`)
    }
}

export const updateResponse = async(data,id)=>{
    try {
        const res = await api.put(`/response/${id}`, data)
        return res.data.data
    } catch (error) {
        console.log(`error : ${error}`)
    }
}

export const deleteResponse = async(id)=>{
    try {
        const res = await api.delete(`/response/${id}`)
        return res.data.data
    } catch (error) {
        console.log(`error : ${error}`)
    }
}
export const uploadResponse = async(file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);  
        const res = await api.post('/response/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return res.data;
    } catch (error) {
        console.log(`error : ${error}`)
        return error.response ? error.response.data : {message: error.message};
    }
}

