import { useState } from "react";
import useTFIDFStore from "../store/useTFIDF";
import { hitung_tfIdf, get_tfIdf } from "../services/tfidfServices";    

export const useStatistik = () => {
    const { statistics, setStatistics, computing, setComputing, loading, setLoading } = useTFIDFStore();
    const [error, setError] = useState(null);

const HitungTFIDF = async () => {
  setComputing(true);
  setError(null);

  try {
    const response = await hitung_tfIdf(); 
    console.log("📡 Response Axios:", response);

    console.log(" Data:", response);

    // Cek status sukses
    // if (response.status !== 200) {
    //   throw new Error(response.message || "Gagal menghitung TF-IDF");
    // }

    await fetchStatistics();

    alert(" TF-IDF berhasil dihitung!");
  } catch (err) {
    console.error(" Error details:", err);
    setError(err.message);
    alert(" Error: " + err.message);
  } finally {
    setComputing(false);
  }
};


const fetchStatistics = async () => {
  setLoading(true);
  setError(null);

  try {
    const data = await get_tfIdf();
    console.log(" GET Statistics:", data);

    setStatistics(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};



    return { statistics, computing, loading, fetchStatistics, HitungTFIDF, error };
}

export default useStatistik;