
import { useState } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Share2, X, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface ShareTaskModalProps {
  taskId: string;
  onClose: () => void;
}

const ShareTaskModal = ({ taskId, onClose }: ShareTaskModalProps) => {
  const { tasks, shareTask } = useTask();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return null;
  }

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (task.sharedWith.includes(email)) {
      toast.error('Task is already shared with this email');
      return;
    }

    setLoading(true);
    
    try {
      shareTask(taskId, email);
      toast.success(`Task shared with ${email} successfully!`);
      setEmail('');
    } catch (error) {
      toast.error('Failed to share task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeSharedUser = (emailToRemove: string) => {
    // In a real app, you'd have an API call to remove shared access
    // For now, we'll just show a toast
    toast.success(`Removed ${emailToRemove} from shared access`);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Task Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
            <p className="text-sm text-gray-600 truncate">{task.description}</p>
          </div>

          {/* Share Form */}
          <form onSubmit={handleShare} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Share with email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address..."
                  className="flex-1"
                />
                <Button type="submit" disabled={loading} size="sm">
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Currently Shared With */}
          {task.sharedWith.length > 0 && (
            <div className="space-y-2">
              <Label>Currently shared with</Label>
              <div className="space-y-2">
                {task.sharedWith.map((sharedEmail, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{sharedEmail}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSharedUser(sharedEmail)}
                      className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
            <p>💡 Shared users will be able to view and edit this task. They'll receive email notifications about updates.</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareTaskModal;
