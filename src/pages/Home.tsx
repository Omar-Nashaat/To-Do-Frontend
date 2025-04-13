import { useEffect, useState } from 'react';
import { MdAdd, MdLogout, MdClose, MdEdit, MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { ITodo } from '../interfaces/Todo';
import { jwtDecode } from 'jwt-decode';
import { IJwtCustomPayload } from '../interfaces/Auth';
import axiosInstance from '../services/api/axios';
import { ClipLoader } from 'react-spinners';
import LoadingScreen from '../components/LoadingScreen';
import EmptyAnimation from '../components/EmptyAnimation';

const Home = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [editingTodo, setEditingTodo] = useState<ITodo | null>(null);
  const [todoTitle, setTodoTitle] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [savingTodo, setSavingTodo] = useState(false);
  const [numberOfLists, setNumberOfLists] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const userToken = localStorage.getItem("token");
  const decodedToken = userToken ? jwtDecode<IJwtCustomPayload>(userToken) : null;

  const handleSignOut = () => {
    localStorage.removeItem("token")
    navigate('/login');
  };

  const handleOpenModal = (todo?: ITodo) => {
    if (todo) {
      setEditingTodo(todo);
      setTodoTitle(todo.title);
    } else {
      setEditingTodo(null);
      setTodoTitle("");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTodo(null);
    setTodoTitle("");
  };

  const handleSaveTodo = () => {
    if (!todoTitle.trim()) return;
    setSavingTodo(true);

    if (editingTodo) {
      axiosInstance.put(`/api/todos/${editingTodo._id}`, { title: todoTitle })
        .then(() => {
          getAllTodos();
          handleCloseModal();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setSavingTodo(false);
        });
    } else {
      axiosInstance.post(`/api/todos`, { title: todoTitle })
        .then(() => {
          getAllTodos();
          handleCloseModal();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setSavingTodo(false);
        });
    }
  };

  const handleDeleteTodo = (id: string) => {
    setDeletingId(id);
    axiosInstance.delete(`/api/todos/${id}`)
      .then(() => {
        getAllTodos();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setDeletingId(null);
      });
  };

  const getAllTodos = () => {
    setPageLoading(true);
    axiosInstance.get(`/api/todos`)
      .then((res) => {
        setTodos(res.data.Lists);
        setNumberOfLists(res.data.NoOfLists);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setPageLoading(false);
      });
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  if (pageLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD]">
      {/* Header with user badge */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-[#3A424A]">My Todo Lists</h1>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-[#F8F9FD] px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-300"
              >
                <div className="w-8 h-8 bg-[#00E2AC] rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{decodedToken?.user.name.charAt(0)}</span>
                </div>
                <span className="text-[#3A424A] font-medium">{decodedToken?.user.name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  >
                    <MdLogout className="mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create new todo button */}
        <button
          onClick={() => handleOpenModal()}
          className="mb-8 bg-[#00E2AC] text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-[#00D0B9] transition-all duration-300"
        >
          <MdAdd className="text-xl" />
          <span>Create New Todo List</span>
        </button>
        {/* Todo lists grid */}
        {numberOfLists !== 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow duration-300"
              onClick={() => navigate(`/todo/${todo._id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-[#3A424A]">{todo.title}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(todo);
                    }}
                    className="text-gray-400 hover:text-[#00E2AC] transition-colors"
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTodo(todo._id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors flex items-center"
                    disabled={deletingId === todo._id}
                  >
                    {deletingId === todo._id ? (
                      <ClipLoader color="#FF4D4D" size={16} />
                    ) : (
                      <MdDelete size={20} />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#969AB8]">Completion</span>
                  <span className="text-sm font-medium text-[#3A424A]">{todo.completionPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#00E2AC] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${todo.completionPercentage.toFixed(1)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div> : <EmptyAnimation
          title="No Todo Lists Yet!"
          description="Click the 'Create New List' button to get started"
        />}
      </div>

      {/* Modal for creating/editing todo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#3A424A]">
                {editingTodo ? 'Edit Todo List' : 'Create New Todo List'}
              </h2>
              <button onClick={handleCloseModal}>
                <MdClose size={24} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="todo-title" className="block text-sm font-medium text-[#3A424A] mb-1">
                  Title
                </label>
                <input
                  id="todo-title"
                  type="text"
                  value={todoTitle}
                  onChange={(e) => setTodoTitle(e.target.value)}
                  placeholder="Enter todo list title"
                  className="w-full p-3 border border-[#E0E2E9] rounded-lg focus:outline-none focus:border-[#00E2AC] text-[#3A424A]"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-[#3A424A] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTodo}
                disabled={savingTodo || !todoTitle.trim()}
                className="px-4 py-2 bg-[#00E2AC] text-white rounded-lg hover:bg-[#00D0B9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <span>{editingTodo ? 'Save Changes' : 'Create List'}</span>
                {savingTodo && (
                  <ClipLoader color="#FFFFFF" size={16} className="ml-2" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
