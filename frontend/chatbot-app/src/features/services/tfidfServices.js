import api from "./api"

export const hitung_tfIdf = async()=>{
try {
    const res = await api.post("/tfidf/compute")
    return res.data
} catch (error) {
    return error
}
}
export const get_tfIdf = async()=>{
    try {
        const res = await api.get("/tfidf/statistics")
        return res.data
    } catch (error) {
        return error
    }

}