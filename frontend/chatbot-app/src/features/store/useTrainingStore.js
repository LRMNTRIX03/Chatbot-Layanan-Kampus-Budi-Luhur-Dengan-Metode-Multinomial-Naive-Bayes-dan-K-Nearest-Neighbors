
import { create } from "zustand";

const useTrainingStore = create((set) => ({
  message: "",
  setMessage: (msg) => set({ message: msg }),
  akurasi: 0,
  setAkurasi: (akur) => set({ akurasi: akur }),
  confusion_matrix: [],
  setConfusionMatrix: (matrix) => set({ confusion_matrix: matrix }),
  classes: [],
  setClasses: (cls) => set({ classes: cls }),
  recall: [],
  precision: [],
  f1: [],
  avgRecall: 0,
  avgPrecision: 0,
  avgF1: 0,
  setMetrics: (data) =>
    set({
      recall: data.recall,
      precision: data.precision,
      f1: data.f1,
      avgRecall: data.avgRecall,
      avgPrecision: data.avgPrecision,
      avgF1: data.avgF1,
    }),
}));

export default useTrainingStore;
