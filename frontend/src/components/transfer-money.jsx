import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../libs/apiCall";
import { toast } from "sonner";
import DialogWrapper from "./wrappers/dialog-wrapper";
import { Button } from "./ui/button";
import { formatCurrency } from "../libs";
import Input from "./ui/input";
import { DialogPanel, DialogTitle } from "@headlessui/react";
import { MdOutlineWarning } from "react-icons/md";

const TransferMoney = ({ isOpen, setIsOpen, refresh }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      amount: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountData, setAccountData] = useState([]);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [fromAccountInfo, setFromAccountInfo] = useState(null);
  const [toAccountInfo, setToAccountInfo] = useState(null);

  const closeModal = () => {
    setIsOpen(false);
    reset({ amount: "" });
    setFromAccount("");
    setToAccount("");
    setFromAccountInfo(null);
    setToAccountInfo(null);
  };

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const { data: res } = await api.get(`/account`);
      setAccountData(res?.data || []);
    } catch (error) {
      console.error("Something went wrong:", error);
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

  const handleFromChange = (accountName) => {
    const selected = accountData.find((account) => account.account_name === accountName);
    setFromAccount(accountName);
    setFromAccountInfo(selected || null);
  };

  const handleToChange = (accountName) => {
    const selected = accountData.find((account) => account.account_name === accountName);
    setToAccount(accountName);
    setToAccountInfo(selected || null);
  };

  const submitHandler = async (data) => {
    if (!fromAccount || !toAccount) {
      toast.error("Please select both source and destination accounts.");
      return;
    }

    if (fromAccount === toAccount) {
      toast.error("Source and destination accounts must be different.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        from_account: fromAccount,
        to_account: toAccount,
        amount: Number(data.amount),
      };

      const { data: res } = await api.put(`/transaction/transfer-money`, payload);
      if (res?.status === "success") {
        toast.success(res?.message || "Transfer completed successfully");
        refresh?.();
        closeModal();
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      toast.error(error?.response?.data?.message || "Failed to transfer money");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
      <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-950 p-6 text-left shadow-xl">
        <DialogTitle as="h3" className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Transfer Money
        </DialogTitle>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Loading accounts...
          </div>
        ) : (
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">From Account</label>
              <select
                value={fromAccount}
                onChange={(e) => handleFromChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="" disabled>
                  Select source account
                </option>
                {accountData.map((acc) => (
                  <option key={acc.id} value={acc.account_name}>
                    {acc.account_name} - {formatCurrency(acc.account_balance)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">To Account</label>
              <select
                value={toAccount}
                onChange={(e) => handleToChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="" disabled>
                  Select destination account
                </option>
                {accountData.map((acc) => (
                  <option key={acc.id} value={acc.account_name}>
                    {acc.account_name} - {formatCurrency(acc.account_balance)}
                  </option>
                ))}
              </select>
            </div>

            {fromAccountInfo?.account_balance <= 0 && (
              <div className="flex items-center gap-2 rounded-2xl bg-yellow-100 px-4 py-3 text-sm text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-200">
                <MdOutlineWarning className="h-5 w-5" />
                <span>Selected account has insufficient balance for transfers.</span>
              </div>
            )}

            <Input
              id="amount"
              type="number"
              label="Amount"
              placeholder="0.00"
              min="0"
              step="0.01"
              error={errors.amount?.message}
              {...register("amount", {
                required: "Amount is required",
                min: {
                  value: 0.01,
                  message: "Enter a valid transfer amount",
                },
              })}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={closeModal} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? "Transferring..." : "Transfer"}
              </Button>
            </div>
          </form>
        )}
      </DialogPanel>
    </DialogWrapper>
  );
};

export default TransferMoney;
