import { MdMoreVert } from "react-icons/md";
import TransitionWrapper from "./wrappers/transition-wrapper";
import { Menu, MenuButton, MenuItem } from "@headlessui/react";
import { BiTransfer } from "react-icons/bi";
import { FaMoneyCheckDollar } from "react-icons/fa6";



export default function AccountMenu ({ addMoney, transferMoney }) {
    return (
        <>
            <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="inline-flex w-full justify-center rounded-md text-sm font-medium text-gray-600 dark:gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <MdMoreVert size={20} />
                </MenuButton>

                <TransitionWrapper>
                    <MenuItem className="absolute p-2 right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1 px-1 space-y-2">
                            {({ active }) => (
                                <button
                                    onClick={addMoney}
                                    className={`group flex gap-2 w-full items-center rounded-md py-2 text-sm text-gray-200 hover:text-white`}>
                                        <BiTransfer />
                                        Transfer Funds
                                </button>
                            )}
                        </div>
                    </MenuItem>
                    <MenuItem>
                    {({ active }) => (
                        <button
                            onClick={transferMoney}
                            className={`group flex gap-2 w-full items-center rounded-md py-2 text-sm text-gray-200 hover:text-white`}>
                                <FaMoneyCheckDollar />
                                Add Money
                        </button>
                    )}
                    </MenuItem>
                </TransitionWrapper>
            </Menu>
        </>
    )
}