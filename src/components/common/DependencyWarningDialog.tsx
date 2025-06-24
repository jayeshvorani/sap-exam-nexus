
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
import { AlertTriangle } from "lucide-react";

interface DependencyWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  dependencies: Array<{
    type: string;
    count: number;
    details?: string[];
  }>;
  loading?: boolean;
}

export const DependencyWarningDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  dependencies,
  loading = false
}: DependencyWarningDialogProps) => {
  const totalDependencies = dependencies.reduce((sum, dep) => sum + dep.count, 0);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            <AlertDialogTitle className="text-lg">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left space-y-3">
            <p className="font-medium">
              You are about to delete "<span className="text-foreground">{itemName}</span>"
            </p>
            
            {totalDependencies > 0 ? (
              <>
                <p className="text-destructive font-medium">
                  This will also permanently delete the following related data:
                </p>
                <ul className="space-y-2 pl-4">
                  {dependencies
                    .filter(dep => dep.count > 0)
                    .map((dep, index) => (
                      <li key={index} className="flex flex-col gap-1">
                        <span className="font-medium text-destructive">
                          • {dep.count} {dep.type}
                        </span>
                        {dep.details && dep.details.length > 0 && (
                          <span className="text-sm text-muted-foreground pl-3">
                            ({dep.details.join(', ')})
                          </span>
                        )}
                      </li>
                    ))}
                </ul>
                <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                  ⚠️ This action cannot be undone!
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">
                No dependent records found. This item can be safely deleted.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete Permanently"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
