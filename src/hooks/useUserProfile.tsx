import { useState, useEffect, useRef } from "react";

import { basicAxios } from "@/api/axios";
import { UserDetails } from "@/interface/userDetail";

function useUserProfile() {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedProfile = useRef(false);

  const fetchUserProfile = async () => {
    if (hasFetchedProfile.current) return;

    try {
      const response = await basicAxios.get("/users/profile");
      setUser(response.data.result);
      hasFetchedProfile.current = true;
    } catch (err) {
      setError("유저 프로필 불러오기 실패");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return { user, error };
}

export default useUserProfile;
