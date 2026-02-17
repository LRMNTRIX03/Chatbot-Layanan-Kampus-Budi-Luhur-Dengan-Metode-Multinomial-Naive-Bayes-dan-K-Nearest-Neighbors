
import { useState, useEffect } from "react";
import { fetchPattern, 
    fetchPatternById, 
    createPattern, 
    updatePattern, 
    deletePattern,
    uploadPattern
 } from "../services/PatternServices";

const usePattern = () =>{
    const [patterns, setPatterns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(()=>{
        getAllPatterns();
    }, [])

    const getAllPatterns = async()=>{
        try {
            setLoading(true);
            const res = await fetchPattern();
            setPatterns(res || []);
        } catch (error) {
            setMessage("Gagal mengambil data")
            console.log(`error : ${error}`)
        }
        finally{
            setLoading(false);
        }
    }

    const getPatternById = async(id)=>{
        try {
            const res = await fetchPatternById(id);
            return res
        } catch (error) {
            setMessage("Gagal mengambil data")
            console.log(`error : ${error}`)
        }
    }

    const addPattern = async(data)=>{
        try {
            setLoading(true);
            const res = await createPattern(data)
            setPatterns((prev)=>[...prev, res]);
            return res
        } catch (error) {
            console.log(`error : ${error}`)
        }
        finally{
            setLoading(false);
        }
    }
    const editPattern = async(data,id)=>{
        try {
            setLoading(true);
            const res = await updatePattern(data,id)
           setPatterns((prev) =>
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
    const removePattern = async(id)=>{
        try {
            setLoading(true);
            const res = await deletePattern(id)
            setPatterns((prev)=>prev.filter((item)=>item.id !== id));
            return res
        } catch (error) {
            console.log(`error : ${error}`)
        }
        finally{
            setLoading(false);
        }
    }
    const createFromFilePattern = async(file) => {
        try {
            setLoading(true);
            const res = await uploadPattern(file);
            await getAllPatterns();
            return res;
        } catch (error) {
            console.log(`error : ${error}`)
            setMessage(`Gagal mengupload file: ${error.message || error}`)
        }
        finally{
            setLoading(false);
        }
    }
    return{
        patterns,
        loading,
        message,
        getAllPatterns,
        getPatternById,
        addPattern,
        editPattern,
        removePattern,
        createFromFilePattern
    }

}

export default usePattern