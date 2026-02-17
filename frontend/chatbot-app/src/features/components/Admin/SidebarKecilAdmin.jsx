import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Database,
  Cpu,
  BookType,
  Home,
  BrushCleaning,
  BriefcaseBusiness,
  LucideLibrary
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function SidebarAdminKecil() {
  const [openData, setOpenData] = useState(false);
  const { logout } = useAuth();

  return (
    <aside className="min-h-screen bg-blue-800 text-white flex flex-col p-4 w-full shadow-lg overflow-y-auto overflow-y z-1000">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-bold tracking-wide">Chatbot Admin</h1>
      </div>

      <hr className="border-blue-700 mb-4" />

      <ul className="flex flex-col gap-1">

        {/* Dashboard */}
        <li className="hover:bg-blue-600 rounded-md transition">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-md transition ${
                isActive ? "bg-blue-600 font-semibold" : ""
              }`
            }
          >
            <Home size={18} />
            <span>Dashboard</span>
          </NavLink>
        </li>

        {/* Slangwords */}
        <li className="hover:bg-blue-600 rounded-md transition">
          <NavLink
            to="slangwords"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-md transition ${
                isActive ? "bg-blue-600 font-semibold" : ""
              }`
            }
          >
            <LucideLibrary size={18} />
            <span>Slangwords</span>
          </NavLink>
        </li>

        {/* Stopwords */}
        <li className="hover:bg-blue-600 rounded-md transition">
          <NavLink
            to="stopwords"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-md transition ${
                isActive ? "bg-blue-600 font-semibold" : ""
              }`
            }
          >
            <BookType size={18} />
            <span>Stopwords</span>
          </NavLink>
        </li>

        {/* Dropdown Data */}
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
                <NavLink
                  to="intent"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-md transition ${
                      isActive ? "bg-blue-600 font-semibold" : ""
                    }`
                  }
                >
                  Tag
                </NavLink>
              </li>

              <li className="hover:bg-blue-600 rounded-md transition">
                <NavLink
                  to="pattern"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-md transition ${
                      isActive ? "bg-blue-600 font-semibold" : ""
                    }`
                  }
                >
                  Pattern
                </NavLink>
              </li>

              <li className="hover:bg-blue-600 rounded-md transition">
                <NavLink
                  to="response"
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-md transition ${
                      isActive ? "bg-blue-600 font-semibold" : ""
                    }`
                  }
                >
                  Response
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Preprocessing */}
        <li className="hover:bg-blue-600 rounded-md transition">
          <NavLink
            to="preprocessing"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-md transition ${
                isActive ? "bg-blue-600 font-semibold" : ""
              }`
            }
          >
            <BrushCleaning size={18} />
            <span>Preprocessing</span>
          </NavLink>
        </li>

        {/* TF-IDF */}
        <li className="hover:bg-blue-600 rounded-md transition">
          <NavLink
            to="tfidf"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-md transition ${
                isActive ? "bg-blue-600 font-semibold" : ""
              }`
            }
          >
            <BriefcaseBusiness size={18} />
            <span>TF-IDF</span>
          </NavLink>
        </li>

        {/* Training */}
        <li className="hover:bg-blue-600 rounded-md transition">
          <NavLink
            to="training"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-md transition ${
                isActive ? "bg-blue-600 font-semibold" : ""
              }`
            }
          >
            <Cpu size={18} />
            <span>Training</span>
          </NavLink>
        </li>

        {/* Logout */}
        <li className="hover:bg-blue-600 rounded-md transition">
          <button
            onClick={logout}
            className="w-full bg-red-600 px-2 py-4 rounded shadow cursor-pointer hover:bg-red-400"
          >
            Logout
          </button>
        </li>
      </ul>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-blue-700">
        <p className="text-xs text-blue-300 text-center">© 2025 Chatbot Admin</p>
      </div>
    </aside>
  );
}
