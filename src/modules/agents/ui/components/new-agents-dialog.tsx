import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentsForm } from "./agents-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const NewAgentsDialog = ({ onOpenChange, open }: Props) => {
  return (
    <ResponsiveDialog
      title="New Agents"
      description="Create new Agents"
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentsForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
