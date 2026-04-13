import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../libs/apiCall";
import { toast } from "sonner";
import DialogWrapper from "./wrappers/dialog-wrapper";
import { generateAccountNumber } from "../libs";
import { DialogPanel, DialogTitle } from "@headlessui/react";
import useStore from "../store";
import { MdOutlineWarning } from "react-icons/md";
import { BiLoader } from "react-icons/bi";
import { Button } from "./ui/button";


const accounts = ["crypto", "cash", "visa debit card", "paypal"];

const AddAccount = ({ isOpen, setIsOpen, refresh }) => {
  const { user } = useStore((state) => state);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      account_number: generateAccountNumber(),
    },
  });
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      reset({
        account_number: generateAccountNumber(),
      });
    }
  }, [isOpen, reset]);


  const onSubmit = async (data) => {
    
    try {
        setLoading(true);
        const newData = {
            ...data,
            name: selectedAccount
        };

      const { data: res } = await api.post("/account/create", newData);

      if (res?.data === "success") {
        toast.success(res?.message || "Account created successfully");
        setIsOpen(false);
        refresh();
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error(error?.response?.data?.message || error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
      <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <DialogTitle
          as="h2"
          className="text-lg font-m-300 medium leading-6 text-gray-900 dark:text-gray mb-4 uppercase"
        >   
        Add Account
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex-col gap-1 mb-2 flex">
               <p className="text-gray-700 dark:text-gray-400 text-sm mb-2">
                Select Account
               </p>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-slate-900 text-sm"
                >
                    {accounts.map((acc, index) => (
                        <option
                            key={index}
                            value={acc}
                            className="w-full flex items-center justify-between dark:bg-slate-500"
                        >
                            {acc}
                        </option>
                    ))}
                </select>
            </div>
            {user?.accounts?.includes(selectedAccount) ? (
                <div className="flex items-center gap-2 bg-yellow-400 text-black p-2 mt-6 rounded">
                    <MdOutlineWarning size={20} />
                    <span className="text-sm">
                        This account already exists.
                    </span>
                </div>
            ) : (
            <>
                <input 
                    name="account_number"
                    label="Account Number"
                    placeholder="Account Number"
                    {...register("account_number", {
                        required: "Account number is required",
                    })}
                    error={errors.account_number ? errors.account_number.message : null}
                    className="w-full text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
                />
                <input 
                    type="number"
                    
                    name="amount"
                    label="Initial Amount"
                    placeholder="$0.00"
                    {...register("amount", {
                        required: "Initial amount is required",
                    })}
                    error={errors.amount ? errors.amount.message : null}
                    className="w-full text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
                />
                <Button
                    disabled={loading}
                    type="submit"
                    className="bg-violet-700 text-white"
                >
                    {loading ? (
                        <BiLoader className="text-xl animate-spin text-white"/>
                    ) : (
                        "Add Account"
                    )}
                </Button>
            </>
            )}
        </form>
      </DialogPanel>
    </DialogWrapper>
  );
};

export default AddAccount;

