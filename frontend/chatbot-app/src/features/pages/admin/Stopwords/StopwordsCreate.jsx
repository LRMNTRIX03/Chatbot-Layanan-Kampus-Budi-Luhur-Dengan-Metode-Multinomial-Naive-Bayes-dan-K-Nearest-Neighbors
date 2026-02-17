import { useState } from "react";
import useStopword from "../../../hooks/useStopword";
import { useNavigate } from "react-router-dom";

export default function StopwordsCreate() {
  const [form, setForm] = useState({
    text: ""
  });
  const { addStopword, loading } = useStopword();
  const [error, setError] = useState("");
  const navigate = useNavigate();
//   const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addStopword(form);
      if (res) {
        navigate("/admin/stopwords"); 
        console.log("navigate triggred")
        setForm({
          text: "",
        })
      }
    } catch (error) {
      setError("Data gagal ditambahkan");
      console.log(`error : ${error}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 mt-8 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Tambah Stopwords
      </h1>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Input Nama */}
        <div>
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-2"
          >
            Nama Stopwords
          </label>
          <input
            type="text"
            id="text"
            name="text"
            placeholder="Masukkan Stopwords"
            value={form.text}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>



        {/* Tombol Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
