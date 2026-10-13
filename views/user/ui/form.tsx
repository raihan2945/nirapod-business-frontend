"use client";

import { forwardRef, useEffect, useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-2xl border border-np-border bg-white px-4 text-[15px] text-np-text outline-none transition-colors placeholder:text-np-subtle focus:border-np-primary focus:ring-4 focus:ring-np-primary/15 disabled:bg-np-surface-muted";

interface FieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: (id: string) => ReactNode;
  className?: string;
}

export function Field({ label, required, error, hint, children, className }: FieldProps) {
  const id = useId();
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={id} className="block text-[13px] font-semibold text-np-text">
          {label}
          {required && <span className="text-np-danger"> *</span>}
        </label>
      )}
      {children(id)}
      {error ? (
        <p className="text-[13px] text-np-danger">{error}</p>
      ) : (
        hint && <p className="text-[13px] text-np-subtle">{hint}</p>
      )}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; hint?: string };

export const TextInput = forwardRef<HTMLInputElement, InputProps>(function TextInput({ label, error, hint, required, className, ...rest }, ref) {
  return (
    <Field label={label} required={required} error={error} hint={hint}>
      {(id) => <input ref={ref} id={id} aria-invalid={!!error} className={cn(control, "h-12", error && "border-np-danger", className)} {...rest} />}
    </Field>
  );
});

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string };

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea({ label, error, className, ...rest }, ref) {
  return (
    <Field label={label} error={error}>
      {(id) => <textarea ref={ref} id={id} rows={3} className={cn(control, "py-3", error && "border-np-danger", className)} {...rest} />}
    </Field>
  );
});

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
};

export const SelectInput = forwardRef<HTMLSelectElement, SelectProps>(function SelectInput({ label, error, options, placeholder, className, ...rest }, ref) {
  return (
    <Field label={label} error={error}>
      {(id) => (
        <select ref={ref} id={id} className={cn(control, "h-12 cursor-pointer appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10", className)} style={{ backgroundImage: CHEVRON }} {...rest}>
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
});

const CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235E6E66' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;

interface ImagePickerProps {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  hint?: string;
  existingUrl?: string;
  shape?: "card" | "circle";
}

export function ImagePicker({ label, value, onChange, hint, existingUrl, shape = "card" }: ImagePickerProps) {
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    if (!value) {
      setPreview(undefined);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const shown = preview ?? existingUrl;
  const input = (
    <input
      type="file"
      accept="image/*"
      className="sr-only"
      onChange={(e) => {
        onChange(e.target.files?.[0] ?? null);
        e.target.value = "";
      }}
    />
  );

  if (shape === "circle") {
    return (
      <label className="flex cursor-pointer flex-col items-center gap-2">
        {input}
        <span className="relative flex size-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-np-primary/40 bg-np-primary-soft">
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="" className="size-full object-cover" />
          ) : (
            <ImagePlus className="size-7 text-np-primary" />
          )}
        </span>
        <span className="text-[13px] font-semibold text-np-primary-dark">{label}</span>
      </label>
    );
  }

  return (
    <Field label={label} hint={hint}>
      {() =>
        shown ? (
          <div className="relative h-44 overflow-hidden rounded-2xl border border-np-border bg-np-surface-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shown} alt="Selected file" className="size-full object-cover" />
            {value && <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Remove image"
              className="absolute right-2 top-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-np-deeper/70 text-white"
            >
              <X className="size-4" />
            </button>}
          </div>
        ) : (
          <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-np-border bg-np-surface-muted/60 text-np-muted transition-colors hover:border-np-primary/50 hover:text-np-primary-dark">
            {input}
            <ImagePlus className="size-6" />
            <span className="text-[13px] font-semibold">Choose an image</span>
          </label>
        )
      }
    </Field>
  );
}
