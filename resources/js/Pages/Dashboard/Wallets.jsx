import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Form, Group, InputBox, Alert, Button} from "@/Components/Dashboard/Form.jsx";
import {useState} from "react";
import axios from "axios";
import {Link} from "@inertiajs/react";

export default function Wallets({ auth, founderFunds, toDonateFunds, charityFunds, founder_percent, donation_percent, coins_to_money_divider, variants, active_variant_id, userDonations }) {
    const [walletLoading, setWalletLoading] = useState(false);
    const [walletError, setWalletError] = useState(null);
    const [walletMessage, setWalletMessage] = useState(null);
    const [donationFunds, setDonationFunds] = useState(toDonateFunds);
    const [charityBalance, setCharityBalance] = useState(charityFunds);

    const [formValues, setFormValues] = useState({
        founder_percent,
        donation_percent,
        coins_to_money_divider
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formMessage, setFormMessage] = useState(null);

    const handleTransfer = () => {
        setWalletLoading(true);
        setWalletError(null);
        setWalletMessage(null);

        axios.post(route('admin.transfer.to.cause'))
            .then(response => {
                setCharityBalance(prev => parseFloat(prev) + parseFloat(donationFunds));
                setDonationFunds(0);
                setWalletMessage(response.data.success);
            })
            .catch(err => {
                setWalletError(err.response?.data?.error || 'Something went wrong');
            })
            .finally(() => {
                setWalletLoading(false);
            });
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValues(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);
        setFormMessage(null);

        axios.post(route('admin.wallets.update-percents'), formValues)
            .then(response => {
                setFormMessage(response.data.success);
            })
            .catch(err => {
                setFormError(err.response?.data?.error || 'Something went wrong');
            })
            .finally(() => {
                setFormLoading(false);
            });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Wallets & Percents</h2>}
        >
            <div className="overflow-auto xl:overflow-visible">
                <div className="grid grid-cols-12 gap-5 mt-10">
                    <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-4 box box--stacked">
                        <div className="flex items-center">
                            <div className="-mt-0.5 text-lg font-medium text-primary">Odelia</div>
                        </div>
                        <div
                            className="px-4 py-2.5 mt-4 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
                            <div className="mt-1 text-base text-slate-500">$ {founderFunds}</div>
                        </div>
                    </div>
                    <div className="flex flex-col col-span-12 p-5 justify-center sm:col-span-6 xl:col-span-4 box box--stacked">
                        <div className="flex items-center">
                            <div className="-mt-0.5 text-lg font-medium text-primary">To Donate</div>
                        </div>
                        <div
                            className="px-4 py-2.5 mt-4 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
                            <div className="mt-1 text-base text-slate-500">$ {donationFunds}</div>
                        </div>
                        <Button
                            onClick={handleTransfer}
                            disabled={walletLoading || donationFunds === 0}
                            className="mt-6 w-full"
                        >
                            {walletLoading ? 'Transferring...' : 'Transfer to Monthly Cause'}
                        </Button>
                        {walletError && <p className="text-red-500 mt-2">{walletError}</p>}
                    </div>
                    <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-4 box box--stacked">
                        <div className="flex items-center">
                            <div className="-mt-0.5 text-lg font-medium text-primary">Donation</div>
                        </div>
                        <div className="px-4 py-2.5 mt-4 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
                            <div className="mt-1 text-base text-slate-500">$ {charityBalance}</div>
                        </div>
                        <Button
                            onClick={() => {
                                if (confirm('Are you sure you want to clear your donations?')) {
                                    setWalletLoading(true);
                                    setWalletError(null);
                                    setWalletMessage(null);

                                    axios.post(route('wallets.clear-donations'))
                                        .then(response => {
                                            setDonationFunds(0);
                                            setWalletMessage(response.data.success);
                                        })
                                        .catch(err => {
                                            setWalletError(err.response?.data?.error || 'Something went wrong');
                                        })
                                        .finally(() => {
                                            setWalletLoading(false);
                                        });
                                }
                            }}
                            className="mt-4 w-full"
                        >
                            {walletLoading ? 'Clearing...' : 'Clear Donations'}
                        </Button>

                    </div>
                </div>
                {walletMessage && <Alert className="mt-2">{walletMessage}</Alert>}
                <Form className="mt-5" onSubmit={handleSubmit}>
                    <Group title="Update Percents">
                        <InputBox
                            label="Founder Percent"
                            name="founder_percent"
                            placeholder="Enter founder percent"
                            value={formValues.founder_percent}
                            onChange={handleChange}
                        />
                        <InputBox
                            label="Donation Percent"
                            name="donation_percent"
                            placeholder="Enter donation percent"
                            value={formValues.donation_percent}
                            onChange={handleChange}
                        />
                        <InputBox
                            label="Coins to Money Divider"
                            name="coins_to_money_divider"
                            placeholder="Enter coins to money divider"
                            value={formValues.coins_to_money_divider}
                            onChange={handleChange}
                        />
                    </Group>
                    <Button type="submit" disabled={formLoading}>
                        {formLoading ? 'Saving...' : 'Save'}
                    </Button>
                    {formMessage && <Alert className="mt-2">{formMessage}</Alert>}
                    {formError && <Alert variant={'danger'} className="text-red-500 mt-2">{formError}</Alert>}
                </Form>

            </div>
            <div className="flex flex-col p-5 box box--stacked mt-5">
                <table className="w-full text-left">
                    <thead>
                    <tr>
                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap">#</th>
                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap">Statement</th>
                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap">Created At</th>
                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap">Balance</th>
                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {variants.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="px-5 py-3 text-center dark:border-darkmode-300">No variants available.</td>
                        </tr>
                    ) : (
                        variants.map((variant, index) => (
                            <tr key={variant.id}>
                                <td className="px-5 py-3 border-b dark:border-darkmode-300">{index + 1}</td>
                                <td className="px-5 py-3 border-b dark:border-darkmode-300">{variant.statement}</td>
                                <td className="px-5 py-3 border-b dark:border-darkmode-300">{new Date(variant.created_at).toLocaleDateString()}</td>
                                <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap">{variant.funds}</th>
                                <th className={"font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap " + (active_variant_id == variant.id ? 'bg-success border-success bg-opacity-20 border-opacity-5 text-success dark:border-success dark:border-opacity-20' : '')}>{active_variant_id == variant.id ? 'Active' : ''}</th>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col p-5 box box--stacked mt-5">
                <h3 className="text-lg font-medium mb-4">Your Transactions</h3>
                <table className="w-full text-left">
                    <thead>
                    <tr>
                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap">Date</th>
                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap">Variant</th>
                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap">Comment</th>
                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userDonations.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="px-5 py-3 text-center dark:border-darkmode-300">No transactions found.</td>
                        </tr>
                    ) : (
                        userDonations.map((donation, index) => (
                            <tr key={donation.id}>
                                <td className="px-5 py-3 border-b dark:border-darkmode-300">{new Date(donation.created_at).toLocaleDateString()}</td>
                                <td className="px-5 py-3 border-b dark:border-darkmode-300">{donation?.variant?.statement}</td>
                                <td className="px-5 py-3 border-b dark:border-darkmode-300">{donation?.variant?.id == null ? 'The money has been withdrawn from the system' : ''}</td>
                                <td className="px-5 py-3 border-b dark:border-darkmode-300">{donation?.variant?.id == null ? '-$' :'$'}{donation?.funds}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
