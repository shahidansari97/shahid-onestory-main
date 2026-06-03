import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Form, Group, InputBox, Alert, Button} from "@/Components/Dashboard/Form.jsx";
import {useState} from "react";
import axios from "axios";
import Wrapper from "@/Components/Dashboard/Wrapper.jsx";
import SectionBox from '@/Components/Dashboard/SectionBox.jsx';
import ListView from '@/Components/Dashboard/ListView.jsx';

export default function Wallets({ auth, founderFunds, toDonateFunds, charityFunds, founder_percent, donation_percent, coins_to_money_divider, variants, active_variant, userDonations }) {
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

    const variantsColumns = [
        {
            key: 'statement',
            label: 'Statement'
        },
        {
            key: 'created_at',
            label: 'Created At',
            render: variant => new Date(variant.created_at).toLocaleDateString()
        },
        {
            key: 'funds',
            label: 'Balance',
            render: variant => `$${variant.funds}`
        }
    ];

    const transactionsColumns = [
        {
            key: 'created_at',
            label: 'Date',
            render: donation => new Date(donation.created_at).toLocaleDateString()
        },
        {
            key: 'variant.statement',
            label: 'Variant',
            render: donation => donation.variant?.statement
        },
        {
            key: 'comment',
            label: 'Comment',
            render: donation => donation?.variant?.id == null ? 'The money has been withdrawn from the system' : ''
        },
        {
            key: 'amount',
            label: 'Amount',
            render: donation => `${donation?.variant?.id == null ? '-$' : '$'}${donation?.funds}`
        }
    ];

    return (
        <AuthenticatedLayout>
            <Wrapper title='Wallets & Percents'>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 ">
                    <SectionBox title="Odelia">
                        <div
                            className="px-4 py-2.5 mt-4 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
                            <div className="mt-1 text-base text-slate-500">$ {founderFunds}</div>
                        </div>
                    </SectionBox>
                    <SectionBox title="To Donate">
                        <div
                            className="px-4 py-2.5 mt-4 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
                            <div className="mt-1 text-base text-slate-500">$ {donationFunds}</div>
                        </div>
                        {active_variant?.statement ? (
                            <Button
                                onClick={handleTransfer}
                                disabled={walletLoading || donationFunds === 0}
                                className="mt-6 w-full"
                            >
                                {walletLoading ? 'Transferring...' : `Transfer to ${active_variant?.statement}`}
                            </Button>
                            ) : (
                                <div>
                                    Set the donation goal in the donation page editing form to transfer the funds.
                                </div>
                        )}
                        {walletError && <p className="text-red-500 mt-2">{walletError}</p>}
                    </SectionBox>
                    <SectionBox title="Donation">
                        <div
                            className="px-4 py-2.5 mt-4 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
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
                    </SectionBox>
                </div>
                {walletMessage && <Alert className="mt-2">{walletMessage}</Alert>}
                <Form  onSubmit={handleSubmit}>
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
                <SectionBox title="Variants">
                    <ListView
                        onSearch={() => {
                        }}
                        columns={variantsColumns}
                        data={variants}
                    />
                </SectionBox>

                <SectionBox title="Your Transactions">
                    <ListView
                        onSearch={() => {
                        }}
                        columns={transactionsColumns}
                        data={userDonations}
                    />
                </SectionBox>
            </Wrapper>
        </AuthenticatedLayout>
    );
}
