import { create } from "zustand";

const useTFIDFStore = create((set) => ({
    statistics: null,
    setStatistics: (stats) => set({ statistics: stats }),
    loading: false,
    setLoading: (load) => set({ loading: load }),
    computing: false,
    setComputing: (comp) => set({ computing: comp }),
}));
export default useTFIDFStore;