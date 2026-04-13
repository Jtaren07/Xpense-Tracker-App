import React, { useEffect, useState } from "react";
import useStore from "../store";
import { useForm } from "react-hook-form";
import api from "../libs/apiCall";
import { toast } from "sonner";
import DialogWrapper from "./wrappers/dialog-wrapper";
import { DialogPanel, DialogTitle } from "@headlessui/react";
import { MdOutlineWarning } from "react-icons/md";
import { Button } from "./ui/button";
import Input from "./ui/input";
import Loading from "./loading";
import { formatCurrency } from "../libs";

const AddTransaction = ({ isOpen, setIsOpen, refresh }) => {
  const { user } = useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      description: "",
      amount: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountData, setAccountData] = useState([]);
  const [accountBalance, setAccountBalance] = useState(0);
  const [accountInfo, setAccountInfo] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState("");

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const { data: res } = await api.get(`/account`);
      setAccountData(res?.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to load accounts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAccounts();
    }
  }, [isOpen]);

  const getAccountBalance = (val) => {
    const filteredAccount = accountData?.find((account) => account.account_name === val);
    setSelectedAccount(val);
    setAccountBalance(filteredAccount?.account_balance || 0);
    setAccountInfo(filteredAccount || null);
  };

  const submitHandler = async (data) => {
    if (!selectedAccount) {
      toast.error("Please select an account to continue.");
      return;
    }

    try {
      setLoading(true);
      const newData = { ...data, source: accountInfo.account_name };
      const { data: res } = await api.post(`/transaction/add-transaction/${accountInfo.id}`, newData);

      if (res?.status === "success") {
        toast.success(res?.message || "Transaction added successfully");
        setIsOpen(false);
        refresh?.();
        reset();
        setSelectedAccount("");
        setAccountBalance(0);
        setAccountInfo(null);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
      <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <DialogTitle as="h2" className="text-lg font-medium text-gray-900">
          Add Transaction
        </DialogTitle>

        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div className="flex flex-col gap-1 mb-2">
              <label className="text-gray-700 dark:text-gray-400 text-sm mb-2">Select Account</label>
              <select
                value={selectedAccount}
                onChange={(e) => getAccountBalance(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-800 dark:bg-slate-950 dark:text-gray-200"
              >
                <option value="" disabled>
                  Select Account
                </option>
                {accountData.map((acc) => (
                  <option key={acc.id || acc.account_name} value={acc?.account_name}>
                    {acc?.account_name} - {formatCurrency(acc?.account_balance, user?.country?.currency)}
                  </option>
                ))}
              </select>
            </div>

            {selectedAccount && accountBalance <= 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-yellow-100 p-3 text-sm text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-200">
                <MdOutlineWarning className="h-5 w-5" />
                <span>Insufficient balance.</span>
              </div>
            )}

            {selectedAccount && accountBalance > 0 && (
              <>
                <Input
                  id="description"
                  label="Description"
                  placeholder="Description"
                  error={errors.description ? errors.description.message : " "}
                  {...register("description", {
                    required: "Description is required",
                  })}
                />

                <Input
                  type="number"
                  label="Amount"
                  placeholder="$0.00"
                  step="0.01"
                  min="0"
                  error={errors.amount ? errors.amount.message : " "}
                  {...register("amount", {
                    required: "Amount is required",
                  })}
                />

                <div className="pt-2">
                  <Button disabled={loading} type="submit" className="bg-violet-700 text-white">
                    Confirm {watch("amount") ? formatCurrency(Number(watch("amount"))) : ""}
                  </Button>
                </div>
              </>
            )}
          </form>
        )}
      </DialogPanel>
    </DialogWrapper>
  );
};

export default AddTransaction;
