import { useState } from 'react';
import { MdAdd, MdLogout, MdClose, MdEdit, MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface Todo {
  id: number;
  title: string;
  completion: number;
}

const Home = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: "Complete Project Documentation", completion: 75 },
    { id: 2, title: "Review Team Tasks", completion: 30 },
    { id: 3, title: "Update Client Meeting Notes", completion: 100 },
  ]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoCompletion, setTodoCompletion] = useState(0);
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Add sign out logic here
    navigate('/login');
  };

  const handleOpenModal = (todo?: Todo) => {
    if (todo) {
      setEditingTodo(todo);
      setTodoTitle(todo.title);
      setTodoCompletion(todo.completion);
    } else {
      setEditingTodo(null);
      setTodoTitle("");
      setTodoCompletion(0);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTodo(null);
    setTodoTitle("");
    setTodoCompletion(0);
  };

  const handleSaveTodo = () => {
    if (!todoTitle.trim()) return;

    if (editingTodo) {
      // Edit existing todo
      setTodos(todos.map(todo => 
        todo.id === editingTodo.id 
          ? { ...todo, title: todoTitle.trim(), completion: todoCompletion } 
          : todo
      ));
    } else {
      // Create new todo
      const newTodo: Todo = {
        id: Math.max(0, ...todos.map(t => t.id)) + 1,
        title: todoTitle.trim(),
        completion: todoCompletion,
      };
      setTodos([...todos, newTodo]);
    }
    handleCloseModal();
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleCompletionChange = (value: string) => {
    const completion = Math.min(100, Math.max(0, Number(value) || 0));
    setTodoCompletion(completion);
  };

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
                  <span className="text-white font-medium">JD</span>
                </div>
                <span className="text-[#3A424A] font-medium">John Doe</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todos.map((todo) => (
            <div 
              key={todo.id} 
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow duration-300"
              onClick={() => navigate(`/todo/${todo.id}`)}
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
                      handleDeleteTodo(todo.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#969AB8]">Completion</span>
                  <span className="text-sm font-medium text-[#3A424A]">{todo.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#00E2AC] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${todo.completion}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for creating/editing todo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#3A424A]">
                {editingTodo ? 'Edit Todo List' : 'Create New Todo List'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose size={24} />
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
              <div>
                <label htmlFor="todo-completion" className="block text-sm font-medium text-[#3A424A] mb-1">
                  Completion Percentage
                </label>
                <input
                  id="todo-completion"
                  type="number"
                  min="0"
                  max="100"
                  value={todoCompletion}
                  onChange={(e) => handleCompletionChange(e.target.value)}
                  placeholder="Enter completion percentage"
                  className="w-full p-3 border border-[#E0E2E9] rounded-lg focus:outline-none focus:border-[#00E2AC] text-[#3A424A]"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-[#969AB8] hover:text-[#3A424A] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTodo}
                className="px-4 py-2 bg-[#00E2AC] text-white rounded-lg hover:bg-[#00D0B9] transition-colors"
              >
                {editingTodo ? 'Save Changes' : 'Create List'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
