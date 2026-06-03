import GuestLayout from '@/Layouts/GuestLayout';
import {TextInput, InputLabel, InputError, Form, } from '@/Components/UI/Form.jsx';
import {Head, Link, useForm} from '@inertiajs/react';
import {Img} from "@/Components/UI/Content.jsx";
import PasswordInput from "@/Components/UI/PasswordInput.jsx";
import './../../../css/auth.css';
import './../../../css/form.css';
import Button from "@/Components/UI/Button.jsx";
export default function ResetPassword({token, email}) {
    const {data, setData, post, processing, errors, reset} = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout className="os-layout--auth-bg">
            <Head title="Reset Password"/>
            <div className="os-container">
                <div className="os-auth">
                    <div className="os-title-block">
                        <div className="os-title os-title--h2">Set New Password</div>
                    </div>
                    <div className="os-container os-container--sm">
                        <div className="os-auth__content">
                            <Form onSubmit={submit} className="os-form">
                                <PasswordInput
                                    value={data.password}
                                    enableStrengthCheck={true}
                                    onChange={(e) => setData('password', e.target.value)}
                                    hasError={!!errors.password}
                                />
                                <PasswordInput
                                    label={'Confirm Password'}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    hasError={!!errors.password_confirmation}
                                />
                                <InputError message={errors.password}/>
                                <InputError message={errors.password_confirmation}/>
                                <div className='os-delimeter'></div>
                                <div className='os-form__row'>
                                    <Button
                                        fontWeight={'bold'}
                                        gap={'22'}
                                        icon={true}
                                        fullWidthMob={true}
                                    >
                                        Reset Password
                                        <Img
                                            src={'/img/icons/btn-arrow.svg'}
                                            width={14}
                                            height={14}
                                        />
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
