import { useEffect, useState } from "react"
import {
    fetchAllResponse,
    fetchResponById,
    createResponse,
    updateResponse,
    deleteResponse,
    uploadResponse
} from "../services/ResponseServices"



const useResponse = () => {
    
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(()=>{
        getAllResponses();
    }, [])

    const getAllResponses = async()=>{
        try {
            setLoading(true);
            const res = await fetchAllResponse();
            setResponses(res || []);
        } catch (error) {
            console.log(`error : ${error}`)            
        }
        finally{
            setLoading(false);
        }
    }

    const addResponse = async(data)=>{
        try {
            setLoading(true);
            const res = await createResponse(data);
            setResponses((prev)=>[...prev, res]);
            return res;
        } catch (error) {
            console.log(`error : ${error}`)
            
        }
        finally{
            setLoading(false);
        }
    }
    const editResponse = async(data, id)=>{
        try {
            setLoading(true);
            const res = await updateResponse(data, id);
            setResponses((prev)=>prev.map((item)=>item.id === id? {...item, ...res} : item));
        } catch (error) {
            console.log(`error : ${error}`)
            
        }finally{
            setLoading(false);
        }
    }
    const removeResponse = async(id)=>{
        try {
            setLoading(true)
            const res = await deleteResponse(id);
            setResponses((prev)=>prev.filter((item)=>item.id !== id));
            return res;
        } catch (error) {
            console.log(`error : ${error}`)
        }
        finally{
            setLoading(false);
        }
    }
    const getByIdResponse = async(id)=>{
        try {
            setLoading(true);
            const res = await fetchResponById(id);
            return res
        } catch (error) {
            console.log("error : ", error)
        }
        finally{
            setLoading(false);
        }
    }
    const createFromFileResponse = async(file) => {
        try {
            setLoading(true);
            const res = await uploadResponse(file);
            await getAllResponses();
            return res;
        } catch (error) {
            console.log(`error : ${error}`)
            setMessage(`Gagal mengupload file: ${error.message || error}`)
        }
        finally{
            setLoading(false);
        }
    }
    return({
        responses,
        loading,
        message,
        addResponse,
        editResponse,
        removeResponse,
        getByIdResponse,
        getAllResponses,
        createFromFileResponse
    })
}


export default useResponse