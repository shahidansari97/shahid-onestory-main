import React, { useState } from 'react';
import Button from "@/Components/UI/Button.jsx";
import { InputLabel, TextInput } from "@/Components/UI/Form.jsx";
import axios from 'axios';
import {Img} from "@/Components/UI/Content.jsx";

export default function DonationModal({ user, closeModal, setLoading, setError }) {
    const [customAmount, setCustomAmount] = useState(0.00);

    const handleDonation = async () => {
        if (!customAmount || isNaN(customAmount) || customAmount <= 0) {
            setError(true);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(route('donation.donate'), { amount: customAmount });

            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                setError(true);
            }
        } catch (error) {
            console.error("Error creating donation session:", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="os-title os-title--h4 os-title--bold">Donate</div>
            <div className="os-text">Enter the amount you wish to donate.</div>
            <InputLabel className="os-label--mw-235">
               <div className='os-form__row'>
                   <span className='os-title os-title--h4'>$</span>
                    <TextInput
                        placeholder="Enter the amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                    />
               </div>
            </InputLabel>
            <Button
                icon={true}
                fontWeight={'bold'}
                onClick={handleDonation}
                fullWidthMob={true}
                disabled={!customAmount || isNaN(customAmount)}
            >
                Donate
            </Button>
        </>
    );
}
