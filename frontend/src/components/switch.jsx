import { useState } from "react";
import useStore from "../store";
import { LuMoon } from "react-icons/lu";
import { IoMoonOutline } from "react-icons/io5";

const ThemeSwitch = () => {
    const { theme, setTheme } = useStore();
    const [isDarkMode, setisDarkMode] = useState(theme === "dark");

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setisDarkMode(!isDarkMode);
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <button 
        onClick={toggleTheme}
        className="outline-none">
            {isDarkMode ? (
                <LuMoon size={20} className="text-gray-300" />
            ) : (
                <IoMoonOutline size={20} className="text-gray-500" />
            )}
        </button>
    )
}

export default ThemeSwitch;