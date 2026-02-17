import NavbarAdmin from "../features/components/Admin/NavbarAdmin";
import SidebarAdmin from "../features/components/Admin/SidebarAdmin";
import SidebarAdminKecil from "../features/components/Admin/SidebarKecilAdmin";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function AdminLayouts() {
  const [toggleSidebar, setToggleSidebar] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full">
      
      <div className="fixed w-full z-50">
        <NavbarAdmin toggleSidebar={() => setToggleSidebar(!toggleSidebar)} />
      </div>

      <div className="flex flex-1 pt-[8vh]">
      
        <aside className="hidden md:flex w-64 bg-blue-800 text-white h-screen fixed top-[5vh] left-0 overflow-y-auto overflow-y-hidden">
          <SidebarAdmin  />
        </aside>

   
        {toggleSidebar && (
          <>

            <aside className="fixed top-[10vh] left-0 w-[100%] sm:w-[50%] bg-blue-800 text-white h-[92vh] z-50 transition-transform duration-300 md:hidden overflow-y-auto overflow-y-hidden">
              <SidebarAdminKecil />
            </aside>
          </>
        )}

    
        <main className="flex-1 bg-gray-100 p-6 md:ml-64 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
