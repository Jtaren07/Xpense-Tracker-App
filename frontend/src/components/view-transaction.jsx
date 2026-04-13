import React from 'react'
import DialogWrapper from '../components/wrappers/dialog-wrapper';
import { DialogPanel, DialogTitle } from '@headlessui/react';
import { PiSealCheckFill } from 'react-icons/pi';
import { formatCurrency } from '../libs';


const ViewTransaction = ({data, isOpen, setIsOpen}) => {
    function closeModal() {
        setIsOpen(false);
    }

const longDateString = new Date(data?.createdAt).toLocaleDateString('en-US', {
    dateStyle: "full",
})

const LongTimeString = new Date(data?.createdAt).toLocaleTimeString('en-US')
    return (
        <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                    as="h2"
                    className="text-lg font-medium text-gray-900"
                    >
                    Transaction Detail

                </DialogTitle>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-500 border-y border-gray-300 dark:border-gray-700 py-4">
                        <p>
                            {data?.source}
                        </p>
                        <PiSealCheckFill size={16} className="text-green-500" />
                    </div>
                    <div className="mb-10">
                        <p className="text-xl text-black dark:text-white">
                            {data?.description}
                        </p>
                        <span>
                            {longDateString}
                            {LongTimeString}
                        </span>
                    </div>
                </div>
                <div className="mt-10 mb-3 flex justify-between">
                    <p className="text-black dark:text-gray-400 text-2xl font-bold">
                        <span
                            className={`${data?.type === "income" ? "text-green-500" : "text-red-500"} text-lg font-bold ml-1`}
                        >
                            {data?.type === "income" ? "+" : "-"}
                        </span>
                        {formatCurrency(data?.amount)}
                    </p>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-md outline-none bg-violet-800 px-2 py-1 text-sm font-medium text-white"
                    >
                        Got it, thanks!
                    </button>
                </div>
            </DialogPanel>
        </DialogWrapper>
    );
};

export default ViewTransaction;
