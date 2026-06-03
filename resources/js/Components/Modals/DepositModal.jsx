import React, { useState } from 'react';
import { Img } from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";
import { InputLabel, TextInput } from "@/Components/UI/Form.jsx";
import axios from 'axios';
import RightArrow from "../../../img/icons/right-arrow.png";
export default function DepositModal({ user, packed, activeDepositCard, handleDepositCardClick, customAmount, setCustomAmount, loading, setLoading, refillSuccess, setRefillSuccess, setError }) {
    const handleCustomRefill = async () => {
        let amountToRefill;

        if (customAmount && !isNaN(customAmount) && customAmount > 0) {
            amountToRefill = customAmount;
        } else if (activeDepositCard !== null) {
            amountToRefill = packed[activeDepositCard].price;
        } else {
            setError(true);
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(route('payment.top-up'), { amount: amountToRefill });

            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                setError(true);
            }
        } catch (error) {
            console.error("Error creating Stripe checkout session:", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    const coinsPerDollar = 50;
    const calculatedCoins = customAmount > 0 ? (customAmount * coinsPerDollar) : 0;
    return (
        <>
            <div className="os-gift-modal__top">
                <div>
                    <Img src={user?.avatar} width={160} height={160} className={'os-gift-modal__user'} />
                    <div className="os-title os-title--bold">{user?.name}</div>
                </div>
            </div>
            <div className="os-title os-title--h4 os-title--bold">Deposit money to your account</div>
            <div className="os-text"> You don't have enough money in your account, so please add money to your account to start using the Gift Giving feature</div>
            <div className="os-title os-title--bold">Choose one of the packages that suits you or enter the amount you want to spend</div>
            <div className="os-gift-modal__cards">
                {packed.map((item, index) => (
                    <div
                        key={index}
                        className={`os-gift-card ${activeDepositCard === index ? 'os-gift-card--active' : ''}`}
                        onClick={() => handleDepositCardClick(index)}
                    >
                        <Img src={`/img/gift/coin-${item.coins}-new.png`} width={128} height={128} />
                        <div>
                            <div className="os-title os-title--bold">{`${item.coins} coins`}</div>
                            <div className="os-text os-text--sm">${item.price.toFixed(2)}</div>
                        </div>
                    </div>
                ))}
            </div>
            <InputLabel className="withdraw_amount_wrapper os-label--mw-235">
                Payment amount
                <div className="currency-input">
                    <span className="currency-symbol">$</span>
                    <TextInput
  type="text"
  placeholder="Enter the amount"
  value={customAmount}
  onChange={(e) => {
      const value = e.target.value;

      // Allow only numbers and a single decimal point
      if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
          setCustomAmount(value);
      }
  }}
  onBlur={() => {
      // When leaving input, normalize the number with 2 decimals
      const num = parseFloat(customAmount);
      if (!isNaN(num)) {
          setCustomAmount(num.toFixed(2));
      } else {
          setCustomAmount('0.00');
      }
  }}
/>
                </div>
                <p className=" m-0">Select an amount in 50¢ increments</p>
                {customAmount > 0 && (
                    <p className="text-sm text-green-600 font-medium m-0 flex gap-2 conversion_wrapper">
                            <span>${!isNaN(parseFloat(customAmount)) ? parseFloat(customAmount).toFixed(2) : '0.00'}</span>
 <img src={RightArrow} alt="Right"/> <span>{calculatedCoins} coins</span>
                    </p>
                )}
            </InputLabel>
            <Button
                icon={true}
                fontWeight={'bold'}
                onClick={handleCustomRefill}
                fullWidthMob={true}
                disabled={loading || (customAmount === '' && activeDepositCard === null)}
            >
                {loading ? 'Processing...' : 'Top up the balance'}
            </Button>

            {refillSuccess && (
                <div className="os-message os-message--success">
                    Your balance has been successfully refilled!
                </div>
            )}
        </>
    );
}
