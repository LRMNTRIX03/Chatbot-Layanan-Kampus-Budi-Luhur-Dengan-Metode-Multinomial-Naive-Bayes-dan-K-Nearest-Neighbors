import { useState } from "react";
import { trainingProses, trainingKNN, predictNB, predictKNN } from "../services/TrainingServices";
import useTrainingStore from "../store/useTrainingStore";
import { useEffect, useRef } from "react";

const useTraining = () => {
  const [loading, setLoading] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const chatEndRef = useRef(null);
   const [messages, setMessages] = useState([
    { sender: "bot", text: "Halo! Ada yang bisa saya bantu?" },
  ]);
  const {
    setMessage,
    setAkurasi,
    setConfusionMatrix,
    setClasses,
    setMetrics,
  } = useTrainingStore();

  const dataTraining = async (rasio) => {
    try {
      setLoading(true);

      // 🔹 Ambil hasil dari service
      const res = await trainingProses(rasio);

      // 🔹 Deteksi apakah hasilnya Response object atau sudah JSON
      const data =
        typeof res.json === "function" ? await res.json() : res;

      console.log("📦 Data training (parsed):", data);

      // 🔹 Tangani error dari backend
      if (data.status === "error") {
        throw new Error(data.message || "Training gagal");
      }

      // 🔹 Simpan ke store global
      setMessage(data.message);
      setAkurasi(data.akurasi || data.accuracy || 0);
      setConfusionMatrix(data.confusion_matrix || []);
      setClasses(data.classes || []);
      setMetrics({
        recall: data.recall || [],
        precision: data.precision || [],
        f1: data.f1 || data.f1_score || [],
        avgRecall: data.avgRecall || data.macro_recall || 0,
        avgPrecision: data.avgPrecision || data.macro_precision || 0,
        avgF1: data.avgF1 || data.macro_f1 || 0,
      });

      return data;
    } catch (error) {
      console.error("❌ Error in useTraining:", error);
      return { status: "error", message: error.message || "Training gagal" };
    } finally {
      setLoading(false);
    }
  };
    const dataTrainingKNN = async (rasio, kVal) => {
    try {
      setLoading(true);

      // 🔹 Ambil hasil dari service
      const res = await trainingKNN(rasio, kVal);

      // 🔹 Deteksi apakah hasilnya Response object atau sudah JSON
      const data =
        typeof res.json === "function" ? await res.json() : res;

      console.log("📦 Data training (parsed):", data);

      // 🔹 Tangani error dari backend
      if (data.status === "error") {
        throw new Error(data.message || "Training gagal");
      }

      // 🔹 Simpan ke store global
      setMessage(data.message);
      setAkurasi(data.akurasi || data.accuracy || 0);
      setConfusionMatrix(data.confusion_matrix || []);
      setClasses(data.classes || []);
      setMetrics({
        recall: data.recall || [],
        precision: data.precision || [],
        f1: data.f1 || data.f1_score || [],
        avgRecall: data.avgRecall || data.macro_recall || 0,
        avgPrecision: data.avgPrecision || data.macro_precision || 0,
        avgF1: data.avgF1 || data.macro_f1 || 0,
      });

      return data;
    } catch (error) {
      console.error("❌ Error in useTraining:", error);
      return { status: "error", message: error.message || "Training gagal" };
    } finally {
      setLoading(false);
    }
  };
   useEffect(() => {
     if (isFirstRender) {
       setIsFirstRender(false);
       return;
     }
     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);
 
   const sendMessage = async (input, model) => {
     if (!input.trim()) return;
 
     const newMessage = { sender: "user", text: input };
     setMessages((prev) => [...prev, newMessage]);
     setLoading(true);
 
    try {
  setLoading(true);

  const service =
    model === "NB" ? predictNB : predictKNN;
    console.log("Selected Model:", model);

  const res = await service(newMessage.text);

  const botText =
    res?.response ??
    res?.message ??
    res?.messages ??
    "Maaf, saya tidak mengerti.";

  setMessages((prev) => [
    ...prev,
    { sender: "bot", text: botText },
  ]);
} catch (err) {
  console.error(err);
  setMessages((prev) => [
    ...prev,
    { sender: "bot", text: "Terjadi kesalahan saat menghubungi server." },
  ]);
} finally {
  setLoading(false);
}
   };
 
   

  return { dataTraining, dataTrainingKNN, loading,
    messages, sendMessage, chatEndRef
   };
};

export default useTraining;
