import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";
import { MeetingGetOne } from "../../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: MeetingGetOne;
};

export const UpdateMeetingDialog = ({ onOpenChange, open, initialValues }: Props) => {
  return (
    <ResponsiveDialog
      title="Edit Meeting"
      description="Edit the Meeting details"
      open={open}
      onOpenChange={onOpenChange}>
      <MeetingForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValue={initialValues}
      />
    </ResponsiveDialog>
  );
};
