import api from "./api";

export const fetchRiwayat = async()=>{
    try {
        const res = await api.get('/riwayat');
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getDetailRiwayat = async(id)=>{
    try {
        const res = await api.get(`/riwayat/${id}`);
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}