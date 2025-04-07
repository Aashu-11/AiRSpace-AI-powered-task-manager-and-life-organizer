
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useTimeBlockStore } from '@/lib/timeBlockStore';

export const AddTimeBlock = () => {
  const { addTimeBlock } = useTimeBlockStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTimeBlock, setNewTimeBlock] = useState({
    time: '08:00',
    duration: '30min',
    title: '',
    category: 'Work'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTimeBlock(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setNewTimeBlock(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTimeBlock = async () => {
    if (!newTimeBlock.title) {
      toast({
        title: "Title required",
        description: "Please provide a title for your time block",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Add timeblock to store
      addTimeBlock(newTimeBlock);

      // Close dialog and show success message
      setIsDialogOpen(false);
      toast({
        title: "Time Block Added",
        description: "Your time block has been successfully added"
      });
      
      // Reset form
      setNewTimeBlock({
        time: '08:00',
        duration: '30min',
        title: '',
        category: 'Work'
      });
    } catch (error) {
      console.error("Error adding time block:", error);
      toast({
        title: "Error",
        description: "Failed to add time block. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="btn-premium whitespace-nowrap">
          <Plus size={18} className="mr-2" />
          Add Time Block
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Time Block</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter time block title"
              value={newTimeBlock.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Start Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={newTimeBlock.time}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={newTimeBlock.duration} onValueChange={(value) => handleSelectChange('duration', value)}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15min">15 minutes</SelectItem>
                  <SelectItem value="30min">30 minutes</SelectItem>
                  <SelectItem value="45min">45 minutes</SelectItem>
                  <SelectItem value="60min">1 hour</SelectItem>
                  <SelectItem value="90min">1.5 hours</SelectItem>
                  <SelectItem value="120min">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={newTimeBlock.category} onValueChange={(value) => handleSelectChange('category', value)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
                <SelectItem value="Break">Break</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              <X size={18} className="mr-2" />
              Cancel
            </Button>
            <Button onClick={handleAddTimeBlock} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus size={18} className="mr-2" />
                  Save Time Block
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
