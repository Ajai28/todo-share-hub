
import { useState } from 'react';
import { useTask, Task } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Share2, 
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle
} from 'lucide-react';
import ShareTaskModal from './ShareTaskModal';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const TaskList = ({ tasks, onEditTask }: TaskListProps) => {
  const { updateTask, deleteTask } = useTask();
  const [shareTaskId, setShareTaskId] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <PlayCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const toggleTaskStatus = (task: Task) => {
    const statusOrder: ('todo' | 'in-progress' | 'completed')[] = ['todo', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    updateTask(task.id, { status: nextStatus });
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-600">Create your first task to get started.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {tasks.map((task) => (
        <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              {/* Status Icon */}
              <button 
                onClick={() => toggleTaskStatus(task)}
                className="mt-1 hover:scale-110 transition-transform duration-150"
              >
                {getStatusIcon(task.status)}
              </button>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  <Badge className={`${getPriorityColor(task.priority)} text-xs font-medium`}>
                    {task.priority}
                  </Badge>
                  <Badge className={`${getStatusColor(task.status)} text-xs font-medium`}>
                    {task.status.replace('-', ' ')}
                  </Badge>
                </div>
                
                <p className={`text-gray-600 mb-3 ${task.status === 'completed' ? 'line-through' : ''}`}>
                  {task.description}
                </p>

                {/* Task Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due {formatDate(task.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Updated {formatDate(task.updatedAt)}</span>
                  </div>
                  {task.sharedWith.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      <span>Shared with {task.sharedWith.length}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {task.tags.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {task.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditTask(task)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShareTaskId(task.id)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => deleteTask(task.id)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}

      {/* Share Task Modal */}
      {shareTaskId && (
        <ShareTaskModal 
          taskId={shareTaskId} 
          onClose={() => setShareTaskId(null)} 
        />
      )}
    </div>
  );
};

export default TaskList;
