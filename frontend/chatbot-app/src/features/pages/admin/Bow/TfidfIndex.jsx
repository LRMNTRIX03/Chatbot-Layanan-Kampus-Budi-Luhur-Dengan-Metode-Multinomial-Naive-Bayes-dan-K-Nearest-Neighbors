import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStatistik } from '../../../hooks/useStatistik';
export default function TFIDFIndex() {

  const [activeTab, setActiveTab] = useState('statistics');
  const { statistics, computing, loading, fetchStatistics, HitungTFIDF, error } = useStatistik();
  
  
  
  if (loading || computing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">
          {computing ? 'Menghitung TF-IDF...' : 'Memuat data...'}
        </p>
      </div>
    );
  }

  
  if (!statistics) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Hitung TF-IDF
              </h1>
              <p className="text-gray-600">
                Hitung TF-IDF (Term Frequency - Inverse Document Frequency) dari dataset 
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

          

            <div className="flex flex-col items-center gap-4">
              <button
                onClick={HitungTFIDF}
                disabled={computing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-8 py-4 w-full rounded-lg transition"
              >
                {computing ? 'Menghitung...' : 'Hitung TF-IDF'}
              </button>

              <button
                onClick={fetchStatistics}
                className="text-white hover:text-white font-semibold text-sm bg-green-700 hover:bg-green-800 px-4 py-2 rounded"
              >
                <p>Lihat Statistik yang sudah ada</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">TF-IDF Analysis</h1>
            <p className="text-gray-600">
              Visualisasi dan analisis TF-IDF (Term Frequency  - Inverse Document Frequency) dari dataset chatbot
            </p>
          </div>
          <button
            onClick={HitungTFIDF}
            disabled={computing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            {computing ? ' Menghitung...' : ' Hitung Ulang'}
          </button>
        </div>

        
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'statistics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Statistik Global
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'statistics' && (
          <div className="space-y-6">
            {/* Global Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-600 mb-1">Total Dokumen</p>
                <p className="text-3xl font-bold text-blue-600">
                  {statistics.global_statistics.total_documents}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-600 mb-1">Total Kata</p>
                <p className="text-3xl font-bold text-green-600">
                  {statistics.global_statistics.total_words}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-600 mb-1">Ukuran Vocabulary</p>
                <p className="text-3xl font-bold text-purple-600">
                  {statistics.global_statistics.vocab_size}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-600 mb-1">Rata-rata Kata/Dok</p>
                <p className="text-3xl font-bold text-orange-600">
                  {statistics.global_statistics.avg_words_per_doc}
                </p>
              </div>
            </div>

            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                20 Kata dengan Kemunculan Tertinggi
              </h2>
            <ResponsiveContainer width="100%" height={400}>
  <BarChart data={statistics.global_statistics.most_common_words}>
    <CartesianGrid strokeDasharray="3 3" />
    
    <XAxis 
      dataKey="word" 
      angle={-45} 
      textAnchor="end" 
      height={100}
    />
    
    <YAxis />
    
    <Tooltip
      content={({ active, payload }) => {
        if (active && payload && payload.length) {
          const item = payload[0].payload;
          return (
            <div className="bg-white p-3 border border-gray-200 rounded shadow">
              <p className="font-semibold">{item.word}</p>
              <p className="text-sm text-blue-600">
                Frequency: {item.doc_frequency}
              </p>
              <p className="text-sm text-gray-600">
                IDF: {item.idf}
              </p>
            </div>
          );
        }
        return null;
      }}
    />

    <Legend />

    <Bar 
      dataKey="doc_frequency" 
      name="Document Frequency"
    />
  </BarChart>
</ResponsiveContainer>

            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Statistik TF-IDF Per Intent
              </h2>
              <div className="space-y-4">
                {statistics.intent_statistics.map((intent, idx) => (
                  <div 
                    key={idx} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-lg">{intent.intent}</h3>
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-600">
                          Docs: <span className="font-semibold text-gray-900">
                            {intent.total_documents}
                          </span>
                        </span>
                        <span className="text-gray-600">
                          Vocab: <span className="font-semibold text-gray-900">
                            {intent.vocab_size}
                          </span>
                        </span>
                        <span className="text-gray-600">
                          Avg TF-IDF: <span className="font-semibold text-blue-600">
                            {intent.avg_tfidf_score}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {intent.top_tfidf_words.map((word, wordIdx) => (
                        <div 
                          key={wordIdx} 
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded text-sm flex justify-between"
                        >
                          <span className="font-medium">{word.word}</span>
                          <div className="flex gap-2 text-xs">
                            <span 
                              className="text-blue-600 font-semibold" 
                              title="TF-IDF Score"
                            >
                              {word.tfidf_score}
                            </span>
                            <span 
                              className="text-gray-500" 
                              title="IDF Score"
                            >
                              (IDF: {word.idf_score})
                            </span>
                            <span 
                              className="text-green-600" 
                              title="Document Frequency"
                            >
                              [TF: {word.tf_score}]
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}