import React, { useState } from 'react';
import { InputLabel, TextInput } from "@/Components/UI/Form.jsx";
import axios from 'axios';
import Button from "@/Components/UI/Button.jsx";
import { usePage } from "@inertiajs/react";
import WithdrawalSuccessModal from './WithdrawalSuccessModal';

export default function WithdrawalModal({ setLoading, setBalance, closeModal ,modalType}) {
    const { auth } = usePage().props;

    const [customAmount, setCustomAmount] = useState(0.00);
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorType, setErrorType] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    console.log("auth",auth);
    const openSuccessModal = () => {
        setShowSuccessModal(true);
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setCustomAmount('');
        setErrorMessage(null);
        setErrorType(null);
    };

    const handleWithdrawal = async () => {
        setErrorMessage(null);
        setErrorType(null);

        if (!customAmount || isNaN(customAmount) || customAmount <= 0) {
            setErrorMessage('Please enter a valid amount.');
            return;
        }

        try {
            setLoading(true);
            const payout_url =  modalType == 'withdrawal' ? route('payout.to-stripe-account') : route('payout.to-paypal-account');
            const response = await axios.post(payout_url, { amount: customAmount });
            console.log('Response:', response);

            if (response.status === 200) {
                const data = response.data;
                if (response.data.new_balance) {
                    setBalance(response.data.new_balance);
                }
                if (data.error && data.error.includes('Please verify your PayPal account first')) {
                    console.log('Verification required detected:', data);
                    const messages = [];


                    if (data.errors) {
                        Object.values(data.errors).forEach(errArray => {
                            if (Array.isArray(errArray)) {
                                errArray.forEach(errMsg => messages.push(errMsg));
                            }
                        });
                    } else if (data.error) {
                        messages.push(data.error);
                    }


                    if (data.requirements) {
                        messages.push(`Requirements: ${data.requirements.join(', ')}`);
                    }

                    setErrorType('verification_required');
                    setErrorMessage(messages.join(' '));
                    return;
                }


                if (data.error) {
                    console.log('Server returned an error in response data:', data);
                    const messages = [];

                    if (data.errors) {
                        Object.values(data.errors).forEach(errArray => {
                            if (Array.isArray(errArray)) {
                                errArray.forEach(errMsg => messages.push(errMsg));
                            }
                        });
                    } else if (data.message) {
                        messages.push(data.message);
                    } else if (data.error) {
                        messages.push(data.error);
                    }

                    if (data.requirements) {
                        messages.push(`Requirements: ${data.requirements.join(', ')}`);
                    }

                    setErrorType(null);
                    setErrorMessage(messages.join(' '));
                } else {
                    console.log('Success response data:', data);
                    openSuccessModal();
                }
            }
        } catch (error) {
            setLoading(false);
            setErrorMessage('Unable to process your request at this moment. Please try again later');
            // if (error.response && error.response.data) {
            //     const data = error.response.data;
            //     const messages = [];

            //     if (data.errors) {
            //         Object.values(data.errors).forEach(errArray => {
            //             if (Array.isArray(errArray)) {
            //                 errArray.forEach(errMsg => messages.push(errMsg));
            //             }
            //         });
            //     } else if (data.message) {
            //         messages.push(data.message);
            //     } else if (data.error) {
            //         messages.push(data.error);
            //     }

            //     if (data.requirements) {
            //         messages.push(`Requirements: ${data.requirements.join(', ')}`);
            //     }

            //     setErrorType(data.type || null);
            //     setErrorMessage(messages.join(' '));
            // } else {
            //     setErrorMessage('Unable to process your request at this moment. Please try again later');
            // }
        } finally {
            setLoading(false);
        }
    };

    const handlePayPalVeryfiedSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.get(route('user.paypal.account.verify'));

            if (response.data.status) {
                // setSuccess(true);
                window.location.href = response.data.url;
                //window.open(response.data.url, "_blank");
            }else{
                console.log("Error data response"+response.data);
                console.log("Error response"+response);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            {showSuccessModal ? (
                <>
                    <img src="/img/icons/done.svg" alt="" className="" width="48" height="48"/>
                    <div className="os-title os-title--h5 os-title--green os-title--bold">You have successfully made the
                        withdrawal. The money will arrive within a few hours.
                    </div>
                    <Button fontWeight={'bold'} onClick={closeModal} fullWidthMob={true}>
                        Go back
                    </Button>
                </>
            ) : (
                (errorType === 'verification_required' || (!auth?.user?.paypal_id && modalType == 'withdrawal')) ? (
                    <>
                        <div className="os-title os-title--h4 os-title--bold">Paypal Verification Required</div>
                        <div className="os-text">
                            You need to verify you paypal account
                        </div>
                        <a
                            className="os-btn os-link os-btn--fs-lg os-btn--primary"
                            onClick={handlePayPalVeryfiedSubmit}
                        >
                            Verify
                        </a>
                        {/* <div className="os-title os-title--h4 os-title--bold">Stripe Connection Required</div>
                        <div className="os-text">
                            You need to add a Stripe account to withdraw funds. Connecting the account needs to be done only once.
                        </div>
                        <a
                            className="os-btn os-link os-btn--fs-lg os-btn--primary"
                            href="https://onestoryplanet.com/stripe/onboarding"
                        >
                            Go to Connect
                        </a> */}
                        {errorMessage && (
                            <div className="os-text os-text--c-red os-gift-modal__error">
                                {errorMessage}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="os-title os-title--h4 os-title--bold">Withdrawal</div>
                        <div className="os-text">
                            Enter the amount you wish to withdraw.
                        </div>
                        <InputLabel className="os-label--mw-235">
                            <div className="os-form__row currency-input">
                                <span className="currency-symbol">$</span>
                                <TextInput
                                    placeholder="Enter the amount"
                                    value={Number.isNaN(customAmount) || customAmount === null || customAmount === '' ? 0.00 : customAmount.toFixed(2)}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        setCustomAmount(isNaN(value) ? 0 : value);
                                    }}
                                />
                            </div>
                        </InputLabel>
                        {errorMessage && (
                            <div className="os-text os-text--c-red os-gift-modal__error">
                                {errorMessage}
                            </div>
                        )}
                        <Button
                            icon={true}
                            fontWeight={'bold'}
                            onClick={handleWithdrawal}
                            fullWidthMob={true}
                            disabled={!customAmount || isNaN(customAmount)}
                        >
                            Withdraw
                        </Button>
                    </>
                )
            )}
        </>
    );
}
