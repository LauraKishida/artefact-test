import { create } from "zustand";

export type PopupType = "success" | "warning" | "error" | "info";

export type PopupState = {
  shouldShowPopup: boolean;
  message: string;
  type?: PopupType;
  setPopupToShow: (message: string, type?: PopupType) => void;
  resetPopup: () => void;
};

export const usePopupStore = create<PopupState>((set) => ({
  shouldShowPopup: false,
  message: "",
  type: undefined,
  setPopupToShow: (message: string, type: PopupType = "success") =>
    set({ shouldShowPopup: true, message, type }),
  resetPopup: () =>
    set({ shouldShowPopup: false, message: "", type: undefined }),
}));
