import { AlertDialogRenderedDialog } from "./alert-dialog-rendered-dialog";
import type { AlertDialogType } from "./alert-dialog-store";
import { useAlertDialogStore } from "./alert-dialog-store";

export const AlertDialogRenderer = () => {
  const dialog = useAlertDialogStore((state) => state.dialogs[0]) as
    | AlertDialogType
    | undefined;

  if (dialog) {
    return <AlertDialogRenderedDialog {...dialog} />;
  }

  return null;
};
