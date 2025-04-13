import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdAdd, MdArrowBack, MdDragIndicator, MdDelete } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
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
import { ITask, ITaskList } from '../interfaces/Task';
import { ISortableTaskItemProps } from '../interfaces/Components';
import axiosInstance from '../services/api/axios';
import LoadingScreen from '../components/LoadingScreen';
import toast from 'react-hot-toast';

const SortableTaskItem = ({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  isSelected,
  isEditing,
  onUpdateText,
  onClick,
  isDeleting,
  isUpdating,
}: ISortableTaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task._id });

  const [editText, setEditText] = useState(task.text);

  useEffect(() => {
    setEditText(task.text);
  }, [task.text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent the event from bubbling up
    if (e.key === 'Enter') {
      e.preventDefault();
      onUpdateText(task._id, editText);
      onEdit(null); // Set editingTask_id to null
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditText(task.text);
      onEdit(null); // Set editingTask_id to null
    }
  };

  const handleBlur = () => {
    onUpdateText(task._id, editText);
    onEdit(null); // Set editingTask_id to null
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3 group ${isSelected ? 'ring-2 ring-[#00E2AC]' : ''
        }`}
      onClick={(e) => {
        // Only trigger onClick if we're not clicking the input or checkbox
        if (!(e.target as HTMLElement).closest('input')) {
          onClick();
        }
      }}
    >
      <button className="text-[#969AB8] cursor-grab" {...attributes} {...listeners}>
        <MdDragIndicator size={20} />
      </button>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => {
          e.stopPropagation();
          onToggleComplete(task._id);
        }}
        disabled={isUpdating}
        className="w-4 h-4 text-[#00E2AC] border-gray-300 rounded focus:ring-[#00E2AC] disabled:opacity-50"
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 p-1 border-b border-[#E0E2E9] focus:outline-none focus:border-[#00E2AC] text-[#3A424A]"
          autoFocus
          disabled={isUpdating}
        />
      ) : (
        <div className="flex-1 flex items-center">
          <span
            className={`flex-1 ${task.completed ? 'text-[#969AB8] line-through' : 'text-[#3A424A]'}`}
            onDoubleClick={() => onEdit(task._id)}
          >
            {task.text}
          </span>
          {isUpdating && (
            <AiOutlineLoading3Quarters className="animate-spin ml-2 text-gray-400" size={16} />
          )}
        </div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task._id);
        }}
        disabled={isDeleting}
        className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-full disabled:opacity-50"
      >
        {isDeleting ? (
          <AiOutlineLoading3Quarters className="animate-spin" size={20} />
        ) : (
          <MdDelete size={20} />
        )}
      </button>
    </div>
  );
};

const TodoList = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [selectedTask_id, setSelectedTask_id] = useState<number | null>(null);
  const [editingTask_id, setEditingTask_id] = useState<number | null>(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState<ITaskList | null>(null);
  const [deletingTasks, setDeletingTasks] = useState<number[]>([]);
  const [updatingTasks, setUpdatingTasks] = useState<number[]>([]);
  const [addingTask, setAddingTask] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // Don't handle keyboard shortcuts if we're editing or if target is an input
      if (editingTask_id !== null || (e.target as HTMLElement).tagName === 'INPUT') {
        return;
      }

      if (selectedTask_id !== null) {
        const currentIndex = tasks.findIndex(task => task._id === selectedTask_id);

        switch (e.key.toLowerCase()) {  // Make key matching case insensitive
          case 'arrowup':
            e.preventDefault();
            if (currentIndex > 0) {
              setSelectedTask_id(tasks[currentIndex - 1]._id);
            }
            break;

          case 'arrowdown':
            e.preventDefault();
            if (currentIndex < tasks.length - 1) {
              setSelectedTask_id(tasks[currentIndex + 1]._id);
            }
            break;

          case ' ':
            e.preventDefault();
            toggleTaskCompletion(selectedTask_id);
            break;

          case 'e':
          case 'enter':
            e.preventDefault();
            setEditingTask_id(selectedTask_id);
            break;

          case 'delete':
            e.preventDefault();
            handleDeleteTask(selectedTask_id);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedTask_id, tasks, editingTask_id]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    setAddingTask(true);
    const body = {
      text: newTaskText.trim(),
    }
    axiosInstance.post<{ list: ITaskList }>(`/api/todos/${id}/tasks`, body)
      .then((res) => {
        console.log(res.data);
        toast.success('Task added successfully', {
          duration: 2000,
          position: 'top-center',
        });
        setNewTaskText('');
        getListTasks();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.msg || 'Failed to add task', {
          duration: 2000,
          position: 'top-center',
        });
      })
      .finally(() => {
        setAddingTask(false);
      });
  };

  const handleUpdateTask = (task_id: number, newText: string) => {
    setUpdatingTasks(prev => [...prev, task_id]);
    const body = {
      text: newText.trim(),
    }
    axiosInstance.put(`/api/todos/${id}/tasks/${task_id}`, body)
      .then((res) => {
        console.log(res.data);
        toast.success('Task updated successfully', {
          duration: 2000,
          position: 'top-center',
        });
        getListTasks();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.msg || 'Failed to update task', {
          duration: 2000,
          position: 'top-center',
        });
      })
      .finally(() => {
        setUpdatingTasks(prev => prev.filter(id => id !== task_id));
      });
  };

  const toggleTaskCompletion = (task_id: number) => {
    setUpdatingTasks(prev => [...prev, task_id]);
    axiosInstance.patch(`/api/todos/${id}/tasks/${task_id}/complete`)
      .then((res) => {
        console.log(res.data);
        toast.success('Task completion toggled', {
          duration: 2000,
          position: 'top-center',
        });
        getListTasks();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.msg || 'Failed to toggle task completion', {
          duration: 2000,
          position: 'top-center',
        });
      })
      .finally(() => {
        setUpdatingTasks(prev => prev.filter(id => id !== task_id));
      });
  };
  
  const handleDeleteTask = (task_id: number) => {
    setDeletingTasks(prev => [...prev, task_id]);
    axiosInstance.delete(`/api/todos/${id}/tasks/${task_id}`)
      .then((res) => {
        console.log(res.data);
        toast.success('Task deleted successfully', {
          duration: 2000,
          position: 'top-center',
        });
        getListTasks();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.msg || 'Failed to delete task', {
          duration: 2000,
          position: 'top-center',
        });
      })
      .finally(() => {
        setDeletingTasks(prev => prev.filter(id => id !== task_id));
      });

    // Clear selection if deleted task was selected
    if (selectedTask_id === task_id) {
      setSelectedTask_id(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Update UI optimistically
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        const reorderedTasks = arrayMove(items, oldIndex, newIndex);
        
        // Send update to backend
        const taskIds = reorderedTasks.map(task => task._id.toString());
        
        axiosInstance.put<{ list: ITaskList }>(`/api/todos/${id}/reorder`, { taskIds })
          .then((res) => {
            console.log(res.data);
            toast.success('Tasks reordered successfully', {
              duration: 2000,
              position: 'top-center',
            });
            // Update the list data with the response
            if (res.data.list) {
              setListData(res.data.list);
            }
          })
          .catch((err) => {
            console.log(err);
            // Revert to original order on error
            setTasks(items);
            toast.error(err.response?.data?.msg || 'Failed to reorder tasks', {
              duration: 2000,
              position: 'top-center',
            });
          });

        return reorderedTasks;
      });
    }
  };

  const getListTasks = () => {
    setLoading(true);
    axiosInstance.get<{ list: ITaskList }>(`/api/todos/${id}`)
      .then((res) => {
        console.log(res.data);
        setListData(res.data?.list);
        setTasks(res.data?.list?.tasks || []);
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getListTasks();
  }, []);

  if (loading) return <LoadingScreen />;

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
            <h1 className="text-2xl font-semibold text-[#3A424A]">{listData?.title}</h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[#969AB8]">Overall Progress</span>
            <span className="text-sm font-medium text-[#3A424A]">{listData?.completionPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#00E2AC] h-2 rounded-full transition-all duration-300"
              style={{ width: `${listData?.completionPercentage.toFixed(1)}%` }}
            ></div>
          </div>
        </div>

        {/* Keyboard Shortcuts Guide */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#3A424A] mb-3">Keyboard Shortcuts</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[#969AB8]">Navigate Tasks</span>
                <span className="text-[#3A424A] font-medium">↑/↓ Arrow Keys</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[#969AB8]">Mark as Complete</span>
                <span className="text-[#3A424A] font-medium">Space</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[#969AB8]">Edit Task</span>
                <span className="text-[#3A424A] font-medium">E or Enter</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[#969AB8]">Delete Task</span>
                <span className="text-[#3A424A] font-medium">Delete</span>
              </div>
            </div>
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
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E2AC] focus:border-transparent"
              disabled={addingTask}
            />
            <button
              type="submit"
              disabled={addingTask}
              className="bg-[#00E2AC] text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-[#00D0B9] transition-all duration-300 disabled:opacity-50"
            >
              {addingTask ? (
                <AiOutlineLoading3Quarters className="animate-spin text-xl" />
              ) : (
                <>
                  <MdAdd className="text-xl" />
                  <span>Add Task</span>
                </>
              )}
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
            items={tasks.map(t => t._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {tasks.map((task) => (
                <SortableTaskItem
                  key={task._id}
                  task={task}
                  onToggleComplete={toggleTaskCompletion}
                  onDelete={handleDeleteTask}
                  onEdit={setEditingTask_id}
                  isSelected={selectedTask_id === task._id}
                  isEditing={editingTask_id === task._id}
                  onUpdateText={handleUpdateTask}
                  onClick={() => setSelectedTask_id(task._id)}
                  isDeleting={deletingTasks.includes(task._id)}
                  isUpdating={updatingTasks.includes(task._id)}
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
