"use client";

import type { FormProps } from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import {
  CmdOrOption,
  KeyboardShortcut,
} from "@/components/ui/keyboard-shortcut";
import { Typography } from "@/components/ui/typography";
import { useIsClient } from "@/hooks/use-is-client";
import { useWarnIfUnsavedChanges } from "@/hooks/use-warn-if-unsaved-changes";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { createPortal } from "react-dom";
import type { FieldValues } from "react-hook-form";
import { useKey } from "react-use";
import { LoadingButton } from "./submit-button";

export const FormUnsavedBar = <T extends FieldValues>(props: FormProps<T>) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isClient = useIsClient();

  const submit = () => buttonRef.current?.click();

  const isDirty = props.form.formState.isDirty;

  useKey(
    (event) => (event.ctrlKey || event.metaKey) && event.key === "s" && isDirty,
    (event) => {
      event.preventDefault();
      submit();
    },
    { event: "keydown" },
    [isDirty],
  );

  useWarnIfUnsavedChanges(
    isDirty,
    "You have unsaved changes. Are you sure you want to leave?",
  );

  return (
    <>
      <Form {...props} className={cn(props.className)}>
        {props.children}
        <button type="submit" className="hidden" ref={buttonRef} />
      </Form>
      {isClient
        ? createPortal(
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center overflow-hidden py-4">
              <AnimatePresence>
                {isDirty ? (
                  <motion.div
                    key="save-bar"
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: [1, 1, 0],
                      y: [0, -10, 20],
                      transition: {
                        duration: 0.5,
                      },
                    }}
                    // @ts-expect-error - TODO : Remove this when framer-motion fully supports react 19 (https://mlv.sh/fm-r19)
                    className="pointer-events-auto flex items-center gap-4 rounded-md border bg-card p-1 lg:p-2"
                  >
                    <Typography variant="small">
                      Changes have been made. Save now !
                    </Typography>
                    <LoadingButton
                      size="sm"
                      loading={
                        props.disabled ?? props.form.formState.isSubmitting
                      }
                      variant="success"
                      onClick={() => {
                        submit();
                      }}
                    >
                      Save{" "}
                      <KeyboardShortcut eventKey="cmd">
                        <CmdOrOption />
                      </KeyboardShortcut>
                      <KeyboardShortcut eventKey="s">S</KeyboardShortcut>
                    </LoadingButton>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>,
            document.body,
          )
        : null}
    </>
  );
};
