import React from "react";

const Title = ({ title }) => {
    return (
        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {title}
        </p>
    );
};

export default Title;