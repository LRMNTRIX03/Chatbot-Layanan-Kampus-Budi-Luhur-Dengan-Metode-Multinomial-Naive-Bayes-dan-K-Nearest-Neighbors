import { useState, useEffect, useMemo } from "react";
import usePre from "../../../hooks/usePreprocessing";
import usePattern from "../../../hooks/usePattern";

export default function PreprocessingIndex() {
  const { fetchPreprocessingData, prosesPreprocessing, loading } = usePre();
  const { patterns, getAllPatterns, loading: loadingPattern } = usePattern();

  const [data, setData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    getAllPatterns();
    loadData();
  }, []);

  const loadData = async () => {
    const res = await fetchPreprocessingData();
    if (res) setData(res);
  };

  const handlePreprocess = async () => {
    const res = await prosesPreprocessing();
    await loadData();
    if (res && res.data) {
      setData(res);
      setSuccess(true);
      setCurrentPage(1);
    }
  };


 const mergedData = useMemo(() => {
  if (!patterns) return [];

  return patterns
    .map((pattern) => {
      const pre = data.find((p) => p.pattern_id === pattern.id);
      return {
        id: pre?.id || pattern.id,
        pattern_id: pattern.id,
        original: pattern?.text || pattern?.pattern_text || "-",
        case_folding: pre?.case_folding_text || "-",
        clean_text: pre?.clean_text_result || "-",
        stopword_removal: pre?.stopword_removal_text || "-",
        stemming: pre?.stemming_text || "-",
        final: pre?.preprocessed_text || "-",   
        slangwords_result: pre?.slangwords_result || "-",
        tokenization_text: pre?.tokenization_text || "-",
      };
    })
    .filter((item) => item.final !== "-" && item.final.trim() !== "");
}, [patterns, data]);


  // Pagination
  const totalPages = Math.ceil(mergedData.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = mergedData.slice(indexOfFirst, indexOfLast);

  const toggleShowMore = (rowId, colKey) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [colKey]: !prev[rowId]?.[colKey],
      },
    }));
  };

  const truncateText = (text, length = 50) =>
    !text ? "-" : text.length > length ? text.substring(0, length) + "..." : text;

  // Visible page numbers
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
        <h1 className="text-2xl font-bold text-gray-800">Hasil Preprocessing</h1>
        <button
          onClick={handlePreprocess}
          disabled={loading || loadingPattern}
          className={`px-5 py-2 rounded-lg font-semibold ${
            loading || loadingPattern
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Memproses..." : "Mulai Preprocessing"}
        </button>
      </div>

      {success && (
        <p className="text-green-600 font-medium mb-4">
          ✅ Preprocessing selesai ({mergedData.length} data)
        </p>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {(loading || loadingPattern) && <p>Loading...</p>}
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-800 text-white text-left">
            <tr>
              <th className="py-3 px-4 border-b border-gray-300 w-[60px] text-center">No</th>
              <th className="py-3 px-4 border-b border-gray-300">Teks Asli</th>
              <th className="py-3 px-4 border-b border-gray-300">Clean Text</th>
              <th className="py-3 px-4 border-b border-gray-300">Case Folding</th>
              <th className="py-3 px-4 border-b border-gray-300">Normalisasi</th>
              <th className="py-3 px-4 border-b border-gray-300">Tokenization</th>
              <th className="py-3 px-4 border-b border-gray-300">Stopword Removal</th>
              <th className="py-3 px-4 border-b border-gray-300">Stemming</th>
              <th className="py-3 px-4 border-b border-gray-300">Final</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {!loading && currentData.length === 0 && (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500 italic">
                  Tidak ada data preprocessing
                </td>
              </tr>
            )}

            {currentData.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 border-b border-gray-300 text-center">
                  {indexOfFirst + index + 1}
                </td>

                {[
                  "original",
                  "clean_text",
                  "case_folding",
                  "slangwords_result",
                  "tokenization_text",
                  "stopword_removal",
                  "stemming",
                  "final",
                ].map((key) => {
                  const isExpanded = expandedRows[item.id]?.[key];
                  const textToShow = isExpanded
                    ? item[key]
                    : truncateText(item[key], 50);

                  return (
                    <td key={key} className="py-3 px-4 border-b border-gray-300">
                      <div className="flex flex-col">
                        <span className="text-gray-800 break-words whitespace-pre-wrap">
                          {textToShow}
                        </span>
                        {item[key] && item[key].length > 50 && (
                          <button
                            onClick={() => toggleShowMore(item.id, key)}
                            className="text-blue-600 hover:underline text-sm mt-1 w-fit"
                          >
                            {isExpanded ? "Show less" : "Show more"}
                          </button>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {mergedData.length > 0 && (
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
        )}
      </div>
    </div>
  );
}
