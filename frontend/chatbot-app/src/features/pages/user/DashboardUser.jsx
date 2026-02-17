import { useState } from "react";
import {useNavigate} from "react-router-dom"
import { MessageCircle, ExternalLink, ChevronLeft, ChevronRight, Info, GraduationCap } from "lucide-react";
export default function DashboardUser() {
  const carouselItems = [
    {
      title: "Chatbot Layanan Mahasiswa",
      text: "Dapatkan bantuan cepat untuk pertanyaan umum seputar akademik, administrasi, dan layanan kampus melalui chatbot kami"
    },
    {
      title: "Informasi Akademik",
      text: "Akses informasi lengkap mengenai jadwal kuliah, nilai, dan kalender akademik"
    },
    {
      title: "Layanan Administrasi",
      text: "Kelola berbagai keperluan administrasi seperti surat keterangan, pembayaran, dan dokumen lainnya"
    },
  ];
const navigate = useNavigate()
  const faculties = [
    {
      name: "Fakultas Teknologi Informasi",
      url: "https://fti.budiluhur.ac.id/",
      color: "bg-blue-300",
      hoverColor: "hover:bg-blue-500",
    },
    {
      name: "Fakultas Komunikasi dan Desain Kreatif",
      url: "https://fkdk.budiluhur.ac.id/",
      color: "bg-yellow-400",
      hoverColor: "hover:bg-yellow-600",
    },
    {
      name: "Fakultas Teknik",
      url: "https://ft.budiluhur.ac.id/",
      color: "bg-blue-700",
      hoverColor: "hover:bg-blue-500",
    },
    {
      name: "Fakultas Ekonomi dan Bisnis",
      url: "https://feb.budiluhur.ac.id/",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      name: "Fakultas Ilmu Sosial dan Studi Global",
      url: "https://fissig.budiluhur.ac.id/",
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
    },
  ];

  const handleLink = (url, blank) =>{
    blank ==true ? window.open(url, "_blank", "noopener,noreferrer") : window.location.href = url;
    
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h1 className="text-4xl font-bold text-blue-800">
              Portal Universitas Budi Luhur
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Akses cepat ke layanan dan informasi kampus</p>
        </div>

        {/* Carousel Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all hover:scale-110 shadow-md"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex-1 max-w-2xl">
              <div className="text-center py-8 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl min-h-[200px] flex flex-col justify-center transition-all duration-300">
                <div className="text-5xl mb-4">{carouselItems[currentIndex].icon}</div>
                <h2 className="text-2xl font-bold text-blue-800 mb-3">
                  {carouselItems[currentIndex].title}
                </h2>
                <p className="text-gray-700 text-lg">
                  {carouselItems[currentIndex].text}
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all hover:scale-110 shadow-md"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? "bg-blue-700 w-8" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-4 rounded-full">
            <GraduationCap size={32}/>

            </div>
            <div>
              <h2 className="text-2xl font-bold">Web Student Budi Luhur</h2>
              <p className="text-blue-100">Website informasi terkait mahasiswa </p>
            </div>
          </div>
          <p className="text-lg mb-4">
            Web student merupakan website untuk melihat informasi setiap mahasiswa
          </p>
          <button 
          onClick={()=>handleLink("https://student.budiluhur.ac.id/", true)}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105 shadow-md">
            Kunjungi Web Student
          </button>
        </div>
        {/* Chatbot Info Card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-4 rounded-full">
              <MessageCircle size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Chatbot Layanan Mahasiswa</h2>
              <p className="text-blue-100">Tersedia 24/7 untuk membantu Anda</p>
            </div>
          </div>
          <p className="text-lg mb-4">
            Chatbot kami siap membantu menjawab pertanyaan seputar layanan akademik, administrasi, 
            fasilitas kampus, dan informasi umum lainnya. Dapatkan respons cepat kapan saja!
          </p>
          <button 
          onClick={()=>navigate("/layanan")}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105 shadow-md"
          >
            Mulai Chat Sekarang
          </button>
        </div>

        {/* Faculties Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Info className="text-blue-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">
              Informasi Lengkap Per Fakultas
            </h2>
          </div>
          <p className="text-gray-600 mb-6">
            Untuk informasi lebih detail mengenai program studi, jadwal, dan layanan khusus fakultas, 
            silakan kunjungi website fakultas Anda:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {faculties.map((faculty, index) => (
              <a
                key={index}
                href={faculty.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${faculty.color} ${faculty.hoverColor} text-white p-5 rounded-xl shadow-md transition-all hover:scale-105 hover:shadow-xl group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{faculty.name}</h3>
                    <span className="text-sm text-white/80 flex items-center gap-1">
                      Kunjungi Website
                      <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
           Copyright @Lutfi Rizaldi Mahida - 2211501180
          </p>
        </div>
      </div>
    </div>
  );
}