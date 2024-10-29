import { useRecoilState } from "recoil";
import { chatModalState } from "@/recoil/chatState";

const useModal = () => {
  const [isOpen, setIsOpen] = useRecoilState(chatModalState);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return { isOpen, openModal, closeModal };
};

export default useModal;
