import React, { useEffect } from 'react'
import { useState } from 'react';
import Loading from '../components/loading';
import api from '../libs/apiCall';
import { toast } from 'sonner';
import Info from '../components/info';
import Stats from '../components/stats';
import Chart from '../components/chart';
import DoughnutChart from '../components/pinchart';
import RecentTransactions from '../components/recent-transactions';
import Accounts from '../components/accounts';
import { formatCurrency } from '../libs';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardStats = async () => {
    const URL = '/transaction/dashboard';
    try {
      const { data: res } = await api.get(URL);
      setData(res);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || 'Something went wrong'
      );
      if (error?.response?.data?.status === "auth failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-10">
      <div className="space-y-5">
        <Info title="Dashboard" subTitle="Overview of your transactions and account stats" />

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <Stats
            dt={{
              balance: data?.availableBalance,
              income: data?.totalIncome,
              expense: data?.totalExpense,
            }}
          />

          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-950 dark:shadow-none">
            <div className="flex items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Summary</p>
                <p className="mt-1 text-xs">Your latest income and expense overview.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-gray-300">
                Updated today
              </span>
            </div>

            <div className="mt-6 grid gap-5">
              <div className="rounded-3xl border border-gray-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Available Balance</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(data?.availableBalance || 0)}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-gray-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Total Income</p>
                  <p className="mt-3 text-2xl font-semibold text-emerald-600">
                    {formatCurrency(data?.totalIncome || 0)}
                  </p>
                </div>
                <div className="rounded-3xl border border-gray-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Total Expense</p>
                  <p className="mt-3 text-2xl font-semibold text-rose-600">
                    {formatCurrency(data?.totalExpense || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-950 dark:shadow-none">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Spending chart</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track your expenses over time.</p>
              </div>
            </div>
            <div className="mt-6 h-[360px] min-h-[320px]">
              <Chart data={data?.chartData} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-950 dark:shadow-none">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Expense Distribution</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">Overview</span>
              </div>
              <div className="mt-6 h-[320px] min-h-[280px]">
                <DoughnutChart
                  dt={{
                    balance: data?.availableBalance,
                    income: data?.totalIncome,
                    expense: data?.totalExpense,
                  }}
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-950 dark:shadow-none">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Account snapshot</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Quick summary of your active accounts.</p>
              <div className="mt-6">
                <Accounts data={data?.accounts} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-950 dark:shadow-none">
          <RecentTransactions transactions={data?.recentTransactions} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;