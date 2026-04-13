import { Link } from "react-router-dom"
import Title from "./title";
import { RiProgress3Line, RiCheckboxCircleFill, RiCloseCircleFill } from "react-icons/ri"
import { formatCurrency } from "../libs";


const RecentTransactions = ({ transactions }) => {
    return (
        <div className="w-full flex-1 overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-6 shadow-lg shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-950 dark:shadow-none">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <Title title="Latest Transactions" />
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Review your most recent payments, deposits, and status updates.
                    </p>
                </div>
                <Link
                    to="/transactions"
                    className="inline-flex items-center rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition hover:border-violet-200 hover:bg-violet-100 dark:border-slate-800 dark:bg-slate-900 dark:text-violet-300 dark:hover:border-slate-700"
                >
                    View All
                </Link>
            </div>

            <div className="mt-6 overflow-x-auto">
                <table className="min-w-full table-auto border-separate border-spacing-y-3 text-left">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Date</th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Description</th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Status</th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Source</th>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions?.length > 0 ? (
                            transactions.map((item, index) => (
                                <tr key={index} className="rounded-[1.5rem] bg-slate-50 transition hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800">
                                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                                        {new Date(item?.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item?.description}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{item?.note || item?.category || 'Transaction details'}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                            {item?.status === 'Pending' && <RiProgress3Line className="text-yellow-500" />}
                                            {item?.status === 'Completed' && <RiCheckboxCircleFill className="text-emerald-500" />}
                                            {item?.status === 'Failed' && <RiCloseCircleFill className="text-rose-500" />}
                                            {item?.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">{item?.source || 'N/A'}</td>
                                    <td className={`px-4 py-4 text-right text-sm font-semibold ${item?.type === 'Expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {item?.type === 'Expense' ? '-' : '+'} {formatCurrency(item?.amount || 0)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                    No recent transactions available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RecentTransactions



          