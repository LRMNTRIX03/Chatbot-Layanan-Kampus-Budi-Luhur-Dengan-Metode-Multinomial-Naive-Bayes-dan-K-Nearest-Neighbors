import { useParams, useNavigate, Link } from "react-router-dom";
import useIntent from "../../../hooks/useIntent";
import { useEffect, useState } from "react";
import useResponse from "../../../hooks/useResponse";

export default function ResponseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {intents} = useIntent();
  const {editResponse, getByIdResponse} = useResponse();

  const [form, setForm] = useState({
    text: "",
    intent_id: "",
  });
  const [loading, setLoading] = useState(true);

    const getPattern = async () => {
      try {
        const res = await getByIdResponse(id);
        console.log(res);
        setForm({
          text: res.text,
          intent_id: res.intent_id,
        });
      } catch (error) {
        console.error("Gagal memuat data intent:", error);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
  
    getPattern();
  }, [id]);

  // handle input perubahan
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editResponse(form,id);
      alert("Pattern berhasil diperbarui!");
      navigate("/admin/response"); 
    } catch (error) {
      console.error("Gagal mengedit:", error);
    }
  };

  if (loading) return <p className="p-6">Memuat data...</p>;

 return (
    <div className="content-container p-6">
      <div className="flex justify-between items-center mb-6">
        
        
      </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-gray-50 max-w-lg p-5 rounded-lg mx-auto shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 text-center">Edit Response</h1>
        {/* Input Nama */}
        <div>
          <label
            htmlFor="intent_id"
            className="block text-gray-700 font-medium mb-2"
          >
            Tag
          </label>
         <select
  name="intent_id"
  id="intent_id"
  value={form.intent_id}
  onChange={handleChange}
  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="">Pilih Tag</option>
  {intents.map((item, index) => (
    <option key={index} value={item.id}>
      {item.name}
    </option>
  ))}
</select>

          
        </div>

        <div>
          <label
            htmlFor="text"
            className="block text-gray-700 font-medium mb-2"
          >
            Text Pattern
          </label>
          <textarea
            id="text"
            name="text"
            placeholder="Tuliskan deskripsi intent"
            value={form.text}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div className="flex justify-between">
          <Link
          to="/admin/pattern"
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          Kembali
        </Link>
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
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
        </div>

      </form>
    </div>
  );
}
