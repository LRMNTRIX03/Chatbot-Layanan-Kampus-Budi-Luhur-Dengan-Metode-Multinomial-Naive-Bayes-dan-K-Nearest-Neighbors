import { Link } from "react-router-dom";
import useResponse from "../../../hooks/useResponse";
import { useState } from "react";
import FormUpload from "../../../components/Admin/FormUpload";
import useIntent from "../../../hooks/useIntent";
export default function ResponseIndex() {
  const { responses, loading, removeResponse, createFromFileResponse } = useResponse();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const {intents} = useIntent();
  const [filterResponses, setFilterResponses] = useState("");

  const filteredResponses = filterResponses ?
  responses.filter((item) => item.intent_id == filterResponses) : responses;
  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResponses = filteredResponses.slice(indexOfFirstItem, indexOfLastItem);


  const getVisiblePages = () => {
    const maxVisible = 5;
    if (totalPages <= maxVisible) return [...Array(totalPages)].map((_, i) => i + 1);

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    return [...Array(end - start + 1)].map((_, i) => start + i);
  };

  return (
    <div className="content-container p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Response</h1>
        <div className="flex gap-3 flex-col">
          <FormUpload onSubmit={createFromFileResponse} label="Upload Response File" />
          <Link
            to="create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition text-center"
          >
            + Tambah Response
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading && <p>Loading...</p>}
        <form>
        <select 
        value={filterResponses}
        onChange={(e)=>{setFilterResponses(e.target.value)}}
        className="border p-3 shadow mb-3">
          <option value="">-- Semua Tag --</option>
          {intents.map((item)=>{
            return <option value={item.id}>
              {item.name}
            </option>
          })}

        </select>
        </form>
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-800 text-white text-left">
            <tr>
              <th className="py-3 px-4 border-b border-gray-300 w-[60px] text-center">No</th>
              <th className="py-3 px-4 border-b border-gray-300">Text Response</th>
              <th className="py-3 px-4 border-b border-gray-300">Intent</th>
              <th className="py-3 px-4 border-b border-gray-300 w-[160px] text-center">Action</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {!loading && currentResponses.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500 italic">
                  Tidak ada data response
                </td>
              </tr>
            )}

            {currentResponses.map((item, index) => (
              <tr className="hover:bg-gray-50 transition" key={item.id}>
                <td className="py-3 px-4 border-b border-gray-300 text-center">
                  {indexOfFirstItem + index + 1}
                </td>
                <td className="py-3 px-4 border-b border-gray-300">{item.text}</td>
                <td className="py-3 px-4 border-b border-gray-300">{item.intent_name || "-"}</td>
                <td className="py-3 px-4 border-b border-gray-300 text-center">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`/admin/response/edit/${item.id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() =>
                        confirm(`Apakah anda yakin ingin menghapus "${item.text}"?`) &&
                        removeResponse(item.id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4 gap-2 flex-wrap">
          {/* Prev Button */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Prev
          </button>

          {/* First page + dots */}
          {currentPage > 3 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
              >
                1
              </button>
              {currentPage > 4 && <span className="px-2 text-gray-500">...</span>}
            </>
          )}

          {/* Visible Pages */}
          {getVisiblePages().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Last page + dots */}
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <span className="px-2 text-gray-500">...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next Button */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
