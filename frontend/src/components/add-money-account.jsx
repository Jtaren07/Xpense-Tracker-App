import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../libs/apiCall";
import { toast } from "sonner";
import DialogWrapper from "./wrappers/dialog-wrapper";
import { Button } from "./ui/button";
import { formatCurrency } from "../libs";
import Input from "./ui/input";
import { DialogPanel, DialogTitle } from "@headlessui/react";


const AddMoney = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();
    const [loading, setLoading] = useState(false);
    const submitHandler = async (data) => {
        try {
            setLoading(true);
            const { data: res } = await api.put(`/account/add-money/${id}`, data);
        
        if (res?.status === "success") {
            toast.success(res?.message || "Money added successfully");
            setIsOpen(false);
            refresh();
        }
    } catch (error) {
        console.error("Error adding money:", error);
        toast.error(error?.response?.data?.message || error?.message || "Failed to add money");
    } finally {
        setLoading(false);
    }
};

function closeModal() {
    setIsOpen(false);
}

return (
    <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
        <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-500 p-6 text-left align-middle shadow-xl transition-all">
            <DialogTitle
                as="h2"
                className="text-lg font-medium loading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase">
                    Add Money
            </DialogTitle>
                <form>
                   <Input
                    id="amount"
                    label="Amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    error={errors.amount ? errors.amount.message : null}
                    {...register("amount", {
                        required: "Amount is required",
                    })}
                    />

                
                    <div className="w-full mt-8">
                        <Button
                            disabled={loading}
                            type="submit"
                            label={`Submit ${watch("amount") ? formatCurrency(watch("amount")) : ""}`}
                            className="bg-violet-700 text-white w-full"
                        />
                        <Button>
                            {`Submit ${watch("amount") ? formatCurrency(watch("amount")) : ""}`.toUpperCase()}
                        </Button>
                    </div>
                </form>
        </DialogPanel>
    </DialogWrapper>
);


};

export default AddMoney;