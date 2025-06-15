
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, UserX, UserCheck, Trash2 } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
  approval_status: string;
  email_verified: boolean;
  is_active: boolean;
}

interface UserActionDropdownProps {
  user: UserProfile;
  onDeactivate: (userId: string) => void;
  onReactivate: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export const UserActionDropdown = ({ 
  user, 
  onDeactivate, 
  onReactivate, 
  onDelete 
}: UserActionDropdownProps) => {
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Don't show actions for admin users or non-approved users
  if (user.role === 'admin' || user.approval_status !== 'approved') {
    return null;
  }

  const handleDeactivate = () => {
    onDeactivate(user.id);
    setShowDeactivateDialog(false);
  };

  const handleReactivate = () => {
    onReactivate(user.id);
  };

  const handleDelete = () => {
    onDelete(user.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background border border-border shadow-lg">
          {user.is_active ? (
            <DropdownMenuItem
              onClick={() => setShowDeactivateDialog(true)}
              className="text-amber-700 dark:text-amber-400 focus:bg-amber-50 dark:focus:bg-amber-950 focus:text-amber-700 dark:focus:text-amber-300"
            >
              <UserX className="mr-2 h-4 w-4" />
              Deactivate User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={handleReactivate}
              className="text-green-700 dark:text-green-400 focus:bg-green-50 dark:focus:bg-green-950 focus:text-green-700 dark:focus:text-green-300"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Reactivate User
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-700 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950 focus:text-red-700 dark:focus:text-red-300"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Permanently
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate {user.full_name}? This will prevent them from accessing the system, but their data will be preserved. You can reactivate them later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeactivate}
              className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Permanently</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete {user.full_name}? This action cannot be undone and will remove all their data, including exam attempts and assignments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
