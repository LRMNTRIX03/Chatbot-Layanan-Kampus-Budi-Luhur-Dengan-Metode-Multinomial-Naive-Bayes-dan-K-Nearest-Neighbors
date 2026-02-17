import { useState, useEffect } from "react";
import {
    getAll,
    getById,
    updateSlangword,
    addSlangword,
    deleteSlangword
}
from "../services/SlagwordsServices";

export const useSlagwords = () => {
    const [slangwords, setSlangwords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(()=>{
        fetchSlangwords();
    },[])

    const fetchSlangwords = async()=>{
        try {
            setLoading(true);
            const res = await getAll();
            console.log("Fetched slangwords:", res);
            setSlangwords(res || []);
        } catch (error) {
            setMessage("Gagal mengambil data")
            console.log(`error : ${error}`)
        }
        finally{
            setLoading(false);
        }
    }
    const getSlangwordById = async(id)=>{
        try {
            const res = await getById(id);
            return res
        } catch (error) {
            setMessage("Gagal mengambil data")
            console.log(`error : ${error}`)
        }
    }
    const createSlangword = async(data)=>{
        try {
            setLoading(true);
            const res = await addSlangword(data)
            setSlangwords((prev)=>[...prev, res]);
            return res
        } catch (error) {
            console.log(`error : ${error}`)
        }
        finally{
            setLoading(false);
        }
    }
    const editSlangword = async(data,id)=>{
        try {
            setLoading(true);
            const res = await updateSlangword(data,id)
           setSlangwords((prev) =>
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
    const removeSlangword = async(id)=>{
        try {
            setLoading(true);
            const res = await deleteSlangword(id)
            setSlangwords((prev)=>prev.filter((item)=>item.id !== id));
            return res
        } catch (error) {
            console.log(`error : ${error}`)
        }
        finally{
            setLoading(false);
        }
    }
    return{
        slangwords,
        loading,
        message,
        fetchSlangwords,
        getSlangwordById,
        createSlangword,
        editSlangword,
        removeSlangword
    }
}

export default useSlagwords;