import { useRecoilState } from "recoil";
import { chatModalState } from "@/recoil/chatState";

const ChatModal = () => {
  const [isOpen, setIsOpen] = useRecoilState(chatModalState);

  if (!isOpen) return null;

  const closeModal = () => setIsOpen(false);

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      {/*  채팅창 표시하며 뒷 배경 흐리게 */}

      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed right-5 bg-white w-96 h-[690px] p-5 rounded-3xl shadow-lg"
      >
        <header className="flex justify-between items-center">
          <h2 className="text-xl font-bold">채팅</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-800"
          >
            X
          </button>
        </header>
        <main>
          <ol>
            <li>
              <div className="mt-4">
                <p>여기에 채팅 내용을 표시합니다...</p>
                {/* 채팅 컴포넌트나 메시지 목록을 여기에 추가 */}
              </div>
            </li>
          </ol>
        </main>
      </div>
    </div>
  );
};

export default ChatModal;
