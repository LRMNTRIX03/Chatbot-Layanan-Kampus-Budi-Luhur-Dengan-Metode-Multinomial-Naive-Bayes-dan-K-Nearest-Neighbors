import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function NavbarUser({user}) {
    const {logout} = useAuth();
    
    
    const handleSelect = async(e) => {
      const value = e.target.value;
      if (value === "logout") {
        const res = await logout();
        return res;

      }
    };
  return (
    <nav className="w-full flex items-center justify-between bg-blue-400 p-5 shadow-md">
        <div className="flex items-center gap-3">
            <img src="src/assets/img/logo-bl.png" alt="" className="w-[75px]" />
         <div className="font-semibold text-lg text-white">Universitas Budi Luhur</div>
        </div>
     

      <ul className="flex gap-6 text-white font-medium">
        <NavLink
  to="/dashboard"
  className={({ isActive }) =>
    `hover:text-blue-200 hover:bg-blue-500 p-3 rounded cursor-pointer ${
      isActive ? 'bg-blue-500' : ''
    }`
  }
>
  Home
</NavLink>
        <NavLink to="/layanan" 
        className={({isActive})=>`hover:text-blue-200  hover:bg-blue-500 p-3 rounded cursor-pointer ${isActive ? 'bg-blue-500' : ''}`}>
          Layanan
          </NavLink>
       <select
      name="userControl"
      id="userControl"
      onChange={handleSelect}
      className="hover:text-blue-200 hover:bg-blue-500 rounded p-3 cursor-pointer bg-blue-400 text-white"
    >
      <option value="hello">Hello, {user.name}</option>
      <option value="logout" className="bg-white text-black">
        Logout
      </option>
    </select>
      </ul>
    </nav>
  );
}
