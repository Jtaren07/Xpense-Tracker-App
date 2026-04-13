import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Input from "./ui/input";


const getDateSevenDaysAgo = () => {
  const today = new Date();
  today.setDate(today.getDate() - 7);
  return today.toISOString().split("T")[0];
};

const DateRange = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const todayString = new Date().toISOString().split("T")[0];
  const sevenDaysAgo = getDateSevenDaysAgo();

  const [dateFrom, setDateFrom] = useState(() => {
    const df = searchParams.get("df");
    if (df && new Date(df).getTime() <= new Date().getTime()) {
      return df;
    }
    return sevenDaysAgo;
  });

  const [dateTo, setDateTo] = useState(() => {
    const dt = searchParams.get("dt");
    if (dt && new Date(dt).getTime() <= new Date().getTime()) {
      return dt;
    }
    return todayString;
  });

  useEffect(() => {
    if (new Date(dateFrom).getTime() > new Date(dateTo).getTime()) {
      setDateTo(dateFrom);
      return;
    }

    setSearchParams({
      df: dateFrom,
      dt: dateTo,
    });
  }, [dateFrom, dateTo, setSearchParams]);

  const handleDateFromChange = (e) => {
    const df = e.target.value;
    setDateFrom(df);

    if (new Date(df).getTime() > new Date(dateTo).getTime()) {
      setDateTo(df);
    }
  };

  const handleDateToChange = (e) => {
    const dt = e.target.value;
    setDateTo(dt);

    if (new Date(dt).getTime() < new Date(dateFrom).getTime()) {
      setDateFrom(dt);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="w-full sm:w-1/2">
        <label
          htmlFor="dateFrom"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          From
        </label>
        <Input
          id="dateFrom"
          type="date"
          max={todayString}
          value={dateFrom}
          onChange={handleDateFromChange}
          name="dateFrom"
          className="w-full text-sm border dark:border-gray-800 dark:bg-slate-900 dark:placeholder:text-gray-500 dark:text-gray-100"
        />
      </div>

      <div className="w-full sm:w-1/2">
        <label
          htmlFor="dateTo"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          To
        </label>
        <Input
          id="dateTo"
          type="date"
          min={dateFrom}
          max={todayString}
          value={dateTo}
          onChange={handleDateToChange}
          name="dateTo"
          className="w-full text-sm border dark:border-gray-800 dark:bg-slate-900 dark:placeholder:text-gray-500 dark:text-gray-100"
        />
      </div>
    </div>
  );
};

export default DateRange;
