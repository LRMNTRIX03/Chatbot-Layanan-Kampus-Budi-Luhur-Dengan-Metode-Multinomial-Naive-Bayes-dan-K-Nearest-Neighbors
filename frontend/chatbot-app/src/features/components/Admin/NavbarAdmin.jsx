export default function NavbarAdmin({ toggleSidebar }) {
  return (
    <nav className="grid grid-cols-2 bg-blue-400 p-5">
      <div className="item-container flex gap-3">
        <button
          className="p-2 bg-blue-500 hover:bg-blue-700 transition rounded-md flex items-center justify-center md:hidden"
          onClick={toggleSidebar} 
        >
          <svg
            className="w-6 h-6 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1 className="text-white font-bold">Chatbot Admin</h1>
      </div>
    </nav>
  );
}
