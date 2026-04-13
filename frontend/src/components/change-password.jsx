import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../libs/apiCall';
import { toast } from 'sonner';
import { Button } from './ui/button';
import Input from './ui/input';
import { BiLoader } from 'react-icons/bi';

export const ChangedPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const submitPasswordHandler = async (data) => {
    try {
      setLoading(true);
      const { data: res } = await api.put('/user/change-password', data);

      if (res?.status === 'success') {
        toast.success(res?.message || 'Password changed successfully!');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'An error occurred while changing the password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
        <div className="px-6 py-8 sm:px-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Change Password
              </p>
              <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                Update your account password to keep your profile secure. Use a strong phrase and keep it private.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(submitPasswordHandler)} className="mt-8 space-y-6">
            <div className="grid gap-6">
              <Input
                disabled={loading}
                type="password"
                id="currentPassword"
                label="Current Password"
                placeholder="Enter current password"
                autoComplete="current-password"
                {...register('currentPassword', {
                  required: 'Current password is required',
                })}
                error={errors.currentPassword?.message}
              />

              <Input
                disabled={loading}
                type="password"
                id="newPassword"
                label="New Password"
                placeholder="Enter new password"
                autoComplete="new-password"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 6,
                    message: 'New password must be at least 6 characters long',
                  },
                })}
                error={errors.newPassword?.message}
              />

              <Input
                disabled={loading}
                type="password"
                id="confirmPassword"
                label="Confirm New Password"
                placeholder="Confirm new password"
                autoComplete="new-password"
                {...register('confirmPassword', {
                  required: 'Please confirm your new password',
                  validate: (value) =>
                    value === getValues('newPassword') || 'Passwords do not match',
                })}
                error={errors.confirmPassword?.message}
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Need help?
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Make sure your new password is unique and not used on other sites. We recommend at least 8 characters with letters, numbers, and symbols.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="reset"
                variant="outline"
                className="w-full sm:w-40"
                disabled={loading}
              >
                Reset
              </Button>
              <Button type="submit" variant="default" className="w-full sm:w-40" disabled={loading}>
                {loading ? <BiLoader className="animate-spin" /> : 'Confirm'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangedPassword;
