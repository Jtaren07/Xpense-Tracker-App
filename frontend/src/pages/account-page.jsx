import React from 'react'
import useStore from '../store';
import { FaBtc, FaPaypal, FaPlus } from 'react-icons/fa';
import { RiVisaLine } from 'react-icons/ri';
import { BsCashCoin } from 'react-icons/bs';
import { useEffect } from 'react';
import api from '../libs/apiCall';
import { toast } from 'sonner';
import Loading from '../components/loading';
import Title from '../components/title';
import { MdVerifiedUser } from 'react-icons/md';
import AccountMenu from '../components/account-dialog';
import AddAccount from '../components/add-account';
import AddMoney from '../components/add-money';
import { formatCurrency, maskAccountNumber } from '../libs';
import TransferMoney from '../components/transfer-money';



const ICONS = {
  crypto: (
    <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-200/30">
      <FaBtc size={22} />
    </div>
  ),
  "visa debit card": (
    <div className="w-14 h-14 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200/30">
      <RiVisaLine size={22} />
    </div>
  ),
  cash: (
    <div className="w-14 h-14 rounded-3xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200/30">
      <BsCashCoin size={22} />
    </div>
  ),
  paypal: (
    <div className="w-14 h-14 rounded-3xl bg-sky-600 flex items-center justify-center text-white shadow-lg shadow-sky-200/30">
      <FaPaypal size={22} />
    </div>
  ),
};

const AccountPage = () => {
  const user = useStore((state) => state.user);
  const [ isOpen, setIsOpen ] = React.useState(false);
  const [ isOpenTransfer, setIsOpenTransfer ] = React.useState(false);
  const [ isOpenTop, setIsOpenTop ] = React.useState(false);
  const [ selectedAccount, setSelectedAccount ] = React.useState(null);
  const [ data, setData ] = React.useState(null);
  const [ isLoading, setIsLoading ] = React.useState(false);

  const fetchAccounts = async () => {
    try {
      const { data: res } = await api.get('/account');
      setData(res?.data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error(error?.response?.data?.message || 'Failed to fetch accounts');
      if (error?.response?.data?.status === "auth failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddMoney = (el) => {
    setSelectedAccount(el?.id);
    setIsOpenTop(true);
  };

  const handleOpenTransfer = (el) => {
    setSelectedAccount(el?.id);
    setIsOpenTransfer(true);
  }

  useEffect(() => {
    setIsLoading(true);
    fetchAccounts();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="w-full py-10">
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Title title="My Accounts" />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your accounts, balances, and deposits from one place.
              </p>
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-800"
            >
              <FaPlus size={16} />
              Add Account
            </button>
          </div>

        {data?.length == 0 ? (
          <>
            <div>
              <span>
                Account Not Found. Please add an account to get started.
              </span>
            </div>
          </>
          ) : (
            <div className="mt-8 grid gap-6 xl:grid-cols-2">
              {data?.map((acc, index) => (
                <div
                  key={index}
                  className="group overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {ICONS[acc?.account_name?.toLowerCase()]}
                      <div>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                          {acc?.account_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {maskAccountNumber(acc?.account_number)}
                        </p>
                      </div>
                    </div>
                    <AccountMenu
                      addMoney={() => handleOpenAddMoney(acc)}
                      transferMoney={() => {}}
                    />
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-gray-300">
                        Created {new Date(acc?.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}
                      </span>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-gray-300">
                        {acc?.account_name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(acc?.balance)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleOpenAddMoney(acc)}
                        className="rounded-full bg-violet-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-800"
                      >
                        Add Money
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
      <AddAccount 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        refresh={fetchAccounts}
        key={new Date().getTime()}
      />
      <AddMoney 
        isOpen={isOpenTop} 
        setIsOpen={setIsOpenTop} 
        id={selectedAccount}
        refresh={fetchAccounts}
        key={new Date().getTime}
      />
      <TransferMoney
        isOpen={isOpenTransfer} 
        setIsOpen={setIsOpenTransfer} 
        id={selectedAccount}
        refresh={fetchAccounts}
        key={new Date().getTime}
      />
    </>
  )
}

export default AccountPage;