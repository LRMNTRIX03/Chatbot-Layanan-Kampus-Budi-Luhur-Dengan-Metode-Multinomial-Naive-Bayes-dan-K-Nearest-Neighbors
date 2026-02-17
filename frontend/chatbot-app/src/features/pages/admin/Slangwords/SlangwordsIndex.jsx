import { Link } from "react-router-dom";
import { useState } from "react";
import useSlangwords from "../../../hooks/useSlagwords";

export default function SlangwordsIndex() {
  const { slangwords, loading, removeSlangword} = useSlangwords();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentslangwords = slangwords.slice(indexOfFirstItem, indexOfLastItem);

  // state untuk show more
  const [expandedRows, setExpandedRows] = useState({});

  const toggleShowMore = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const totalPages = Math.ceil(slangwords.length / itemsPerPage);
const maxVisiblePages = 5;

const getVisiblePages = () => {
  let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let end = start + maxVisiblePages - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxVisiblePages + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

  const truncateText = (text, length = 40) => {
    if (!text) return "-";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <div className="content-container p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Daftar slangwords</h1>
        <Link
          to="create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          + Tambah slangwords
        </Link>
      </div>

      <div className="overflow-x-auto">
        {loading && <p>Loading...</p>}
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-800 text-white text-left">
            <tr>
              <th className="py-3 px-4 border-b border-gray-300 w-[60px] text-center">
                No
              </th>
              <th className="py-3 px-4 border-b border-gray-300">Kata Tidak Baku</th>
              <th className="py-3 px-4 border-b border-gray-300">Kata Baku</th>
              <th className="py-3 px-4 border-b border-gray-300 w-[160px] text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentslangwords.length === 0 && !loading && (
              <tr>
                <td
                  colSpan="3"
                  className="py-4 px-4 text-center text-gray-500 italic"
                >
                  Tidak ada data slangwords
                </td>
              </tr>
            )}

            {currentslangwords.map((item, index) => {
              const isExpanded = expandedRows[item.id];
              const textToShow = isExpanded
                ? item.kata_tbaku
                : truncateText(item.kata_tbaku, 40);

              const textToShow2 = isExpanded
                ? item.kata_baku
                : truncateText(item.kata_baku, 40);

              return (
                <tr
                  className="hover:bg-gray-50 transition"
                  key={item.id}
                >
                  <td className="py-3 px-4 border-b border-gray-300 text-center">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    <div className="flex flex-col">
                      <span className="text-gray-800">{textToShow}</span>
                      {item.kata_tbaku.length > 40 && (
                        <button
                          onClick={() => toggleShowMore(item.id)}
                          className="text-blue-600 hover:underline text-sm mt-1 w-fit"
                        >
                          {isExpanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  </td>
                   <td className="py-3 px-4 border-b border-gray-300">
                    <div className="flex flex-col">
                      <span className="text-gray-800">{textToShow2}</span>
                      {item.kata_baku.length > 40 && (
                        <button
                          onClick={() => toggleShowMore(item.id)}
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
                          confirm(`Apakah anda yakin ingin menghapus ${item.kata_tbaku} adan ${item.kata_baku}?`) &&
                          removeSlangword(item.id)
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

        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-2 flex-wrap">
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

          <button
            disabled={currentPage === Math.ceil(slangwords.length / itemsPerPage)}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === Math.ceil(slangwords.length / itemsPerPage)
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
