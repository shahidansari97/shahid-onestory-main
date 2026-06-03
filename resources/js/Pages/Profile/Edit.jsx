import './../../../css/profile.css';
import './../../../css/auth.css';
import './../../../css/form.css';
import './../../../css/transactions.css';
import './../../../css/gift.css';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
// import UpdatePayPalForm from './Partials/UpdatePayPalForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import Tabs from '@/Components/UI/Tabs';
import {Head, usePage} from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import React from 'react';

export default function Edit({auth, mustVerifyEmail, status}) {
    return (
        <GuestLayout
            displayMenu={true}
            user={auth.user}
        >
            <Head title="Edit Profile"/>
            <div className="os-profile">
                <div className="os-title-block os-title-block--p-lg">
                    <div className="os-title os-title--h2">Customize your profile</div>
                    <div className="os-text">Please fill out your new account and start making connections with people from all over the world.</div>
                </div>
                <div className="os-container">
                    <div className="os-transactions">

                        <Tabs categories={['Personal Details', 'Privacy & Security', 'Deactivation']}>
                            <div className="os-transactions__table-wrapper">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </div>
                            <div className="os-transactions__table-wrapper">
                                <UpdatePasswordForm className="editpro_form"/>
                            </div>
                            {/* <div className="os-transactions__table-wrapper">
                                <UpdatePayPalForm className="editpro_form"/>
                            </div> */}

                            <div className="os-transactions__table-wrapper">
                                <DeleteUserForm className="editpro_form"/>
                            </div>

                        </Tabs>
                    </div>
                </div>
            </div>
            {/* {showModal && modalData && (
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
            )} */}
        </GuestLayout>
    );
}
