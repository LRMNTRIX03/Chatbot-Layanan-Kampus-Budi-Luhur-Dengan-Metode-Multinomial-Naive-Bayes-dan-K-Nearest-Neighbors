import { useState, useEffect, useMemo } from "react";
import { getDetailRiwayat, fetchRiwayat } from "../services/RiwayatServices";

const useRiwayat = () => {
    const [riwayat, setRiwayat] = useState([]);
    const [detailRiwayat, setDetailRiwayat] = useState(null); // ✅ Ubah dari [] ke null
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // ✅ Tambahkan error state
    
    useEffect(() => {
        getRiwayat()
    }, [])

    
    useEffect(() => {
        if (detailRiwayat) {
            console.log("Detail Riwayat Updated:", detailRiwayat);
        }
    }, [detailRiwayat]);

    const getRiwayat = async() => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchRiwayat();
            setRiwayat(res);
        } catch (error) {
            console.error("Error fetching riwayat:", error);
            setError(error.message || "Gagal mengambil data riwayat");
        } finally {
            setLoading(false);
        }
    }

    const getDetail = async(id) => {
        try {
            setLoading(true);
            setError(null);
            const res = await getDetailRiwayat(id);
            
            console.log("Response dari API:", res); // ✅ Debug response
            
            // ✅ Pastikan data yang di-set sesuai struktur
            if (res && res.data) {
                setDetailRiwayat(res.data); // Jika response wrapped dalam { data: ... }
            } else {
                setDetailRiwayat(res); // Jika response langsung berisi data
            }
            
        } catch (error) {
            console.error("Error fetching detail:", error);
            setError(error.message || "Gagal mengambil detail riwayat");
            setDetailRiwayat(null); // ✅ Reset jika error
        } finally {
            setLoading(false);
        }
    }
    const parsedDetail = useMemo(() => {
    if (!detailRiwayat) return null;
    try {
      return {
        accuracy:
          typeof detailRiwayat.accuracy === "string"
            ? parseFloat(detailRiwayat.accuracy)
            : detailRiwayat.accuracy,
        avgPrecision: detailRiwayat.avgprecision,
        avgRecall: detailRiwayat.avgrecall,
        avgF1: detailRiwayat.avgf1score,
        classes:
          typeof detailRiwayat.classes === "string"
            ? JSON.parse(detailRiwayat.classes)
            : detailRiwayat.classes,
        confusionMatrix:
          typeof detailRiwayat.confussion_matrix === "string"
            ? JSON.parse(detailRiwayat.confussion_matrix)
            : detailRiwayat.confusion_matrix,
        precision:
          typeof detailRiwayat.precision === "string"
            ? JSON.parse(detailRiwayat.precision)
            : detailRiwayat.precision,
        recall:
          typeof detailRiwayat.recall === "string"
            ? JSON.parse(detailRiwayat.recall)
            : detailRiwayat.recall,
        f1:
          typeof detailRiwayat.f1_score === "string"
            ? JSON.parse(detailRiwayat.f1_score)
            : detailRiwayat.f1_score,
        datasetInfo:
          typeof detailRiwayat.dataset_info === "string"
            ? JSON.parse(detailRiwayat.dataset_info)
            : detailRiwayat.dataset_info,
        message: "Model berhasil dilatih",
      };
    } catch (err) {
      console.error("Parse error:", err);
      return null;
    }
  }, [detailRiwayat]);

    return { riwayat, detailRiwayat, getDetail, loading, error, parsedDetail };
}

export default useRiwayat;