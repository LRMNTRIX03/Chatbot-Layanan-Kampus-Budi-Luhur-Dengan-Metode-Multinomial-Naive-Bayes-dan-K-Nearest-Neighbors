import { useParams, useNavigate, Link } from "react-router-dom";
import useIntent from "../../../hooks/useIntent";
import { useEffect, useState } from "react";

export default function IntentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getIntentById, editIntents } = useIntent();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const getIntent = async () => {
      try {
        const res = await getIntentById(id);
        setForm({
          name: res.name,
          description: res.description,
        });
      } catch (error) {
        console.error("Gagal memuat data intent:", error);
      } finally {
        setLoading(false);
      }
    };
    getIntent();
  }, [id]);

  // handle input perubahan
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editIntents(id, form);
      alert("Intent berhasil diperbarui!");
      navigate("/admin/intent"); 
    } catch (error) {
      console.error("Gagal mengedit intent:", error);
    }
  };

  if (loading) return <p className="p-6">Memuat data...</p>;

  return (
    <div className="content-container p-6">
      <div className="flex justify-between items-center mb-6">
        
        
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 border border-gray-200 max-w-lg mx-auto"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-5">Edit Tag</h1>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Nama Tag
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan nama intent"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Deskripsi
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan deskripsi intent"
          ></textarea>
        </div>
        <div className="flex justify-between">
          <Link
          to="/intent"
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          Kembali
        </Link>
         <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Simpan Perubahan
          </button>
        </div>
        </div>

       
      </form>
    </div>
  );
}
