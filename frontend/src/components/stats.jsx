import { Card } from "./ui/card";
import { BsCurrencyDollar, BsCashCoin, BsCreditCard } from "react-icons/bs";
import { formatCurrency } from "../libs";


const ICON_STYLES = {
    "bg-blue-500": "bg-blue-500",
    "bg-green-500": "bg-green-500",
    "bg-yellow-500": "bg-yellow-500",
};

const Stats = ({ dt }) => {
    const data = [
        {
            label: "Available Balance",
            amount: dt?.balance,
            increase: 10.5,

            icon: <BsCurrencyDollar className="text-white text-xl" />,
        },
        {
            label: "Total Income",
            amount: dt?.income,
            increase: 5.2,

            icon: <BsCashCoin className="text-white text-xl" />,

        },
        {
            label: "Total Expense",
            amount: dt?.expense,
            increase: -3.8,

            icon: <BsCreditCard className="text-white text-xl" />,
            
        },
    ];

    const ItemCard = ({ item, index }) => {
        return (
            <Card className="flex items-center justify-between w-full h-48 gap-4 p-4">
                <div className="flex items-center gap-4 p-4">
                    <div className={`p-3 rounded-lg ${ICON_STYLES[Object.keys(ICON_STYLES)[index]]}`}>
                        {item.icon}
                    </div>
                    
                    <div className="space-y-3">
                        <span className={`text-sm font-medium ${item.increase >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {item.label}
                        </span>
                        <p className="text-base text-gray-50 md:text-lg">
                            {formatCurrency(item?.amount || 0)}
                        </p>
                        <span className={`text-sm font-medium ${item.increase >= 0 ? "text-green-500" : "text-red-500"}`}>
                            Overall {item.label}
                        </span>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data?.map((item, index) => (
                <ItemCard key={index} item={item} index={index} />
            ))}
        </div>
    );
};

export default Stats;
