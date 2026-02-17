import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useResponse from "../../../hooks/useResponse";
import useIntent from "../../../hooks/useIntent";

export default function ResponseCreate() {
  const [form, setForm] = useState({
    text: "",
    intent_id: "",
  });
  const {intents} = useIntent();

  const {addResponse, loading} = useResponse();
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addResponse(form);
      if (res) {
        navigate("/admin/response"); 
        setForm({
          text: "",
          intent_id: "",
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
        Tambah Response
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
  <option value="">Pilih Intent</option>
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
            Text Response
          </label>
          <textarea
            id="text"
            name="text"
            placeholder="Tuliskan Respon dari Tag"
            value={form.text}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

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
