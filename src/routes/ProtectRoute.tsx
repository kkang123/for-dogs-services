import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { isLoggedInState, userState } from "@/recoil/userState";

interface ProtectRouteProps {
  element: React.ReactElement;
  isProtected?: boolean;
  isPrivate?: boolean;
  isPublic?: boolean;
}

export const ProtectRoute: React.FC<ProtectRouteProps> = ({
  element,
  isProtected = false,
  isPrivate = false,
  isPublic = false,
}) => {
  const navigate = useNavigate();
  const isAuth = useRecoilValue(isLoggedInState);
  const user = useRecoilValue(userState);
  const isSeller = user.userRole === "SELLER";

  useEffect(() => {
    if (isPrivate && !isAuth) {
      navigate("/login");
    } else if (isPrivate && isAuth && isProtected !== isSeller) {
      navigate("/");
    } else if (isPublic && isAuth) {
      navigate("/");
    }
  }, [isPrivate, isAuth, isSeller, isProtected, isPublic, navigate]);

  return element;
};
