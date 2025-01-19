import { use, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { RefreshCw } from "lucide-react";
import {
  fetchTodo,
  todoUpdateMutation,
  deleteTodoMutation,
  fetchVerifyStatus,
} from "../api/api";
import { isLoggedInState } from "../states/User";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import WebSocket from "../socket/Socket";

interface Todo {
  id: string;
  title: string;
  description: string;
  status: string;
  user: {
    name: string;
    email: string;
  };
}

export default function TodoList() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [updatingId, setUpdatingId] = useState<Record<string, boolean>>({});
  const [verifyingId, setVerifyingId] = useState<Record<string, boolean>>({});

  const {
    data: todos,
    isFetched,
    refetch,
  } = useQuery({
    queryKey: ["todos", page],
    queryFn: fetchTodo,
    enabled: isLoggedIn,
    select: (data) => data.data.data.todos,
    gcTime: 60 * 60 * 24 * 1000,
    staleTime: 60 * 60 * 24 * 1000,
  });

  const UpdateTodo = useMutation({
    mutationFn: todoUpdateMutation,
    onSuccess: () => {
      const loadingToast = toast.loading("Updating status...");
      refetch();
      toast.dismiss(loadingToast);
    },
  });

  const DeleteTodo = useMutation({
    mutationFn: deleteTodoMutation,
    onSuccess: () => {
      setDeleteId(null);
      const loadingToast = toast.loading("Deleting todo...");
      refetch();
      setIsModalVisible(false);
      toast.dismiss(loadingToast);
    },
  });

  const VerifyTodo = useMutation({
    mutationFn: fetchVerifyStatus,
    onSuccess: (data) => {
      toast.success(`Todo is ${data.data.status}`);
    },
  });

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId !== null) {
      DeleteTodo.mutate({ id: deleteId });
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
    setIsModalVisible(false);
  };

  const handleUpdateStatus = (id: string, status: string) => {
    setUpdatingId({ ...updatingId, [id]: true });
    UpdateTodo.mutate({ id, status });
    setUpdatingId({ ...updatingId, [id]: false });
  };

  const handleVerifyStatus = (id: string) => {
    setVerifyingId({ ...verifyingId, [id]: true });
    VerifyTodo.mutate({ id });
    setVerifyingId({ ...verifyingId, [id]: false });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    WebSocket.on("refetchTodo", () => {
      console.log("Refetching todo...");  
      const loadingToast = toast.loading("Fetching new todo...");
      refetch()
      toast.dismiss(loadingToast);
    });
  }, [WebSocket]);

  return (
    <div className="container mx-auto p-4 max-w-[80%]">
      <h1 className="text-3xl font-bold mb-8 text-center">Todo List</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isFetched &&
          todos.map((todo: Todo) => (
            <div
              key={todo.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{todo.title}</h2>
                <p className="text-gray-600 mb-4">{todo.description}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Created by: {todo.user.name}
                </p>
                <div className="flex justify-between items-center">
                  <select
                    value={todo.status}
                    onChange={(e) =>
                      handleUpdateStatus(todo.id, e.target.value)
                    }
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                      todo.status
                    )} transition-colors duration-300 ease-in-out`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleVerifyStatus(todo.id)}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                      disabled={verifyingId[todo.id]}
                    >
                      <RefreshCw
                        size={18}
                        className={`${
                          verifyingId[todo.id] ? "animate-spin" : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(todo.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors duration-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <DeleteConfirmationModal
        isVisible={isModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
