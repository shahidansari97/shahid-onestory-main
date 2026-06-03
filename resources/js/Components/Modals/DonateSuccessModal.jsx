import React from 'react';
import Button from "@/Components/UI/Button.jsx";

export default function DonateSuccessModal({closeModal}) {
    return (
        <>
            <div className="os-title os-title--h4 os-title--bold">You have successfully donated. Thank you!</div>
            <Button fontWeight={'bold'} onClick={closeModal} fullWidthMob={true}>
                Go back
            </Button>
        </>
    );
}
