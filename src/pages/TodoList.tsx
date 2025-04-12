import { useState, useEffect, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdArrowBack, MdDragIndicator } from 'react-icons/md';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface SortableTaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  isSelected: boolean;
  isEditing: boolean;
  onUpdateText: (id: number, text: string) => void;
  onClick: () => void;
}

const SortableTaskItem = ({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  isSelected,
  isEditing,
  onUpdateText,
  onClick,
}: SortableTaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3 ${
        isSelected ? 'ring-2 ring-[#00E2AC]' : ''
      }`}
      onClick={onClick}
    >
      <button className="text-[#969AB8] cursor-grab" {...attributes} {...listeners}>
        <MdDragIndicator size={20} />
      </button>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        className="w-4 h-4 text-[#00E2AC] border-gray-300 rounded focus:ring-[#00E2AC]"
      />
      {isEditing ? (
        <input
          type="text"
          value={task.text}
          onChange={(e) => onUpdateText(task.id, e.target.value)}
          onBlur={() => onEdit(task.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onEdit(task.id);
            }
          }}
          className="flex-1 p-1 border-b border-[#E0E2E9] focus:outline-none focus:border-[#00E2AC] text-[#3A424A]"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 ${
            task.completed ? 'text-[#969AB8] line-through' : 'text-[#3A424A]'
          }`}
          onDoubleClick={() => onEdit(task.id)}
        >
          {task.text}
        </span>
      )}
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Delete
      </button>
    </div>
  );
};

const TodoList = () => {
  // const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const [title, setTitle] = useState(() => {
  //   return "Sample Todo List";
  // });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [completion, setCompletion] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Calculate completion percentage
  useEffect(() => {
    if (tasks.length === 0) {
      setCompletion(0);
      return;
    }
    const completedTasks = tasks.filter(task => task.completed).length;
    const percentage = Math.round((completedTasks / tasks.length) * 100);
    setCompletion(percentage);
  }, [tasks]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Add Task: Ctrl/Cmd + N
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setNewTaskText("");
        document.getElementById('new-task-input')?.focus();
      }

      if (selectedTaskId !== null) {
        const currentIndex = tasks.findIndex(task => task.id === selectedTaskId);
        
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            if (currentIndex > 0) {
              setSelectedTaskId(tasks[currentIndex - 1].id);
            }
            break;
          
          case 'ArrowDown':
            e.preventDefault();
            if (currentIndex < tasks.length - 1) {
              setSelectedTaskId(tasks[currentIndex + 1].id);
            }
            break;
          
          case ' ':
            e.preventDefault();
            toggleTaskCompletion(selectedTaskId);
            break;
          
          case 'e':
          case 'Enter':
            e.preventDefault();
            if (!editingTaskId) {
              setEditingTaskId(selectedTaskId);
            }
            break;
          
          case 'Delete':
            e.preventDefault();
            handleDeleteTask(selectedTaskId);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown as any);
    return () => window.removeEventListener('keydown', handleKeyDown as any);
  }, [selectedTaskId, tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: Math.max(0, ...tasks.map(t => t.id)) + 1,
      text: newTaskText.trim(),
      completed: false
    };

    setTasks([...tasks, newTask]);
    setNewTaskText("");
  };

  const handleUpdateTask = (taskId: number, newText: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, text: newText } : task
    ));
    setEditingTaskId(null);
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD]">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="text-[#3A424A] hover:text-[#00E2AC] transition-colors"
            >
              <MdArrowBack size={24} />
            </button>
            <h1 className="text-2xl font-semibold text-[#3A424A]">Sample Todo List</h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[#969AB8]">Overall Progress</span>
            <span className="text-sm font-medium text-[#3A424A]">{completion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#00E2AC] h-2 rounded-full transition-all duration-300"
              style={{ width: `${completion}%` }}
            ></div>
          </div>
        </div>

        {/* Add new task form */}
        <form onSubmit={handleAddTask} className="mb-6">
          <div className="flex gap-2">
            <input
              id="new-task-input"
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 p-3 border border-[#E0E2E9] rounded-lg focus:outline-none focus:border-[#00E2AC] text-[#3A424A]"
            />
            <button
              type="submit"
              className="bg-[#00E2AC] text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-[#00D0B9] transition-all duration-300"
            >
              <MdAdd className="text-xl" />
              <span>Add Task</span>
            </button>
          </div>
        </form>

        {/* Tasks list */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {tasks.map((task) => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleTaskCompletion}
                  onDelete={handleDeleteTask}
                  onEdit={setEditingTaskId}
                  isSelected={selectedTaskId === task.id}
                  isEditing={editingTaskId === task.id}
                  onUpdateText={handleUpdateTask}
                  onClick={() => setSelectedTaskId(task.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default TodoList;
