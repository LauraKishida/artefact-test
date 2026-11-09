"use client";

import { useCallback, useEffect, useState } from "react";
import { usePopupStore } from "@/app/store/popup-store";
import type { PopupType } from "@/app/store/popup-store";

export type PopupTokenProps = {
  message: string;
  type?: PopupType;
  /** Auto-dismiss delay in milliseconds. Defaults to 3500ms. Set to 0 to disable. */
  duration?: number;
  /** Callback fired when the popup is dismissed (either manually or after duration). */
  onClose?: () => void;
  className?: string;
};

const TYPE_STYLES: Record<
  PopupType,
  {
    border: string;
    bg: string;
    text: string;
    icon: React.ReactNode;
  }
> = {
  success: {
    border: "border-emerald-500/40",
    bg: "bg-emerald-950/90",
    text: "text-emerald-100",
    icon: (
      <svg
        className="h-5 w-5 shrink-0 text-emerald-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  warning: {
    border: "border-amber-500/40",
    bg: "bg-amber-950/90",
    text: "text-amber-100",
    icon: (
      <svg
        className="h-5 w-5 shrink-0 text-amber-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  error: {
    border: "border-red-500/40",
    bg: "bg-red-950/90",
    text: "text-red-100",
    icon: (
      <svg
        className="h-5 w-5 shrink-0 text-red-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  info: {
    border: "border-cyan-500/40",
    bg: "bg-cyan-950/90",
    text: "text-cyan-100",
    icon: (
      <svg
        className="h-5 w-5 shrink-0 text-cyan-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

/**
 * Visual token/pill popup notification component.
 */
export const PopupToken = ({
  message,
  type = "success",
  duration = 3500,
  onClose,
  className = "",
}: PopupTokenProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 200);
  }, [onClose]);

  useEffect(() => {
    // Trigger entrance animation on mount
    const enterTimer = setTimeout(() => setIsVisible(true), 10);

    if (!duration || duration <= 0) return () => clearTimeout(enterTimer);

    const dismissTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, [duration, handleClose]);

  const style = TYPE_STYLES[type] ?? TYPE_STYLES.info;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-3 rounded-full border px-4 py-2.5 text-sm font-medium shadow-xl shadow-black/40 backdrop-blur-md transition-all duration-200 ${style.border} ${style.bg} ${style.text} ${
        isVisible
          ? "translate-y-0 scale-100 opacity-100"
          : "-translate-y-2 scale-95 opacity-0"
      } ${className}`}
    >
      {style.icon}
      <span className="max-w-xs truncate sm:max-w-md">{message}</span>
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close notification"
        className="-mr-1 ml-1 rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white focus:outline-none"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export type ShowPopupOptions = {
  id?: number;
  message: string;
  type?: PopupType;
  duration?: number;
  onClose?: () => void;
};

export const usePopupToken = () => {
  const [popup, setPopup] = useState<ShowPopupOptions | null>(null);
  const shouldShowPopup = usePopupStore((state) => state.shouldShowPopup);
  const message = usePopupStore((state) => state.message);
  const type = usePopupStore((state) => state.type);
  const setPopupToShow = usePopupStore((state) => state.setPopupToShow);
  const resetPopup = usePopupStore((state) => state.resetPopup);

  const showPopup = useCallback(
    (
      customMessage?: string,
      customType?: PopupType,
      onCloseCallback?: () => void,
      duration = 3500,
    ) => {
      const storeState = usePopupStore.getState();
      const finalMessage = customMessage ?? storeState.message;
      const finalType = customType ?? storeState.type ?? "success";

      if (!finalMessage) return;

      setPopup({
        id: Date.now(),
        message: finalMessage,
        type: finalType,
        duration,
        onClose: () => {
          onCloseCallback?.();
          setPopup(null);
        },
      });
    },
    [],
  );

  const hidePopup = useCallback(() => {
    popup?.onClose?.();
    setPopup(null);
  }, [popup]);

  const PopupComponent = popup ? (
    <div className="pointer-events-none fixed top-6 right-6 z-50 flex flex-col items-end">
      <div className="pointer-events-auto">
        <PopupToken
          key={`${popup.id ?? popup.message}-${popup.type}`}
          message={popup.message}
          type={popup.type}
          duration={popup.duration}
          onClose={popup.onClose}
        />
      </div>
    </div>
  ) : null;

  return {
    showPopup,
    hidePopup,
    PopupComponent,
    isOpen: Boolean(popup),
    shouldShowPopup,
    resetPopup,
    setPopupToShow,
    message,
    type,
  };
};
