/** Підказка під полем: порожнє, пошта або короткий пароль. Показ після виходу з поля чи відправки. */
import { useEffect, useRef, useState } from "react";
import { useLocale, type MessageKey } from "~/lib/i18n";

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type FieldOptions = {
  required?: boolean;
  type?: "text" | "email" | "password";
  minLength?: number;
  strong?: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UPPERCASE = /\p{Lu}/u;
const SYMBOL = /[^\p{L}\p{N}\s]/u;

export function fieldMessage(
  value: string,
  options: FieldOptions,
  t: (key: MessageKey, vars?: Record<string, string | number>) => string
) {
  const trimmed = value.trim();
  if (options.required && trimmed.length === 0) return t("field.required");
  if (options.type === "email" && trimmed.length > 0 && !EMAIL_PATTERN.test(trimmed)) {
    return t("field.email");
  }
  if (options.minLength && value.length > 0 && value.length < options.minLength) {
    return t("field.min", { count: options.minLength });
  }
  if (options.strong && value.length > 0) {
    if (value.length < 8) return t("field.passwordLength");
    if (!UPPERCASE.test(value)) return t("field.passwordUpper");
    if (!SYMBOL.test(value)) return t("field.passwordSymbol");
  }
  return "";
}

export function useFieldError<T extends FieldElement>(value: string, options: FieldOptions) {
  const { t } = useLocale();
  const ref = useRef<T>(null);
  const [show, setShow] = useState(false);
  const optionsRef = useRef(options);
  const tRef = useRef(t);
  optionsRef.current = options;
  tRef.current = t;

  useEffect(() => {
    const form = ref.current?.form;
    if (!form) return;

    const onSubmit = (event: Event) => {
      const message = fieldMessage(ref.current?.value ?? "", optionsRef.current, tRef.current);
      if (message) {
        event.preventDefault();
        event.stopPropagation();
      }
      setShow(true);
    };

    form.addEventListener("submit", onSubmit, true);
    return () => form.removeEventListener("submit", onSubmit, true);
  }, []);

  return {
    ref,
    error: show ? fieldMessage(value, options, t) : "",
    onBlur: () => setShow(true),
  };
}
