import { useParams, useNavigate, Link } from "react-router-dom";
import useStopword from "../../../hooks/useStopword";
import { useEffect, useState } from "react";

export default function StopwordsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStopwordById, editStopword } = useStopword();

  const [form, setForm] = useState({
   text : ""
  });
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const getStopword = async () => {
      try {
        const res = await getStopwordById(id);
        setForm({
          text: res.text
        });
      } catch (error) {
        console.error("Gagal memuat data intent:", error);
      } finally {
        setLoading(false);
      }
    };
    getStopword();
  }, [id]);

  // handle input perubahan
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editStopword(id, form);
      alert("Intent berhasil diperbarui!");
      navigate("/admin/stopword"); 
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
        className="bg-white shadow-md rounded-lg p-6 border border-gray-200 max-w-lg mx-auto "
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-5">Edit Stopword</h1>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Nama Stopwords
          </label>
          <input
            type="text"
            name="text"
            value={form.text}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan nama intent"
          />
        </div>

      <div className="flex justify-between">
         <Link
          to="/admin/stopwords"
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
