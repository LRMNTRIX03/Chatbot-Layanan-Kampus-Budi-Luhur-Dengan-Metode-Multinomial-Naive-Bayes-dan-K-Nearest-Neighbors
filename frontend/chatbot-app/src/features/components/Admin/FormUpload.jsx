import { useState, useRef } from "react";

export default function FormUpload({ onSubmit, label = "Upload File", accept = ".csv"}) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);



  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await onSubmit(file);
      console.log("Upload response:", res);
      if (res?.success === true) {
        setMessage("File berhasil diupload!");
        setSuccess(true);
        setFile(null);
      } else {
        setMessage(`Error :  ${res.message|| ""}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(`Terjadi kesalahan saat upload`);
    }
    finally{
      setFile(null);
      setLoading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setTimeout(()=>{
        setMessage("");
        setSuccess(false);
      },3000)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
      <div>
        <label className="block text-gray-700 font-bold mb-2" htmlFor="file">
          {label}
        </label>
        <input
          id="file"
          type="file"
          ref={inputRef}
          accept={accept}
          onChange={handleChange}
          className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
        />
      </div>
      
      <button
        type="submit"
        disabled={!file || loading}
        className={`bg-blue-600 text-white font-bold py-2 px-4 rounded ${
          file ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed"
        }`}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && 
      <p className={success ? "bg-green-600 text-center text-white p-3 rounded shadow " : "bg-red-600 text-center text-white p-3 rounded shadow"}>{message}</p>
      }
    </form>
  );
}
