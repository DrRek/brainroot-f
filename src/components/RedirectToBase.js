import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectToBase = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/brainroot-f");
    }
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default RedirectToBase;
