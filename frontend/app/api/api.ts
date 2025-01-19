import axios from "axios";

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
)

export const fetchTodo = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/todos"
    );
    return response;
  } catch (error) {
    throw new Error("Error fetching todos");
  }
}

export const createTodoMutation = async (data: {
  title: string;
  description: string;
}) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/todos",
      data
    );
    return response.data;
  } catch (error) {
    throw new Error("Error creating todo");
  }
}

export const todoUpdateMutation = async (data: {
  id: string;
  status: string;
}) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + `/todos/${data.id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error("Error updating todo status");
  }
}

export const fetchVerifyStatus = async (data: {
  id: string
}) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + `/todos/${data.id}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Error fetching todo status");
  }
}

export const deleteTodoMutation = async (data: {
  id: string
}) => {
  try {
    const response = await axios.delete(
      process.env.NEXT_PUBLIC_API_URL + `/todos/${data.id}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Error deleting todo");
  }
}

export const prioritizeTodoMutation = async () => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + `/todos/p/prioritize`
    );
    return response.data;
  } catch (error) {
    throw new Error("Error prioritizing todo");
  }
}

export const loginMutation = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/auth/login",
      data
    );
    return response.data;
  } catch (error) {
    throw new Error("Invalid email or password");
  }
};

export const signupMutation = async (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/auth/register",
      data
    );
    return response.data;
  } catch (error) {
    throw new Error("Error signing up");
  }
};

export const logoutMutation = async () => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/auth/logout"
    );
    return response.data;
  } catch (error) {
    throw new Error("Error logging out");
  }
};
