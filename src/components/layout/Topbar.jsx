import { Search, Bell, MessageCircle, Moon } from "lucide-react";
import { useState,useRef,useEffect } from "react";



function Topbar({ darkMode, setDarkMode }) {
  // for notification dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  // for messages dropdown
  const [showMessages, setShowMessages] = useState(false);

  // to close dropdowns when clicking outside
  const messageRef = useRef(null);
  const notificationRef = useRef(null);

  // to close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setShowMessages(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`h-16 flex items-center justify-between px-6 
        
  ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}
`}
    >
      {/* LEFT: Search */}
      <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm w-72">
        <Search size={16} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search customers, projects, rep..."
          className="bg-transparent outline-none ml-2 w-full text-sm"
        />
      </div>

      {/* RIGHT: Icons + Profile */}
      <div className="flex items-center gap-4">
        {/* Messages */}
        <div className="relative" ref={messageRef}>
          <div
                      onClick={() => {
                          //   Toggle messages dropdown
                          //   If opening messages, ensure notifications dropdown is closed
                          //   same icon click to also close itself
                          
            setShowMessages((prev) => !prev);
            setShowNotifications(false);
            }}
            className="bg-white p-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
          >
            <MessageCircle size={18} />
          </div>

          {showMessages && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-3 z-50">
              <p className="text-sm font-semibold mb-2">Messages</p>
              <p className="text-sm text-gray-600">No new messages</p>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <div
                      onClick={() => {
                        //   Toggle notifications dropdown
                        //   If opening notifications, ensure messages dropdown is closed
                        //   same icon click to also close itself
                        setShowNotifications((prev) => !prev);
                        setShowMessages(false);
                      }}
            className="relative bg-white p-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </div>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-3 z-50">
              <p className="text-sm font-semibold mb-2">Notifications</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>New project assigned</li>
                <li>Task deadline today</li>
                <li>New message received</li>
              </ul>
            </div>
          )}
        </div>

        {/* Dark Mode */}
        <div
          onClick={() => setDarkMode(!darkMode)}
          className="bg-white p-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
        >
          <Moon size={18} />
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 min-w-[180px]">
          {/* Avatar */}
          <div className="w-9 h-9 bg-gray-300 rounded-full"></div>

          {/* User Info */}
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-gray-800">
              Admin Name
            </span>
            <span className="text-xs text-gray-500">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
