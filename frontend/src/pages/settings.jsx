import React from 'react'
import useStore from '../store';
import Title from '../components/title';
import SettingsForm from '../components/setting.form';
import ChangedPassword from '../components/change-password';

const Settings = () => {
  const { user } = useStore((state) => state);


  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-4xl px-4 py-4 my-6 bg-white dark:bg-black/20 rounded-lg shadow-md">
        <div className="mt-6 border-b-2 border-gray-200 dark:border-gray-700">
          <Title title="General Settings" />
        </div>

        <div className="py-10">
          <p className="text-lg font-bold text-gray-500 mt-4">
            Profile Information
          </p>
          <div className="flex items-center gap-4 my-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-300 text-gray-600 text-xl font-bold">
              <p>{user?.firstname?.charAt(0) || "U"}</p>
            </div>
            <p className="text-gray-800 dark:text-gray-200">
              {user?.firstname || "User"}
            </p>
          </div>
          <SettingsForm />
          {!user?.provided && <ChangedPassword />}
        </div>
      </div>
    </div>
  );
}

export default Settings