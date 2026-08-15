import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { canSeePath } from "./data/adminAccess";

const ADMIN_ROLES = ["admin", "superadmin", "manager", "sales", "editor"];

/** Protect /admin routes — requires admin JWT + role may view this path */
export default function RequireAuth({ children }) {
  const { token, user } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!token || !user || !ADMIN_ROLES.includes(user.role)) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!canSeePath(user.role, location.pathname.replace(/^\/jewel/, "") || "/")) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
