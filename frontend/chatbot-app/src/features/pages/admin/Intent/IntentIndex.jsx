import { Link } from "react-router-dom";
import useIntent from "../../../hooks/useIntent";
import { useState } from "react";
import FormUpload from "../../../components/Admin/FormUpload";

export default function IntentIndex() {
  const { intents, loading, deleteIntents, createFromFileIntent } = useIntent();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(intents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIntents = intents.slice(indexOfFirstItem, indexOfLastItem);

  // Expanded description
  const [expandedRows, setExpandedRows] = useState({});
  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const truncateText = (text, length = 60) =>
    !text ? "-" : text.length > length ? text.substring(0, length) + "..." : text;

  // Visible pagination pages
  const getVisiblePages = () => {
    const maxVisible = 5;
    if (totalPages <= maxVisible)
      return [...Array(totalPages)].map((_, i) => i + 1);

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1)
      start = Math.max(1, end - maxVisible + 1);

    return [...Array(end - start + 1)].map((_, i) => start + i);
  };

  return (
    <div className="content-container p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Tag</h1>

        <div className="flex gap-3 flex-col">
          <FormUpload onSubmit={createFromFileIntent} label="Upload Tag File" />
          <Link
            to="create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition text-center"
          >
            + Tambah Tag
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading && <p className="p-3 text-gray-600">Loading...</p>}

        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-800 text-white text-left">
            <tr>
              <th className="py-3 px-4 border-b border-gray-300 w-[60px] text-center">
                No
              </th>
              <th className="py-3 px-4 border-b border-gray-300">Nama Tag</th>
              <th className="py-3 px-4 border-b border-gray-300">Deskripsi</th>
              <th className="py-3 px-4 border-b border-gray-300 w-[160px] text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {!loading && currentIntents.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500 italic">
                  Tidak ada data tag
                </td>
              </tr>
            )}

            {currentIntents.map((item, index) => {
              const isExpanded = expandedRows[item.id];
              const descToShow = isExpanded
                ? item.description
                : truncateText(item.description, 80);

              return (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 border-b border-gray-300 text-center">
                    {indexOfFirstItem + index + 1}
                  </td>

                  <td className="py-3 px-4 border-b border-gray-300">
                    {truncateText(item.name, 40)}
                  </td>

                  <td className="py-3 px-4 border-b border-gray-300">
                    <div className="flex flex-col">
                      <span className="text-gray-800 break-words">
                        {descToShow || "-"}
                      </span>

                      {item.description && item.description.length > 80 && (
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="text-blue-600 hover:underline text-sm mt-1 w-fit"
                        >
                          {isExpanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 border-b border-gray-300 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`edit/${item.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          confirm(`Apakah anda yakin ingin menghapus ${item.name}?`) &&
                          deleteIntents(item.id)
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination (IDENTIK dengan PatternIndex) */}
        <div className="flex justify-center items-center mt-4 gap-2 flex-wrap">
          {/* Prev */}
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

          {/* First + dots */}
          {currentPage > 3 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
              >
                1
              </button>
              {currentPage > 4 && (
                <span className="px-2 text-gray-500">...</span>
              )}
            </>
          )}

          {/* Visible pages */}
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

          {/* Last + dots */}
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="px-2 text-gray-500">...</span>
              )}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-1 rounded border bg-white hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next */}
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
