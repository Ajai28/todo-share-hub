
import { useState } from 'react';
import Header from './Header';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const { tasks } = useTask();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         task.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'todo').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-yellow-600 rounded-lg"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-red-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-red-600 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TaskFilters filters={filters} onFiltersChange={setFilters} />
          <Button
            onClick={() => setShowTaskForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <TaskList 
            tasks={filteredTasks} 
            onEditTask={handleEditTask}
          />
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <TaskForm
            task={editingTask}
            onClose={handleCloseForm}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
