import React from 'react';

export const Seperator = () => {
  return (
    <div className="relative">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-800" />
        </div>
        <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white dark:bg-slate-900">
                Or
            </span>
        </div>
    </div>
  )
}