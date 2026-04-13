import { create } from "zustand";

const useStore = create((set) => ({
    theme: localStorage.getItem('theme') || 'light',
    user: JSON.parse(localStorage.getItem('user')) ?? null,

    setTheme: (value) => {
        localStorage.setItem("theme", value);
        set({ theme: value });
    },
    setCredentials: (data) => {
        localStorage.setItem("user", JSON.stringify(data));
        set({ user: data });
    },
    signOut: () => {
        localStorage.removeItem("user");
        set({ user: null });
    },
}));

export default useStore;