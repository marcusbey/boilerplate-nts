"use client";

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
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { useState, type ReactElement, type ReactNode } from "react";
import { LoadingButton } from "../form/submit-button";
type DialogBaseProps = {
  loading?: boolean;
};

type StandardDialogProps = {
  title?: string;
  description?: ReactNode;
  // The user needs to type this text to confirm the action
  confirmText?: string;
  action?:
    | {
        label: string;
        onClick: () => void | Promise<void>;
      }
    | ReactElement;
  cancel?: {
    label: string;
    onClick: () => void | Promise<void>;
  };
};

type CustomDialogProps = {
  children?: ReactNode;
};

export type AlertDialogRenderedDialogProps = DialogBaseProps &
  (StandardDialogProps | CustomDialogProps);

export const isStandardDialog = (
  props: AlertDialogRenderedDialogProps,
): props is DialogBaseProps & StandardDialogProps => {
  if ("children" in props) {
    return false;
  }

  return true;
};

export const AlertDialogRenderedDialog = (
  props: AlertDialogRenderedDialogProps,
) => {
  const [text, setText] = useState("");

  if (!isStandardDialog(props)) {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent>{props.children}</AlertDialogContent>
      </AlertDialog>
    );
  }

  const isConfirmDisabled = props.confirmText
    ? text !== props.confirmText
    : false;

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title ?? ""}</AlertDialogTitle>
          {typeof props.description === "string" ? (
            <AlertDialogDescription>{props.description}</AlertDialogDescription>
          ) : (
            props.description
          )}
        </AlertDialogHeader>
        {props.confirmText ? (
          <div>
            <Typography>
              Please type{" "}
              <Typography variant="code">{props.confirmText}</Typography> to
              confirm the action.
            </Typography>
            <Input value={text} onChange={(e) => setText(e.target.value)} />
          </div>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={props.loading}
            onClick={props.cancel?.onClick}
          >
            {props.cancel?.label ?? "Cancel"}
          </AlertDialogCancel>

          {props.action && "label" in props.action ? (
            <AlertDialogAction asChild>
              <LoadingButton
                loading={props.loading}
                disabled={props.loading ?? isConfirmDisabled}
                onClick={props.action.onClick}
              >
                {props.action.label}
              </LoadingButton>
            </AlertDialogAction>
          ) : (
            props.action
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
