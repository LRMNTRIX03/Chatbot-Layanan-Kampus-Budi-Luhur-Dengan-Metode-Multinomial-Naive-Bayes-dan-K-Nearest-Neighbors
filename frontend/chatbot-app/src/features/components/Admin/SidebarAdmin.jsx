import { useState } from "react";
import { ChevronDown, ChevronUp, Database, LogOut, Cpu, BookType, Home, BrushCleaning, BriefcaseBusiness, LucideLibrary, History } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function SidebarAdmin() {
  const [openData, setOpenData] = useState(false);
  const {logout} = useAuth();

  return (
    <aside className="min-h-screen bg-blue-800 text-white flex flex-col p-4 w-full shadow-lg overflow-y-auto overflow-y mt-5 z-1000">
      <div className="flex items-center gap-3 mb-6">
    
        <h1 className="text-xl font-bold tracking-wide">Chatbot Admin</h1>
      </div>

      <hr className="border-blue-700 mb-4" />

      
      <ul className="flex flex-col gap-1">
        <li className="hover:bg-blue-600 rounded-md transition">
         <NavLink
  to="/admin/dashboard"
  className={({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-md transition ${
      isActive ? "bg-blue-600 font-semibold" : "hover:bg-blue-600"
    }`
  }
>
  <Home size={18} />
  <span>Dashboard</span>
</NavLink>
        </li>
          
        <li className="hover:bg-blue-600 rounded-md transition">
         <NavLink
  to="slangwords"
  className={({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-md transition ${
      isActive ? "bg-blue-600 font-semibold" : "hover:bg-blue-600"
    }`
  }
>
  <LucideLibrary size={18} />
  <span>Slangwords</span>
</NavLink>
        </li>

        <li className="hover:bg-blue-600 rounded-md transition">
         <NavLink
  to="stopwords"
  className={({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-md transition ${
      isActive ? "bg-blue-600 font-semibold" : "hover:bg-blue-600"
    }`
  }
>
  <BookType size={18} />
  <span>Stopwords</span>
</NavLink>
        </li>
        
        <li>
          <button
            onClick={() => setOpenData(!openData)}
            className="w-full flex items-center justify-between p-3 hover:bg-blue-600 rounded-md transition"
          >
            <div className="flex items-center gap-3">
              <Database size={18} />
              <span>Data</span>
            </div>
            {openData ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {openData && (
            <ul className="pl-10 flex flex-col gap-1 mt-1">
              <li className="hover:bg-blue-600 rounded-md transition">
                <NavLink to="intent" className={({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-md transition ${
      isActive ? "bg-blue-600 font-semibold" : "hover:bg-blue-600"
    }`
  }
  end={false}>
                Tag
                </NavLink>
              </li>
              <li className="hover:bg-blue-600 rounded-md transition">
                <NavLink to="pattern" className={({isActive})=> `flex items-center gap-3 p-3 rounded-md transition ${
      isActive ? "bg-blue-600 font-semibold" : "hover:bg-blue-600"
    }`
                  
                  }>Pattern</NavLink>
              </li>
              <li className="hover:bg-blue-600 rounded-md transition">
                <NavLink to="response" className={({isActive})=>(
                  `flex items-center gap-3 p-3 rounded-md transition ${
      isActive ? "bg-blue-600 font-semibold" : "hover:bg-blue-600"
    }`
                )}>Response</NavLink>
              </li>
            </ul>
          )}
        </li>
         <li className="hover:bg-blue-600 rounded-md transition">
          <NavLink to="preprocessing" 
          
          className={({isActive})=>(
            `flex items-center gap-3 p-3 rounded-md transition ${
      isActive ? "bg-blue-600 font-semibold" : "hover:bg-blue-600"
    }`
          )}>
            <BrushCleaning size={18} />
            <span>Preprocessing</span>
          </NavLink>
        </li>
         <li className="hover:bg-blue-600 rounded-md transition">
          <NavLink to="tfidf" 
          
          className={({isActive})=>(
            `flex items-center gap-3 p-3 rounded-md transition ${
      isActive ? "bg-blue-600 font-semibold" : "hover:bg-blue-600"
    }`
          )}>
            <BriefcaseBusiness size={18} />
            <span>TF-IDF</span>
          </NavLink>
        </li>

        <li className="hover:bg-blue-600 rounded-md transition">
          <NavLink to="training" className={({isActive})=>`flex items-center gap-3 p-3 rounded-md transition ${
      isActive ? "bg-blue-600 font-semibold" : "hover:bg-blue-600"
    }`
                }>
            <Cpu size={18} />
            <span>Training</span>
          </NavLink>
        </li>
                <li className="hover:bg-blue-600 rounded-md transition">
          <NavLink to="riwayat" className={({isActive})=>`flex items-center gap-3 p-3 rounded-md transition ${
      isActive ? "bg-blue-600 font-semibold" : "hover:bg-blue-600"
    }`
                }>
            <History size={18} />
            <span>Riwayat Training</span>
          </NavLink>
        </li>


          <li className="hover:bg-blue-600 rounded-md transition">
            
            <button onClick={logout} className="w-full bg-red-600 px-2 py-4 rounded shadow cursor-pointer hover:bg-red-700 flex items-center gap-3 justify-center">
              <LogOut size={18} />
              Logout
              </button>

        </li>
      </ul>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-blue-700">
        <p className="text-xs text-blue-400 text-center">© 2025 Chatbot Admin</p>
      </div>
    </aside>
  );
}
