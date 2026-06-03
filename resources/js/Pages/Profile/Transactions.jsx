import './../../../css/profile.css';
import './../../../css/auth.css';
import './../../../css/form.css';
import './../../../css/transactions.css';
import './../../../css/gift.css';
import '../../../css/home.css';
import Tabs from '@/Components/UI/Tabs';
import {Head, usePage} from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import React, {useEffect, useState} from 'react';
import Button from "@/Components/UI/Button.jsx";
import {Img} from "@/Components/UI/Content.jsx";
import Modal from "@/Components/Modal.jsx";
import ModalContent from "@/Components/Modals/ModalContent.jsx";
import {TextInput} from "@/Components/UI/Form.jsx";
import UpdatePayPalForm from './Partials/UpdatePayPalForm.jsx';

export default function Transactions({sentGifts, receivedGifts, donations, top_ups, balance_divider, withdrawals, fromStripe, paypalWithdrawals}) {
    const {auth} = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [activeDepositCard, setActiveDepositCard] = useState(null);
    const [customAmount, setCustomAmount] = useState(0.00);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState({key: 'created_at', direction: 'desc'});
    const [recipientFilter, setRecipientFilter] = useState('');
    const [senderFilter, setSenderFilter] = useState('');
    const [balance, setBalance] = useState(auth.user?.balance);
    useEffect(() => {
        if (fromStripe) {
            openModal(null, "withdrawal", null);
        }
    }, [fromStripe]);


    const openModal = (item, type, author) => {
        setModalData({item, author});
        setModalType(type);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalData(null);
        setModalType(null);
        setActiveDepositCard(null);
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const refillSuccessParam = params.get('refill_success');
        const openWithdrawal = params.get('open') === 'withdrawal';

        if (refillSuccessParam === '1') {
            openModal(null, "refill-success");
            const url = new URL(window.location);
            params.delete('refill_success');
            window.history.replaceState({}, '', url.pathname + (params.toString() ? '?' + params.toString() : ''));
        } else if (openWithdrawal) {
            openModal(null, "withdrawal", null);
            const url = new URL(window.location);
            params.delete('open');
            window.history.replaceState({}, '', url.pathname + (params.toString() ? '?' + params.toString() : ''));
        }
    }, []);

    const formatDate = (date) => new Date(date).toLocaleDateString();

    const sortData = (data, key, direction) => {
        return [...data].sort((a, b) => {
            const aValue = key.includes('.') ? key.split('.').reduce((obj, k) => obj?.[k], a) : a[key];
            const bValue = key.includes('.') ? key.split('.').reduce((obj, k) => obj?.[k], b) : b[key];
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return direction === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return direction === 'asc'
                ? String(aValue || '').localeCompare(String(bValue || ''))
                : String(bValue || '').localeCompare(String(aValue || ''));
        });
    };

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const filterData = (data, filter, key) => {
        return data.filter((item) => item[key]?.name?.toLowerCase().includes(filter.toLowerCase()));
    };

    const filteredSentGifts = filterData(sortData(sentGifts, sortConfig.key, sortConfig.direction), recipientFilter, 'recipient');
    const filteredReceivedGifts = filterData(sortData(receivedGifts, sortConfig.key, sortConfig.direction), senderFilter, 'sender');

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? '↑' : '↓';
        }
        return '';
    };

    const sortedDonations = sortData(donations, sortConfig.key, sortConfig.direction);
    const sortedTopUps = sortData(top_ups, sortConfig.key, sortConfig.direction);
    const sortedWithdrawals = sortData(withdrawals, sortConfig.key, sortConfig.direction);
    const sortedPaypalWithdrawals = sortData(paypalWithdrawals, sortConfig.key, sortConfig.direction);

    return (
        <GuestLayout>
            <Head title="Transactions"/>
            <div className="os-profile">
                <div className="os-title-block os-title-block--p-lg">
                    <div className="os-title os-title--h2">Transactions</div>
                </div>
                <div className="os-container">
                    <div className="os-transactions">
                        <div className="os-transactions__title">
                            <div className="os-title os-title--h2">Balance</div>
                            <div className="os-transactions__balance">
                                <div className="os-title os-title--h2">${balance  / balance_divider}</div>
                                {/* <Button fontWeight="bold" gap={22} icon={true} fullWidthMob={true}
                                        onClick={() => openModal(null, "withdrawal", modalData)}>
                                    Cash out
                                    <Img src="/img/icons/btn-arrow.svg" width={14} height={14}/>
                                </Button> */}
                                <Button fontWeight="bold" gap={22} icon={true} fullWidthMob={true}
                                        onClick={() => openModal(null, "withdrawal_paypal", modalData)}>
                                    Cash out
                                    <Img src="/img/icons/btn-arrow.svg" width={14} height={14}/>
                                </Button>
                                <Button
                                    fontWeight="bold"
                                    gap={22}
                                    fullWidthMob={true}
                                    variant="outline"
                                    onClick={() => openModal(null, "deposit", modalData)}
                                >
                                    Deposit
                                </Button>
                            </div>
                        </div>
                        <Tabs categories={['Sent Gifts', 'Received Gifts', 'Top Ups', 'Manage Paypal', 'Withdrawals']}>
                            <div className="os-transactions__table-wrapper">
                                <TextInput
                                    type="text"
                                    className="os-transactions__filter"
                                    placeholder="Filter by recipient"
                                    value={recipientFilter}
                                    onChange={(e) => setRecipientFilter(e.target.value)}
                                />
                                <table className="os-transactions__table">
                                    <thead className="os-transactions__header">
                                    <tr>
                                        <th onClick={() => handleSort('created_at')}>Date {getSortIndicator('created_at')}</th>
                                        <th onClick={() => handleSort('recipient.name')}>Recipient {getSortIndicator('recipient.name')}</th>
                                        <th onClick={() => handleSort('gift.name')}>Gift {getSortIndicator('gift.name')}</th>
                                        <th onClick={() => handleSort('gift.cost')}>Coins {getSortIndicator('gift.cost')}</th>
                                    </tr>
                                    </thead>
                                    <tbody className="os-transactions__body">
                                    {filteredSentGifts.length === 0 ? (
                                        <tr className="os-transactions__row">
                                            <td colSpan="4" className="os-transactions__empty">
                                                No sent gift transactions found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredSentGifts.map((transaction) => (
                                            <tr key={transaction.id} className="os-transactions__row">
                                                <td className="os-transactions__date">{formatDate(transaction.created_at)}</td>
                                                <td className="os-transactions__recipient">{transaction.recipient?.name || 'Unknown'}</td>
                                                <td className="os-transactions__gift">{transaction.gift?.name || 'Unknown'}</td>
                                                <td className="os-transactions__price">{transaction.gift?.cost || 'N/A'}</td>
                                            </tr>
                                        )))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="os-transactions__table-wrapper">
                                <TextInput
                                    type="text"
                                    className="os-transactions__filter"
                                    placeholder="Filter by sender"
                                    value={senderFilter}
                                    onChange={(e) => setSenderFilter(e.target.value)}
                                />
                                <table className="os-transactions__table">
                                    <thead className="os-transactions__header">
                                    <tr>
                                        <th className="os-transactions__column" onClick={() => handleSort('created_at')}>Date {getSortIndicator('created_at')}</th>
                                        <th className="os-transactions__column" onClick={() => handleSort('sender.name')}>Sender {getSortIndicator('sender.name')}</th>
                                        <th className="os-transactions__column" onClick={() => handleSort('gift.name')}>Gift {getSortIndicator('gift.name')}</th>
                                        <th className="os-transactions__column" onClick={() => handleSort('gift.cost')}>Cost {getSortIndicator('gift.cost')}</th>
                                    </tr>
                                    </thead>
                                    <tbody className="os-transactions__body">
                                    {filteredReceivedGifts.length === 0 ? (
                                        <tr className="os-transactions__row">
                                            <td colSpan="4" className="os-transactions__empty">
                                                No received gift transactions found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredReceivedGifts.map((transaction) => (
                                            <tr key={transaction.id} className="os-transactions__row">
                                                <td className="os-transactions__date">{formatDate(transaction.created_at)}</td>
                                                <td className="os-transactions__sender">{transaction.sender?.name || 'Unknown'}</td>
                                                <td className="os-transactions__gift">{transaction.gift?.name || 'Unknown'}</td>
                                                <td className="os-transactions__price">{transaction.gift?.cost || 'N/A'}</td>
                                            </tr>
                                        )))}
                                    </tbody>
                                </table>
                            </div>
                            {/* <div className="os-transactions__table-wrapper">
                                <table className="os-transactions__table">
                                    <thead className="os-transactions__header">
                                    <tr>
                                        <th className="os-transactions__column" onClick={() => handleSort('created_at')}>Date {getSortIndicator('created_at')}</th>
                                        <th className="os-transactions__column" onClick={() => handleSort('funds')}>Amount {getSortIndicator('funds')}</th>
                                    </tr>
                                    </thead>
                                    <tbody className="os-transactions__body">
                                    {sortedDonations.length === 0 ? (
                                        <tr className="os-transactions__row">
                                            <td colSpan="2" className="os-transactions__empty">
                                                No donations found.
                                            </td>
                                        </tr>
                                    ) : (
                                        sortedDonations.map((donation) => (
                                            <tr key={donation.id} className="os-transactions__row">
                                                <td className="os-transactions__date">{formatDate(donation.created_at)}</td>
                                                <td className="os-transactions__amount">${donation.funds}</td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div> */}
                            <div className="os-transactions__table-wrapper">
                                <table className="os-transactions__table">
                                    <thead className="os-transactions__header">
                                    <tr>
                                        <th className="os-transactions__column" onClick={() => handleSort('created_at')}>Date {getSortIndicator('created_at')}</th>
                                        <th className="os-transactions__column" onClick={() => handleSort('coins')}>Coins {getSortIndicator('coins')}</th>
                                        <th className="os-transactions__column" onClick={() => handleSort('funds')}>Amount {getSortIndicator('funds')}</th>
                                    </tr>
                                    </thead>
                                    <tbody className="os-transactions__body">
                                    {sortedTopUps.length === 0 ? (
                                        <tr className="os-transactions__row">
                                            <td colSpan="3" className="os-transactions__empty">
                                                No top ups found.
                                            </td>
                                        </tr>
                                    ) : (
                                        sortedTopUps.map((top_up) => (
                                            <tr key={top_up.id} className="os-transactions__row">
                                                <td className="os-transactions__date">{formatDate(top_up.created_at)}</td>
                                                <td className="os-transactions__coins">{top_up.coins}</td>
                                                <td className="os-transactions__amount">${top_up.funds}</td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            {/* <div className="os-transactions__table-wrapper">
                                <table className="os-transactions__table">
                                    <thead className="os-transactions__header">
                                    <tr>
                                        <th className="os-transactions__column" onClick={() => handleSort('created_at')}>
                                            Date {getSortIndicator('created_at')}
                                        </th>
                                        <th className="os-transactions__column" onClick={() => handleSort('amount')}>
                                            Amount {getSortIndicator('amount')}
                                        </th>
                                        <th className="os-transactions__column" onClick={() => handleSort('external_account_type')}>
                                            Account Type {getSortIndicator('external_account_type')}
                                        </th>
                                        <th className="os-transactions__column" onClick={() => handleSort('stripe_transaction_id')}>
                                            Stripe Transaction ID {getSortIndicator('stripe_transaction_id')}
                                        </th>
                                        <th className="os-transactions__column" onClick={() => handleSort('stripe_account_id')}>
                                            Stripe Account ID {getSortIndicator('stripe_account_id')}
                                        </th>
                                        <th className="os-transactions__column" onClick={() => handleSort('arrival_date')}>
                                            Arrival Date {getSortIndicator('arrival_date')}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="os-transactions__body">
                                        {sortedWithdrawals.length === 0 ? (
                                            <tr className="os-transactions__row">
                                                <td colSpan="7" className="os-transactions__empty">
                                                    No withdrawals found.
                                                </td>
                                            </tr>
                                        ) : (
                                            sortedWithdrawals.map((withdrawal) => (
                                                <tr key={withdrawal.id} className="os-transactions__row">
                                                    <td className="os-transactions__date">{formatDate(withdrawal.created_at)}</td>
                                                    <td className="os-transactions__amount">${withdrawal.amount}</td>
                                                    <td className="os-transactions__account-type">{withdrawal.external_account_type}</td>
                                                    {/*<td className="os-transactions__status">{withdrawal.status}</td>*/}
                                                    {/* <td className="os-transactions__stripe-transaction-id">{withdrawal.stripe_transaction_id || 'N/A'}</td>
                                                    <td className="os-transactions__stripe-account-id">{withdrawal.stripe_account_id || 'N/A'}</td>
                                                    <td className="os-transactions__arrival-date">
                                                        {withdrawal.arrival_date ? formatDate(withdrawal.arrival_date) : 'N/A'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div> */}
                            <div className="os-transactions__table-wrapper">
                                <UpdatePayPalForm className="max-w-xl"/>
                            </div>
                            <div className="os-transactions__table-wrapper">
                                <table className="os-transactions__table">
                                    <thead className="os-transactions__header">
                                    <tr>
                                        <th className="os-transactions__column text-center" onClick={() => handleSort('created_at')}>Date {getSortIndicator('created_at')}</th>
                                        <th className="os-transactions__column" onClick={() => handleSort('payout_batch_id')}>Transaction ID {getSortIndicator('payout_batch_id')}</th>
                                        <th className="os-transactions__column" onClick={() => handleSort('batch_status')}>Status {getSortIndicator('batch_status')}</th>
                                        <th className="os-transactions__column" onClick={() => handleSort('amount')}>Amount {getSortIndicator('amount')}</th>
                                    </tr>
                                    </thead>
                                    <tbody className="os-transactions__body">
                                    {sortedPaypalWithdrawals.length === 0 ? (
                                        <tr className="os-transactions__row">
                                            <td colSpan="3" className="os-transactions__empty">
                                                No Withdrawals found.
                                            </td>
                                        </tr>
                                    ) : (
                                        sortedPaypalWithdrawals.map((paypalWithdrawal) => (
                                            <tr key={paypalWithdrawal.id} className="os-transactions__row">
                                                <td className="os-transactions__date">{formatDate(paypalWithdrawal.created_at)}</td>
                                                <td className="os-transactions__payout_batch_id">{paypalWithdrawal.payout_batch_id}</td>
                                                <td className="os-transactions__batch_status">{paypalWithdrawal.batch_status}</td>
                                                <td className="os-transactions__batch_amount">${paypalWithdrawal.amount}</td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
            {showModal && modalData && (
                <Modal show={showModal} onClose={closeModal} maxWidth={modalType === 'deposit' ? 'xl' : 'md'} className={'modal__panel--' + modalType}>
                    <ModalContent
                        modalType={modalType}
                        modalData={modalData}
                        user={auth.user}
                        openModal={openModal}
                        closeModal={closeModal}
                        activeDepositCard={activeDepositCard}
                        handleDepositCardClick={setActiveDepositCard}
                        customAmount={customAmount}
                        setLoading={setLoading}
                        setCustomAmount={setCustomAmount}
                        setBalance={setBalance}
                    />
                </Modal>
            )}
        </GuestLayout>
    );
}
