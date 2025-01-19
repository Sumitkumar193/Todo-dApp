import { useState } from "react";
import { LogOut, Plus, Loader } from "lucide-react";
import { useRecoilState } from "recoil";
import { useMutation } from "@tanstack/react-query";
import CreateTodoModal from "./CreateTodoModal";
import { userState } from "../states/User";
import { logoutMutation, prioritizeTodoMutation } from "../api/api";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [isPrioritizing, setIsPrioritizing] = useState(false);

  const LogoutMutation = useMutation({
    mutationFn: logoutMutation,
    onSuccess: () => {
      setUser({ name: "", email: "" });
    },
  });

  const priorityMutation = useMutation({
    mutationFn: prioritizeTodoMutation,
    onMutate: () => {
      setIsPrioritizing(true);
    },
    onSuccess: () => setIsPrioritizing(false),
    onError: () => setIsPrioritizing(false),
  });

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-[80%]">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Todo App</h1>
          <p className="text-sm text-gray-600">
            {user.name} ({user.email})
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => priorityMutation.mutate()}
            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300 flex items-center"
            disabled={isPrioritizing}
          >
            {isPrioritizing ? (
              <Loader size={18} className="mr-2 animate-spin" />
            ) : (
              <Plus size={18} className="mr-2" />
            )}
            Prioritize
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300 flex items-center"
          >
            <Plus size={18} className="mr-2" />
            New Todo
          </button>
          <button
            onClick={() => LogoutMutation.mutate()}
            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-300 flex items-center"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
      <CreateTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </header>
  );
}
