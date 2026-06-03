import React from 'react';
import {Img} from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";
import {usePage} from "@inertiajs/react";

export default function RefillSuccessModal({ modalData, closeModal}) {
    const {auth} = usePage().props;
    return (
        <>
            <div className="os-gift-modal__top">
                <Img src={auth.user?.avatar} width={160} height={160} className={'os-gift-modal__user'}/>
            </div>

            <div className="os-title os-title--h4 os-title--bold">You have successfully topped up your balance</div>

            <Button fontWeight={'bold'} onClick={closeModal} fullWidthMob={true}>
                Go back
            </Button>
        </>
    );
}
