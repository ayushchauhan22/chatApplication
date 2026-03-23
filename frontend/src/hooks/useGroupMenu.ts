import { useRef, useState, useEffect } from "react";
import { useConversationActions } from "@/hooks/useConversationActions";

export const useGroupMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<"add" | "remove" | null>(null);
  const [targetUserId, setTargetUserId] = useState("");
const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    searchByName,
    addUser,
    removeUser,
    foundUser,
    searching,
    searchError,
    loading,
    reset,
    notInList
  } = useConversationActions();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCloseModal = () => {
    setModal(null);
    setSearchQuery("");
    setTargetUserId("");
    reset();
  };

  const handleConfirm = async () => {
    if (modal === "add") await addUser();
    if (modal === "remove") await removeUser(targetUserId);
    handleCloseModal();
  };

  return {
    menuOpen,
    setMenuOpen,
    menuRef,
    modal,
    setModal,
    searchQuery,
    setSearchQuery,
    targetUserId,
    setTargetUserId,
    handleCloseModal,
    handleConfirm,
    searchByName,
    foundUser,
    searching,
    searchError,
    loading,
    reset,
    notInList
  };
};
