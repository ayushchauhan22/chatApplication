import { useEffect } from "react";
import { getUsersByName } from "@/services/userServices"; // ← was chatRequestServices
import { getOutgoingRequests } from "@/services/chatRequestServices";
import { userAuthStore } from "@/store/auth/authStore";
import { useUserStore } from "@/store/users/userStore";
import useDebounce from "@/hooks/useDebounce";

function usePublicUsers(searchName: string) {
  const { user } = userAuthStore();
  const { setUsers, setOutgoingRequests } = useUserStore();
  const debouncedName = useDebounce(searchName);

  useEffect(() => {
    if (!debouncedName || debouncedName.trim() === "") {
      setUsers([]);
      return;
    }

    const fetchData = async () => {
      try {
        const usersData = await getUsersByName(debouncedName);
        const requestsData = await getOutgoingRequests(String(user?._id));
        setUsers(usersData);
        setOutgoingRequests(requestsData);
      } catch (err) {
        console.log(err);
      }
    };

    if (user?._id) fetchData();
  }, [debouncedName, user?._id]);
}

export default usePublicUsers;
