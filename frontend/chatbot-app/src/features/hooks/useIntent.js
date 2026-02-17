import {useState, useEffect} from "react";
import {fetchIntent, createIntent, deleteIntent, updateIntent, getIntent, uploadIntent} from "../services/IntentServices";
const useIntent = () =>{
    const [loading, setLoading] = useState(true);
    const [intents, setIntents] = useState([]);
    const [error, setError] = useState("");

    useEffect(()=>{
        getAllIntents();
    }, [])

    const getAllIntents = async()=>{
        try {
            setLoading(true);
            const res = await fetchIntent()
            setIntents(res || []);
        } catch (error) {
            setError("Gagal mengambil data")
            console.log(`error : ${error}`)
        }
        finally{
            setLoading(false);
        }
    }
    const getIntentById = async(id)=>{
        try {
            const res = await getIntent(id);
            return res
        } catch (error) {
            setError("Gagal mengambil data")
            console.log(`error : ${error}`)
        }
    }
    const addIntents = async(data)=>{
        try {
            setLoading(true);
            const res = await createIntent(data)
            setIntents((prev)=>[...prev, res]);
            return res;
        } catch (error) {
            setError("Gagal menambahkan data")
            console.log(`error : ${error}`)
        }
        finally{
            setLoading(false);
        }
    }
    const editIntents = async(id, data)=>{
        try {
            setLoading(true);
            const res = await updateIntent(data, id)
            setIntents((prev)=>prev.map((item)=>{
                item.id === id ? {...item, ...res} : item
            }))
            return res;
        } catch (error) {
            setError("Gagal mengedit data")
            console.log(`error : ${error}`)
        }
        finally{
            setLoading(false);
        }
    }
    const deleteIntents = async(id)=>{
        try {
            setLoading(true);
            const res = await deleteIntent(id)
            setIntents((prev)=>prev.filter((item)=>item.id !== id));
            return res;

        } catch (error) {
            console.log(`error : ${error}`)
            setError("Gagal menghapus data")
        }
        finally{
            setLoading(false);
        }
    }
    const createFromFileIntent = async(file) => {
        try {
            setLoading(true);
            const res = await uploadIntent(file);
            await getAllIntents();
            return res;
        } catch (error) {
            setError("Gagal mengupload data")
            console.log(`error : ${error}`)
        }
        finally{
            setLoading(false);
        }
    }
    
  return {
    intents,
    loading,
    error,
    getAllIntents,
    addIntents,
    editIntents,
    deleteIntents,
    getIntentById,
    createFromFileIntent
  };
};

export default useIntent
    

    
    

