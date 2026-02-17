import { useState } from "react";
import useRiwayat from "../../../hooks/useRiwayat";
import { CheckCircle, Grid3x3, TrendingUp, Info } from "lucide-react";

export default function RiwayatIndex() {
  const { riwayat,  getDetail, parsedDetail } = useRiwayat();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentRiwayat = riwayat?.riwayat
    ? riwayat.riwayat.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  

  const formatPercent = (num) =>
    num ? (num * 100).toFixed(2) + "%" : "0%";

  const getConfidenceColor = (acc) =>
    acc >= 0.9
      ? "from-green-400 to-green-600"
      : acc >= 0.75
      ? "from-blue-400 to-blue-600"
      : "from-yellow-400 to-yellow-600";

  const getColorByValue = (value, isMatrix = false) => {
    if (isMatrix) {
      if (value === 0) return "bg-white text-gray-400";
      if (value >= 8) return "bg-green-100 text-green-800 font-bold";
      if (value >= 5) return "bg-yellow-50 text-yellow-800";
      return "bg-red-50 text-red-800";
    }
    if (value >= 0.9) return "text-green-600 font-bold";
    if (value >= 0.75) return "text-blue-600 font-semibold";
    if (value >= 0.5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    
    <div className="p-6 flex justify-center">
      <div className="max-w-6xl w-full space-y-10">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Riwayat Training 
        </h1>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl shadow border">
          <table className="w-full border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-center w-[60px]">No</th>
                <th className="py-3 px-4">Rasio</th>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">Nilai K untuk KNN</th>
                <th className="py-3 px-4">Tanggal dan Waktu Training</th>
                <th className="py-3 px-4 text-center w-[150px]">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentRiwayat.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-gray-500 italic"
                  >
                    Tidak ada riwayat
                  </td>
                </tr>
              ) : (
                currentRiwayat.map((item, index) => (
                  <tr
                    key={item.perhitungan_id}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-center">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="py-3 px-4">{item.rasio}</td>
                    <td className="py-3 px-4">{item.model}</td>
                    <td className="py-3 px-4">{item.k_val}</td>
                    <td className="py-3 px-4">
                      {new Date(item.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => getDetail(item.perhitungan_id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-2">
          {Array.from({
            length: Math.ceil((riwayat?.riwayat?.length || 0) / itemsPerPage),
          }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* DETAIL SECTION */}
        {parsedDetail && parsedDetail.datasetInfo && (
          <div className="space-y-10">
            
            {/* DATASET INFO */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {[
                { label: "Total Data", color: "blue", value: parsedDetail.datasetInfo.total_data },
                { label: "Data Training", color: "green", value: parsedDetail.datasetInfo.train_size },
                { label: "Data Uji", color: "purple", value: parsedDetail.datasetInfo.test_size },
                { label: "Total Kelas", color: "indigo", value: parsedDetail.datasetInfo.num_classes },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`bg-${item.color}-50 p-5 rounded-xl text-center shadow-sm`}
                >
                  <p className={`text-${item.color}-600 text-sm`}>
                    {item.label}
                  </p>
                  <p className={`text-3xl font-bold text-${item.color}-800`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* ACCURACY */}
            <div
              className={`bg-gradient-to-r ${getConfidenceColor(
                parsedDetail.accuracy
              )} text-white rounded-2xl shadow-xl p-8`}
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Model Accuracy</h2>
                  <p className="text-6xl font-bold">
                    {formatPercent(parsedDetail.accuracy)}
                  </p>
                  <p className="text-sm mt-2 opacity-90">
                    {parsedDetail.message}
                  </p>
                </div>
                <CheckCircle size={90} className="opacity-60" />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 border-t border-white/40 pt-6">
                <div>
                  <p className="text-sm opacity-80">Avg Precision</p>
                  <p className="text-xl font-bold">
                    {formatPercent(parsedDetail.avgPrecision)}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Avg Recall</p>
                  <p className="text-xl font-bold">
                    {formatPercent(parsedDetail.avgRecall)}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Avg F1-Score</p>
                  <p className="text-xl font-bold">
                    {formatPercent(parsedDetail.avgF1)}
                  </p>
                </div>
              </div>
            </div>

            {/* CONFUSION MATRIX */}
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Grid3x3 className="text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Confusion Matrix
                </h2>
              </div>

              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-max border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-gray-100 p-3 border font-bold">
                        Actual \ Predicted
                      </th>
                      {parsedDetail.classes.map((cls, i) => (
                        <th
                          key={i}
                          className="border p-3 text-xs font-bold text-gray-700"
                        >
                          {cls}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedDetail.confusionMatrix.map((row, i) => (
                      <tr key={i}>
                        <td className="sticky left-0 bg-gray-50 p-3 border font-semibold">
                          {parsedDetail.classes[i]}
                        </td>
                        {row.map((val, j) => (
                          <td
                            key={j}
                            className={`p-3 border text-center ${getColorByValue(
                              val,
                              true
                            )} ${i === j ? "ring-2 ring-indigo-400" : ""}`}
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* METRIK PER KELAS */}
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Metrik per Kelas
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="border p-3 text-left font-bold">Class</th>
                      <th className="border p-3 text-center font-bold">
                        Precision
                      </th>
                      <th className="border p-3 text-center font-bold">
                        Recall
                      </th>
                      <th className="border p-3 text-center font-bold">
                        F1-Score
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {parsedDetail.classes.map((cls, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="border p-3 font-semibold">{cls}</td>
                        <td
                          className={`border p-3 text-center ${getColorByValue(
                            parsedDetail.precision[i]
                          )}`}
                        >
                          {formatPercent(parsedDetail.precision[i])}
                        </td>
                        <td
                          className={`border p-3 text-center ${getColorByValue(
                            parsedDetail.recall[i]
                          )}`}
                        >
                          {formatPercent(parsedDetail.recall[i])}
                        </td>
                        <td
                          className={`border p-3 text-center ${getColorByValue(
                            parsedDetail.f1[i]
                          )}`}
                        >
                          {formatPercent(parsedDetail.f1[i])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DISTRIBUSI DATA */}
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Info className="text-indigo-600" />
                <h2 className="text-2xl font-bold">Distribusi Data</h2>
              </div>

              <h4 className="font-semibold text-gray-600 mb-4">
                Total: {parsedDetail.datasetInfo.total_data}
              </h4>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-indigo-50">
                    <th className="p-3 text-left font-semibold">Kelas</th>
                    <th className="p-3 text-center font-semibold">Jumlah</th>
                    <th className="p-3 text-center font-semibold">Persentase</th>
                  </tr>
                </thead>

                <tbody>
                  {Object.entries(parsedDetail.datasetInfo.distribution)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cls, count]) => {
                      const percentage =
                        (count / parsedDetail.datasetInfo.total_data) * 100;
                      return (
                        <tr key={cls} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-bold">{cls}</td>
                          <td className="p-3 text-center font-semibold">
                            {count}
                          </td>
                          <td className="p-3 text-center">
                            {percentage.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
