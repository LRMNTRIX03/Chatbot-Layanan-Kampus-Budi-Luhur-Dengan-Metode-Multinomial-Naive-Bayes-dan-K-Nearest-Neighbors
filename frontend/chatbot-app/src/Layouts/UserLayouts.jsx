
import { Outlet } from "react-router-dom";
import NavbarUser from "../features/components/User/NavbarUser";
import { useUserStore } from "../features/store/useUserStore";

export default function UserLayouts() {
   const { user } = useUserStore();
   console.log("User in UserLayouts:", user);
  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="navbar-container fixed w-full z-100">
        <NavbarUser user={user} />
      </div>

   
      <div className="flex flex-1 overflow-hidden md:mt-[12vh] mt-[18vh]">
        <main className="flex-1 bg-gray-100 p-6 overflow-y-visible">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
