import React, { useEffect } from 'react'
import { useState } from 'react';
import Loading from '../components/loading';
import api from '../libs/apiCall';
import { toast } from 'sonner';
import { IoSearchOutline } from 'react-icons/io5';
import { CiExport } from 'react-icons/ci';
import { FaPlus } from 'react-icons/fa';
import { RiProgress3Line, RiCheckboxCircleFill, RiCloseCircleFill } from 'react-icons/ri';
import Title from '../components/title';
import DateRange from '../components/date-range';
import { useSearchParams } from 'react-router-dom';
import { exportToExcel, formatCurrency } from '../libs';
import Input from '../components/ui/input';
import AddTransaction from '../components/add-transaction';
import ViewTransaction from '../components/view-transaction';


const Transactions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [isOpenTop, setIsOpenTop] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  

  const [search, setSearch] = useState("");
  const startDate = searchParams.get("df") || "";
  const endDate = searchParams.get("dt") || "";


  const handleViewTransaction = (el) => {
    setSelected(el);
    setIsOpenView(true);
  };

  const fetchTransactions = async () => {
    try {
      const URL = `/transaction?df=${startDate}&dt=${endDate}&s=${search}`;
      const { data: res } = await api.get(URL);

      setData(res?.data);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
      if (error?.response?.data?.status === "auth failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
  }
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchParams({
      df: startDate,
      dt: endDate,
  });
  }
  useEffect(() => {
    setIsLoading(true);
    fetchTransactions();
  }, [startDate, endDate]);

  if (isLoading) {
    return <Loading />;
  }


  return (
    <>
    <div className="w-full py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Title title="Transactions Activity" />
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <DateRange />
          <form onSubmit={(e) => handleSearch(e)}>
            <div className="w-full flex items-center gap-2 border-gray-300 dark:border-gray-600 rounded-md px-2 py-2">
              <IoSearchOutline className="text-xl text-gray-600 dark:text-gray-500"/>
              <Input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none group bg-transparent text-gray-700 dark:text-400 placeholder:text-gray-500"
              />
            </div>
          </form>
          <button
            onClick={() => setIsOpen(true)}
            className="py-4 px-2 rounded text-white bg-black dark:bg-violet-800 flex items-center justify-center gap-2 border border-black dark:border-violet-800"
          >
            <FaPlus size={16} />
            Pay
          </button>
          <button
            onClick={() => exportToExcel(data, `Transaction ${startDate}-${endDate}`)}
            className="flex items-center gap-2 text-black dark:text-gray-300"
          >
            <CiExport size={16} />
            Export
          </button>
        </div>
      </div>

      <div>
        {data?.length === 0 ? (
          <div className="w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-700 text-lg">
            <span>No Transactions Found</span>
          </div>
        ) : (
          <>
          <table className="w-full">
            <thead className="w-full border-b border-gray-200 dark:border-gray-700">
              <tr className="w-full text-black dark:text-gray-400 text-left">
              <th className="py-2"></th>
              <th className="py-2 px-2"></th>
              <th className="py-2 px-2"></th>
              <th className="py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr
                  key={index}
                  className="w-full border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-500"
                >
                  <td className="py-4">
                    <p className="w-24 md:w-auto">
                      {new Date(item.createdat || item.createdAt).toDateString()}
                    </p>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex flex-col w-56 md:w-auto">
                      <p className="text-base 2xl:text-lg text-black dark:text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {item.status === "pending" && <RiProgress3Line className="text-yellow-500" />}
                      {item.status === "Completed" && <RiCheckboxCircleFill className="text-emerald-500" />}
                      {item.status === "Rejected" && <RiCloseCircleFill className="text-rose-500" />}
                      <span>{item?.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2"></td>
                  <td className="py-4 text-black dark:text-400 text-base font-medium">
                    <span
                      className={`${item?.type === "income" ? "text-green-500" : "text-red-500"} text-lg font-bold ml-1`}
                    >
                      {item?.type === "income" ? "+" : "-"}
                    </span>
                    {formatCurrency(item?.amount)}
                  </td>
                  <td className="py-4 px-2">
                    <button
                      onClick={() => handleViewTransaction(item)}
                      className="outline text-violet-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> 
          </>
        )}
      </div>
    </div>
    <AddTransaction
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      refresh={fetchTransactions}
      key={new Date().getTime()}
      />

    <ViewTransaction
      isOpen={isOpenView}
      setIsOpen={setIsOpenView}
      data={selected}
    />
    </>
  );
}

export default Transactions;