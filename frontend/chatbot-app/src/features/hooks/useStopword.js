
import { useState, useEffect } from "react";
import { fetchStopword,
    fetchStopwordById,
    createStopword,
    updateStopword,
    deleteStopword
 } from "../services/StopwordsService";

const useStopword = () =>{
    const [Stopword, setStopword] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(()=>{
        getAllStopword();
    }, [])

    const getAllStopword = async()=>{
        try {
            setLoading(true);
            const res = await fetchStopword();
            setStopword(res || []);
        } catch (error) {
            setMessage("Gagal mengambil data")
            console.log(`error : ${error}`)
        }
        finally{
            setLoading(false);
        }
    }

    const getStopwordById = async(id)=>{
        try {
            const res = await fetchStopwordById(id);
            return res
        } catch (error) {
            setMessage("Gagal mengambil data")
            console.log(`error : ${error}`)
        }
    }

    const addStopword = async(data)=>{
        try {
            setLoading(true);
            const res = await createStopword(data)
            setStopword((prev)=>[...prev, res]);
            return res
        } catch (error) {
            console.log(`error : ${error}`)
        }
        finally{
            setLoading(false);
        }
    }
    const editStopword = async(data,id)=>{
        try {
            setLoading(true);
            const res = await updateStopword(data,id)
           setStopword((prev) =>
  prev.map((item) => (item.id === id ? { ...item, ...res } : item))
);

            return res
        } catch (error) {
            console.log(`error : ${error}`)
            
        }
        finally{
            setLoading(false);
        }
    }
    const removeStopword = async(id)=>{
        try {
            setLoading(true);
            const res = await deleteStopword(id)
            setStopword((prev)=>prev.filter((item)=>item.id !== id));
            return res
        } catch (error) {
            console.log(`error : ${error}`)
        }
        finally{
            setLoading(false);
        }
    }

    return{
        Stopword,
        loading,
        message,
        getAllStopword,
        getStopwordById,
        addStopword,
        editStopword,
        removeStopword,
    }

}

export default useStopword