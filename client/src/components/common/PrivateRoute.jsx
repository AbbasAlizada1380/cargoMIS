import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { signOutSuccess } from "../../state/userSlice/userSlice";

export function getTokenExpiration(token) {
  if (!token) return null;

  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload.exp ? payload.exp * 1000 : null;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

export default function PrivateRoute() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.user);

  if (!accessToken) {
    return <Navigate to="/sign-in" replace />;
  }

  const expiresAtMs = getTokenExpiration(accessToken);
  const now = Date.now();

  // If expired → logout immediately
  if (!expiresAtMs || now >= expiresAtMs) {
    dispatch(signOutSuccess());
    return <Navigate to="/sign-in" replace />;
  }

  // AUTO LOGOUT WHEN TIME REACHES EXPIRATION
  useEffect(() => {
    const timeLeft = expiresAtMs - now;

    const timer = setTimeout(() => {
      dispatch(signOutSuccess());
      window.location.href = "/sign-in"; // force redirect without refresh
    }, timeLeft);

    return () => clearTimeout(timer);
  }, [dispatch, expiresAtMs]);

  return <Outlet />;
}
