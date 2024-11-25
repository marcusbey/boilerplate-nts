"use client";

import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { create } from "zustand";
import type { AlertDialogRenderedDialogProps } from "./alert-dialog-rendered-dialog";
import { isStandardDialog } from "./alert-dialog-rendered-dialog";

export type AlertDialogType = AlertDialogRenderedDialogProps & {
  id: string;
};

type AlertDialogStore = {
  dialogs: AlertDialogType[];
  addDialog: (dialog: AlertDialogRenderedDialogProps) => string;
  removeDialog: (dialogId: string) => void;
};

export const useAlertDialogStore = create<AlertDialogStore>((set, get) => ({
  dialogs: [],
  addDialog: (dialog) => {
    const id = Math.random().toString(36).slice(2, 9);
    const { removeDialog } = get();

    const newDialog: AlertDialogType = isStandardDialog(dialog)
      ? {
          ...dialog,
          cancel: {
            label: dialog.cancel?.label ?? "Cancel",
            onClick: () => {
              if (dialog.cancel && "onClick" in dialog.cancel) {
                void dialog.cancel.onClick();
                return;
              }
              removeDialog(id);
            },
          },
          action:
            dialog.action && "onClick" in dialog.action
              ? {
                  label: dialog.action.label || "",
                  onClick: () => {
                    if (dialog.action && "onClick" in dialog.action === false) {
                      logger.error("Invalid dialog action");
                      removeDialog(id);
                      return;
                    }

                    // check if it's a promise
                    const onClickReturn = dialog.action?.onClick();

                    if (onClickReturn instanceof Promise) {
                      set((state) => {
                        const dialogIndex = state.dialogs.findIndex(
                          (dialog) => dialog.id === id,
                        );

                        if (dialogIndex !== -1) {
                          const dialogCopy = { ...state.dialogs[dialogIndex] };
                          dialogCopy.loading = true;
                          state.dialogs[dialogIndex] = dialogCopy;
                        }

                        return { dialogs: [...state.dialogs] };
                      });

                      onClickReturn
                        .then(() => {
                          removeDialog(id);
                        })
                        .catch((e) => {
                          toast.error("Some error occurred", {
                            description: e.message,
                          });
                        });
                    } else {
                      removeDialog(id);
                    }
                  },
                }
              : dialog.action,
          loading: false,
          id,
        }
      : { ...dialog, id: id };

    set((state) => ({ dialogs: [...state.dialogs, newDialog] }));

    return id;
  },
  removeDialog: (dialogId) =>
    set((state) => ({
      dialogs: state.dialogs.filter((dialog) => dialog.id !== dialogId),
    })),
}));

export const alertDialog = {
  add: (dialog: AlertDialogRenderedDialogProps) =>
    useAlertDialogStore.getState().addDialog(dialog),
  remove: (dialogId: string) =>
    useAlertDialogStore.getState().removeDialog(dialogId),
};
