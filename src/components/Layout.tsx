import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="chat-area">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
