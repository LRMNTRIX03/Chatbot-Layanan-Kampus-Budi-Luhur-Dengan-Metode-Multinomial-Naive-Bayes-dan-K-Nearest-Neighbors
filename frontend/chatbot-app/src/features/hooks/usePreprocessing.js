import { useState, useEffect } from "react";
import { preprocessing, fetchPreprocessing } from "../services/PreprocessingServices";



const usePre = ()=>{

const [loading,setLoading] = useState(false);
const [message,setMessage] = useState({
    message:"",
    success:false
})

useEffect(()=>{

},[])

const prosesPreprocessing = async()=>{
    try {
        setLoading(true);
        const res = await preprocessing();
        setMessage({
            message:res.message ? res.message : "Preprocessing berhasil dilakukan",
            success:true
        });
        console.log(res)
        return res
    } catch (error) {
        console.log(`error : ${error}`)
        return error
    }
    finally{
        setLoading(false);
    }

}

const fetchPreprocessingData = async()=>{
    try {
        setLoading(true);
        const res = await fetchPreprocessing();
        setMessage({
            message:res.message ? res.message : "Preprocessing berhasil dilakukan",
            success:true
        });
        console.log(res)
        return res
    } catch (error) {
        console.log(`error : ${error}`)
        return error
    }
    finally{
        setLoading(false);
    }
}
return{
    loading,
    message,
    prosesPreprocessing,
    fetchPreprocessingData
}
}


export default usePre