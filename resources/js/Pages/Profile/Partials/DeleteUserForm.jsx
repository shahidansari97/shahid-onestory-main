import {useRef, useState} from 'react';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import {TextInput, InputLabel, InputError} from '@/Components/UI/Form.jsx';
import {useForm} from '@inertiajs/react';
import Button from "@/Components/UI/Button.jsx";


export default function DeleteUserForm({className = ''}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        console.log('confirmUserDeletion');
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <div className="os-profile__form  mt-5 w">
                <div>
                    <h2 className="os-title os-title--h6">Delete Account</h2>

                    <p className="os-text">
                        Once your account is deleted, all of its resources and data will be permanently deleted. Before
                        deleting your account, please download any data or information that you wish to retain.
                    </p>
                </div>

                <Button onClick={confirmUserDeletion} style={{ 'width':'25%' }}>Delete Account</Button>
            </div>
            <Modal show={confirmingUserDeletion} onClose={closeModal} maxWidth="md">
                <form onSubmit={deleteUser} className="os-form">
                    <h2 className="text-lg font-medium text-gray-900">
                        Are you sure you want to delete your account?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Once your account is deleted, all of its resources and data will be permanently deleted. Please
                        enter your password to confirm you would like to permanently delete your account.
                    </p>

                    <div className="mt-6" style={{ 'width':'100%' }}>
                        <InputLabel htmlFor="password" value="Password" className="sr-only"/>

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-full"
                            isFocused
                            placeholder="Password"
                        />

                        <InputError message={errors.password} className="mt-2"/>
                    </div>

                    <div className="mt-6" style={{ 'width':'100%','display':'flex','justifyContent':'center', 'gap':'20px' }}>
                        <Button onClick={closeModal}>Cancel</Button>

                        <Button className="outline" disabled={processing}>
                            Delete Account
                        </Button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
