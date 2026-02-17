import React, { useState } from 'react';
import { AlertCircle, CheckCircle, TrendingUp, Grid3x3, Info, AlertTriangle } from 'lucide-react';
import useTraining from '../../../hooks/useTraining';

export default function TrainingPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const {dataTraining,  dataTrainingKNN} = useTraining();
  const [rasio, setRasio] = useState("80:20");
  const[kVal, setKVal] = useState(3);
 


  const k_val = [
    {value: 7, label: "7"},
    {value: 9, label: "9"},
    {value: 11, label: "11"},
    {value: 13, label: "13"},
    {value: 15, label: "15"}
  ]

  

  const handleTraining = async () => {
  setLoading(true);
  setError(null);

  try {
    const data = await dataTraining(rasio); 

    if (!data || data.status === "error") {
      throw new Error(data?.message || "Training gagal");
    }

    setResults(data);
  } catch (err) {
    setError(err.message);
    console.error("Training error:", err);
  } finally {
    setLoading(false);
  }
};
const handleTrainingKNN = async () => {
  setLoading(true);
  setError(null);

  try {
    console.log(rasio, kVal)
    const data = await dataTrainingKNN(rasio, kVal); 

    if (!data || data.status === "error") {
      throw new Error(data?.message || "Training gagal");
    }

    setResults(data);
  } catch (err) {
    setError(err.message);
    console.error("Training error:", err);
  } finally {
    setLoading(false);
  }
};





  const formatPercent = (value) => `${(value * 100).toFixed(2)}%`;

  const getColorByValue = (value, isMatrix = false) => {
    if (isMatrix) {
      if (value === 0) return 'bg-gray-50 text-gray-400';
      if (value >= 15) return 'bg-green-100 text-green-800 font-bold';
      if (value >= 10) return 'bg-green-50 text-green-700';
      return 'bg-red-50 text-red-700';
    }
    
    if (value >= 0.9) return 'text-green-600 font-bold';
    if (value >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceColor = (accuracy) => {
    if (accuracy >= 0.9) return 'from-green-500 to-green-600';
    if (accuracy >= 0.7) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Training Model Naive Bayes
          </h1>
          <p className="text-gray-600">
            Chatbot Layanan Kampus - Klasifikasi Intent dengan Multinomial Naive Bayes
          </p>
        </div>
     <div className='flex flex-row gap-2 text-center justify-center'>
  <p className='text-bold text-xl '>Split Data : </p>

  <div className='flex text-center justify-center mt-1'>
    <input 
      type="radio"
      id="80-20"
      name="rasio"
      value="80:20"
      checked={rasio === "80:20"}
      onChange={(e) => setRasio(e.target.value)}
    />
    <label htmlFor="80-20">
      <p className='text-semibold ml-2'>80:20</p>
    </label>
  </div>

  <div className='flex text-center justify-center mt-1'>
    <input 
      type="radio"
      id="70-30"
      name="rasio"
      value="70:30"
      checked={rasio === "70:30"}
      onChange={(e) => setRasio(e.target.value)}
    />
    <label htmlFor="70-30">
      <p className='text-semibold ml-2'>70:30</p>
    </label>
  </div>
</div>
 <div className='justify-center'>
    <div className='flex justify-center'>
      <label htmlFor="k_val" className='mr-5'><p className='text-center font-semibold mt-5'>Nilai K untuk KNN</p></label>
    <select name="k_val" id="k_val" 
    className='mt-5 border border-blue-500 rounded-lg px-2 py-1 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
    onChange={(e)=>{
      setKVal(Number(e.target.value))
    }}
    value={kVal}
    >
    {k_val.map((item) => (
      <option key={item.value} value={item.value}>{item.label}</option>
    ))}
    </select>
    </div>
  </div>

          
       

        {/* Training Button */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="form-container grid grid-cols-8">
            <div className="col-span-4 flex flex-col items-center p-3">
            <h1 className='text-2xl font-bold text-center mb-2'>Naive Bayes Model</h1>
          <button
            onClick={handleTraining}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl text-white text-xl font-semibold transition-all transform hover:scale-105 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin h-5 w-5 border-3 border-white border-t-transparent rounded-full"></div>
                Processing Training...
              </span>
            ) : (
              'Start Training'
            )}
          </button>
            </div>
            <div className="col-span-4 flex flex-col items-center p-3">
               <h1 className='text-2xl font-bold text-center mb-2'>KNN Model</h1>
          <button
            onClick={handleTrainingKNN}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl text-white text-xl font-semibold transition-all transform hover:scale-105 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin h-5 w-5 border-3 border-white border-t-transparent rounded-full"></div>
                Processing Training...
              </span>
            ) : (
              'Start Training'
            )}
          </button>
            </div>
            
            
          </div>
          

          {/* Dataset Info */}
          {results?.dataset_info && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-sm text-blue-600">Total Data</p>
                <p className="text-2xl font-bold text-blue-800">{results.dataset_info.total_data}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-sm text-green-600">Data Training</p>
                <p className="text-2xl font-bold text-green-800">{results.dataset_info.train_size}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <p className="text-sm text-purple-600">Data Testing</p>
                <p className="text-2xl font-bold text-purple-800">{results.dataset_info.test_size}</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg text-center">
                <p className="text-sm text-indigo-600">Total Kelas</p>
                <p className="text-2xl font-bold text-indigo-800">{results.dataset_info.num_classes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-800 mb-2">Training Gagal</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Warnings */}
        {results?.warnings && results.warnings.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-800 mb-2">Peringatan</h3>
                {results.warnings.map((warning, idx) => (
                  <p key={idx} className="text-yellow-700 text-sm">{warning}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            {/* Accuracy Card */}
            <div className={`bg-gradient-to-r ${getConfidenceColor(results.akurasi)} rounded-2xl shadow-xl p-8 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Model Accuracy</h2>
                  <p className="text-5xl font-bold">{formatPercent(results.akurasi)}</p>
                  <p className="text-sm mt-2 opacity-90">{results.message}</p>
                </div>
                <CheckCircle size={80} className="opacity-50" />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/30">
                <div>
                  <p className="text-sm opacity-80">Avg Precision</p>
                  <p className="text-xl font-bold">{formatPercent(results.avgPrecision)}</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Avg Recall</p>
                  <p className="text-xl font-bold">{formatPercent(results.avgRecall)}</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Avg F1-Score</p>
                  <p className="text-xl font-bold">{formatPercent(results.avgF1)}</p>
                </div>
              </div>
            </div>

            {/* Confusion Matrix */}
            {results.confusion_matrix && results.confusion_matrix.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 ">
                <div className="flex items-center gap-2 mb-4">
                  <Grid3x3 className="text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Confusion Matrix</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border-2 border-gray-300 bg-gradient-to-r from-indigo-100 to-blue-100 p-3 text-left font-bold text-gray-700 text-sm sticky left-0">
                          Actual \ Predicted
                        </th>
                        {results.classes.map((cls, i) => (
                          <th
                            key={i}
                            className="border-2 border-gray-300 bg-gradient-to-r from-indigo-100 to-blue-100 p-3 text-center font-bold text-gray-700 text-xs"
                          >
                            <div className="max-w-[100px] truncate" title={cls}>
                              {cls}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.confusion_matrix.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition">
                          <td className="border-2 border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 p-3 font-bold text-gray-700 text-xs sticky left-0">
                            <div className="max-w-[120px] truncate" title={results.classes[i]}>
                              {results.classes[i]}
                            </div>
                          </td>
                          {row.map((val, j) => (
                            <td
                              key={j}
                              className={`border-2 border-gray-300 p-3 text-center text-lg ${getColorByValue(val, true)} ${
                                i === j ? 'ring-2 ring-indigo-400' : ''
                              }`}
                            >
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Legend */}
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border-2 border-indigo-400 rounded"></div>
                    <span>Correct Predictions (Diagonal)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-50 border border-red-300 rounded"></div>
                    <span>Misclassifications</span>
                  </div>
                </div>
              </div>
            )}

            {/* Metrics per Class */}
            {results.classes && results.precision && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Metrik per Kelas (Tag)</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-100 to-blue-100">
                        <th className="border-2 border-gray-300 p-3 text-left font-bold text-gray-700">
                          Class
                        </th>
                        <th className="border-2 border-gray-300 p-3 text-center font-bold text-gray-700">
                          Precision
                        </th>
                        <th className="border-2 border-gray-300 p-3 text-center font-bold text-gray-700">
                          Recall
                        </th>
                        <th className="border-2 border-gray-300 p-3 text-center font-bold text-gray-700">
                          F1-Score
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.classes.map((cls, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition">
                          <td className="border-2 border-gray-300 p-3 font-semibold text-gray-700 text-sm">
                            {cls}
                          </td>
                          <td className={`border-2 border-gray-300 p-3 text-center text-lg ${getColorByValue(results.precision[i])}`}>
                            {formatPercent(results.precision[i])}
                          </td>
                          <td className={`border-2 border-gray-300 p-3 text-center text-lg ${getColorByValue(results.recall[i])}`}>
                            {formatPercent(results.recall[i])}
                          </td>
                          <td className={`border-2 border-gray-300 p-3 text-center text-lg ${getColorByValue(results.f1[i])}`}>
                            {formatPercent(results.f1[i])}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Class Distribution */}
            {results.dataset_info?.distribution && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Distribusi Data Per Kelas</h2>
                </div>
                <h4 className="font-semibold text-gray-600 mb-5 text-center">Total Data : {results.dataset_info.total_data}</h4>
                
          <div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr className="border-b-2 border-gray-200">
        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
          Kelas
        </th>
        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
          Total Data
        </th>
        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
          Persentase
        </th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(results.dataset_info.distribution)
        .sort((a, b) => b[1] - a[1])
        .map(([intent, count]) => {
          const percentage = (count / results.dataset_info.total_data) * 100;
          return (
            <tr key={intent} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-sm text-gray-700 font-bold">
                {intent}
              </td>
              <td className="py-3 px-4 text-sm text-gray-800 font-semibold text-center">
                {count}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 text-center">
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
        )}
      </div>
    </div>
  );
}