import api from "./api";

export const fetchIntent = async () =>{
    try {
        const res = await api.get("/intent")
        return res.data.data
        
    } catch (error) {
        console.log(`error : ${error}`)
    }
}

export const createIntent = async(data)=>{
    try {
        const res = await api.post("/intent", data)
        return res.data.data
    } catch (error) {
        console.log(`error : ${error}`)
    }
}

export const updateIntent = async(data, id)=>{
    try {
        const res = await api.put(`/intent/${id}`, data)
        return res.data.data
    } catch (error) {
        console.log(`error : ${error}`)
    }
}

export const deleteIntent = async(id)=>{
    try {
        const res = await api.delete(`/intent/${id}`)
        return res.data.data
    } catch (error) {
        console.log(`error : ${error}`)
    }
}

export const getIntent = async(id)=>{
    try {
        const res = await api.get(`/intent/${id}`)
        return res.data.data
    } catch (error) {
        console.log(`error : ${error}`)
    }
}

export const uploadIntent = async(file) => {
    try {
       const formData = new FormData();
         formData.append('file', file);
        const res = await api.post('/intent/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return res.data;
    } catch (error) {
        console.log(`error : ${error}`)
    }
}



