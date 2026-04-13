import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../libs/apiCall";
import { toast } from "sonner";
import DialogWrapper from "./wrappers/dialog-wrapper";
import Input from "./ui/input";
import { Button } from "./ui/button";

const AddMoney = ({ isOpen, setIsOpen, id, refresh }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      reset({ amount: "" });
    }
  }, [isOpen, reset]);

  const closeModal = () => {
    setIsOpen(false);
    reset({ amount: "" });
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = { amount: Number(values.amount) };

      const { data: res } = await api.put(`/account/add-money/${id}`, payload);

      if (res?.status === "success") {
        toast.success(res?.message || "Money added successfully");
        refresh?.();
        closeModal();
      }
    } catch (error) {
      console.error("Error adding money:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to add money");
    } finally {
      setLoading(false);
    }
  };

  if (!id) return null;

  return (
    <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
      <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Add Money</h2>
          <button
            type="button"
            onClick={closeModal}
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="amount"
            label="Amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register("amount", {
              required: "Amount is required",
              validate: (value) =>
                parseFloat(value) > 0 || "Amount must be greater than zero",
            })}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal} className="px-6">
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="px-6">
              Deposit
            </Button>
          </div>
        </form>
      </div>
    </DialogWrapper>
  );
};

export default AddMoney;
