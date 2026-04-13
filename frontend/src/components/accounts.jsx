import { Link } from "react-router-dom"
import Title from "./title"
import { formatCurrency, maskAccountNumber } from "../libs"
import { FaBtc, FaPaypal } from "react-icons/fa"
import { RiVisaLine } from "react-icons/ri"
import { BsCashCoin } from "react-icons/bs"



const ICONS = {
    crypto: (
        <div className="w-6 h-6 rounded-full from-purple-500 to-pink-500 flex items-center justify-center text-white">
            <FaBtc size={25} />
        </div>
    ),

    "visa debit card": (
        <div>
            <RiVisaLine size={25} className="text-blue-500" />
        </div>
    ),

    "cash": (
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
            <BsCashCoin size={25} />
        </div>
    ),
    paypal: (
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <FaPaypal size={25} />
        </div>
    )
}

const Accounts = ({ data }) => {
    return (
        <div className="w-full md:w-1/2 h-auto bg-white dark:bg-black/20 rounded-lg shadow-md p-4"> 
            <Title title="Accounts" />
            <Link to="/accounts" className="text-sm text-blue-500 hover:underline mb-4 inline-block">
                View all your accounts
            </Link>
            
            <div className="space-y-6">
                {data?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    {ICONS[item?.account_name?.toLowerCase()]}
                    <p className="text-base font-medium flex items-center gap-2 mb-4">
                        {item.account_name}
                    </p>
                    <span className="text-sm text-gray-500">
                        {maskAccountNumber(item.account_number)}
                    </span>
                    </div>
                    <div className="text-right">
                        <p className="text-lg 2xl:text-xl text-black dark:text-gray-400 font-medium">
                            {formatCurrency(item?.account_balance || 0)}
                        </p>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}

export default Accounts;