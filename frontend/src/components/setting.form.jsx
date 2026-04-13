import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useStore from '../store';
import { Combobox } from '@headlessui/react';
import { fetchCountries } from '../libs';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { Button } from './ui/button';
import api from '../libs/apiCall';
import { toast } from 'sonner';
import { BiLoader } from 'react-icons/bi';





const SettingsForm = () => {
    const { user, theme, setTheme } = useStore((state) => state);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstname: user?.firstname,
            lastname: user?.lastname,
            email: user?.email,
            contact: user?.contact,
        },
    });

    const [selectedCountry, setSelectedCountry] = useState(
        user?.country ? { country: user.country, currency: user.currency } : null
    );
            
    const [ query, setQuery ] = useState("");
    const [ countriesData, setCountriesData ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            const newData = {
                ...values,
                country: selectedCountry?.country || user?.country,
                currency: selectedCountry?.currency || user?.currency,
            };
            const { data: res } = await api.put(`/user`, newData);
            if (res?.status === "success") {
                const newUser = {
                    ...res.user,
                    token: user.token,
                };
                localStorage.setItem("user", JSON.stringify(newUser));
                toast.success(res?.message || "Profile updated successfully!");
            }
        } catch (error) {
            console.error("Something went wrong:", error);
            toast.error(error?.response?.data?.message || error?.message || "An error occurred while updating the profile");
        } finally {
            setLoading(false);
        }
    };

    const toggleTheme = (val) => {
        setTheme(val);
        localStorage.setItem("theme", val);
    };

const filteredCountries =
        query === ""
        ? countriesData
        : countriesData.filter((country) =>
            country.country.toLowerCase().includes(query.toLowerCase()) ||
            country.country.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, ""))
        );

    const getCountriesList = async () => {
        setLoading(true);
        try {
            const data = await fetchCountries();
            console.log('Fetched countries:', data.length);
            setCountriesData(data);
        } catch (error) {
            console.error('Error fetching countries:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCountriesList();
    }, []);

    const Countries = () => {
        return (
            <div className="w-full relative">
                <Combobox value={selectedCountry} onChange={setSelectedCountry} nullable>
                    <div className="w-full">
                        <Combobox.Input
                            className="w-full text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
                            displayValue={(country) => country?.country || ""}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Select a country..."
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </Combobox.Button>
                    </div>
                    {query === "" ? null : (
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-200 dark:border-gray-600">
                            {filteredCountries.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                                    No results found.
                                </div>
                            ) : (
                                filteredCountries?.slice(0, 10).map((country, index) => (
                                    <Combobox.Option
                                        key={country.country + index}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 px-4 ${
                                                active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-100'
                                            }`
                                        }
                                        value={country}
                                    >
                                        {({ selected, active }) => (
                                            <div className="flex items-center">
                                                <img
                                                    src={country.flag}
                                                    alt={country.country}
                                                    className="w-6 h-6 rounded-full mr-3"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                    {country.country}
                                                </span>
                                                {selected && (
                                                    <span className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                                                        active ? 'text-white' : 'text-blue-500'
                                                    }`}>
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    )}
                </Combobox>
            </div>
        )
    }




    return (
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-gray-200 bg-white p-8 shadow-xl shadow-slate-200/30 dark:border-slate-700 dark:bg-slate-950 dark:shadow-none">
            <div className="mb-8 space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-violet-600 dark:text-violet-400">Profile Settings</p>
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Manage your profile</h2>
                <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Update your personal details, country preferences, and appearance settings from one place.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="firstname" className="block text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                        <input
                            disabled={loading}
                            id="firstname"
                            type="text"
                            placeholder="Alex"
                            {...register('firstname', { required: 'First name is required' })}
                            className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20"
                        />
                        {errors.firstname && <p className="text-sm text-rose-500">{errors.firstname.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="lastname" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                        <input
                            disabled={loading}
                            name="lastname"
                            id="lastname"
                            type="text"
                            placeholder="Smith"
                            {...register('lastname', { required: 'Last name is required' })}
                            className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20"
                        />
                        {errors.lastname && <p className="text-sm text-rose-500">{errors.lastname.message}</p>}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                        <input
                            disabled={loading}
                            id="email"
                            type="email"
                            placeholder="alex.smith@example.com"
                            {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                            className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20"
                        />
                        {errors.email && <p className="text-sm text-rose-500">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="contact" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contact</label>
                        <input
                            disabled={loading}
                            name="contact"
                            id="contact"
                            type="text"
                            placeholder="123-456-7890"
                            {...register('contact', { required: 'Contact is required' })}
                            className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20"
                        />
                        {errors.contact && <p className="text-sm text-rose-500">{errors.contact.message}</p>}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Country</label>
                        <div className="relative">
                            <Countries />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="currency" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Currency</label>
                        <select
                            id="currency"
                            className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20"
                        >
                            <option>{selectedCountry?.currency || user?.currency}</option>
                        </select>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Appearance</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Customize how your dashboard looks</p>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="theme" className="sr-only">Theme</label>
                        <select
                            id="theme"
                            className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20"
                            defaultValue={theme}
                            onChange={(e) => toggleTheme(e.target.value)}
                        >
                            <option>Light</option>
                            <option>Dark</option>
                        </select>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Language</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Select your preferred language.</p>
                    </div>
                    <div>
                        <select className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-400 dark:focus:ring-violet-500/20">
                            <option value="English">English</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3 border-t border-gray-200 pt-8 dark:border-slate-700">
                    <div className="flex gap-3">
                        <Button
                            type="reset"
                            variant="outline"
                            loading={loading}
                            className="w-full sm:w-40"
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={loading}
                            className="rounded-3xl bg-violet-600 px-6 text-white hover:bg-violet-700"
                        >
                            {loading ? <BiLoader className="animate-spin text-white" /> : 'Save'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default SettingsForm;

