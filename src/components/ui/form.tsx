"use client";

import * as React from "react";
import Box, { type BoxProps } from "@mui/material/Box";
import Typography, { type TypographyProps } from "@mui/material/Typography";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label, type LabelProps } from "@/components/ui/label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

function FormItem({ sx, ...props }: BoxProps) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.75,
          width: "100%",
          ...sx,
        }}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({ sx, ...props }: LabelProps) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      htmlFor={formItemId}
      sx={{
        color: error ? "error.main" : "text.primary",
        fontSize: "0.85rem",
        fontWeight: 600,
        ...sx,
      }}
      {...props}
    />
  );
}

function FormControl({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      id: formItemId,
      "aria-describedby": !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      error: !!error,
      ...props,
    });
  }

  return (
    <Box
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    >
      {children}
    </Box>
  );
}

function FormDescription({ sx, children, ...props }: TypographyProps) {
  const { formDescriptionId } = useFormField();

  return (
    <Typography
      id={formDescriptionId}
      variant='caption'
      sx={{
        color: "text.secondary",
        fontSize: "0.78rem",
        lineHeight: 1.4,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

function FormMessage({ sx, children, ...props }: TypographyProps) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;

  if (!body) {
    return null;
  }

  return (
    <Typography
      id={formMessageId}
      variant='caption'
      sx={{
        color: "error.main",
        fontSize: "0.78rem",
        fontWeight: 500,
        ...sx,
      }}
      {...props}
    >
      {body}
    </Typography>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
