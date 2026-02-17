import { useState } from "react";
import useIntent from "../../../hooks/useIntent";
import { useNavigate } from "react-router-dom";

export default function IntentCreate() {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const { addIntents, loading } = useIntent();
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
      const res = await addIntents(form);
      if (res) {
        navigate("/admin/intent"); 
        console.log("navigate triggred")
        setForm({
          name: "",
          description: "",
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
        Tambah Tag
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
            Nama Tag
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Masukkan nama Tag"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Input Deskripsi */}
        <div>
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2"
          >
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Tuliskan deskripsi Tag"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
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
