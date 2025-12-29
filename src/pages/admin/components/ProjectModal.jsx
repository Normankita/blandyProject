'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ProjectModal = ({ title, onClose, children }) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="w-full sm:max-w-xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <div className="flex justify-between items-center w-full">
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
