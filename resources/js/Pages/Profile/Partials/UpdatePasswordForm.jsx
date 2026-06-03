import React, {useRef} from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import {TextInput, InputLabel, InputError} from '@/Components/UI/Form.jsx';
import {useForm} from '@inertiajs/react';
import {Transition} from '@headlessui/react';
import Button from "@/Components/UI/Button.jsx";

export default function UpdatePasswordForm({className = ''}) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {data, setData, errors, put, reset, processing, recentlySuccessful} = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <div className="os-profile__form">
                <div>
                    <h2 className="os-title os-title--h4">Update Password</h2>

                    <p className="os-text">
                        Ensure your account is using a long, random password to stay secure.
                    </p>
                </div>
                <form onSubmit={updatePassword} className="os-form">
                    <InputLabel>
                        Current Password
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            autoComplete="current-password"
                            placeholder="Enter your current password"
                        />

                    </InputLabel>
                    <InputError message={errors.current_password}/>

                    <InputLabel>
                        New Password
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            autoComplete="new-password"
                            placeholder="Enter your New password"
                        />

                    </InputLabel>
                    <InputError message={errors.password}/>


                    <InputLabel>
                        Confirm Password
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type="password"
                            autoComplete="new-password"
                             placeholder="Confirm your password"
                        />
                    </InputLabel>
                    <InputError message={errors.password_confirmation}/>

                    <div className='os-btn--w-full-mob'>
                        <Button disabled={processing} className='os-btn--w-full-mob'>Save</Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm">Saved.</p>
                        </Transition>
                    </div>
                </form>
            </div>
        </section>
    );
}
