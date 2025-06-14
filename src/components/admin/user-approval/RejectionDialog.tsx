
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RejectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: (reason: string) => void;
}

export const RejectionDialog = ({ open, onOpenChange, onReject }: RejectionDialogProps) => {
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReject = () => {
    onReject(rejectionReason);
    setRejectionReason("");
  };

  const handleClose = () => {
    onOpenChange(false);
    setRejectionReason("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject User Registration</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this user's registration.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="reason">Rejection Reason</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReject}>
            Reject User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
