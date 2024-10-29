import { useSetRecoilState } from "recoil";
import { chatModalState } from "@/recoil/chatState";

const FloatingButton = () => {
  const setChatModalOpen = useSetRecoilState(chatModalState);

  const handleClick = () => setChatModalOpen(true);

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-5 right-5 w-16 h-16 rounded-full bg-blue-500 text-white text-2xl shadow-lg hover:bg-blue-700 transition"
    >
      💬
    </button>
  );
};

export default FloatingButton;
