import './../../../css/auth.css';
import './../../../css/form.css';
import GuestLayout from '@/Layouts/GuestLayout';
import {TextInput, InputError, Form, InputLabel} from '@/Components/UI/Form.jsx';
import {Head, Link, useForm} from '@inertiajs/react';
import {Img, Text, Title} from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";

export default function ForgotPassword({status}) {
    const {data, setData, post, processing, errors} = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout className="os-layout--auth-bg" footerClass="os-footer--bg-gradient">
            <Head title="Forgot password"/>
            <div className="os-container">
                <div className="os-auth">
                    <div className="os-title-block">
                        <div className="os-title os-title--h2">Forgot Password?</div>
                    </div>
                    <div className="os-container os-container--sm">
                        <div className="os-auth__content">
                            <Text className="os-text--mt-20">No worries, we'll send you reset instructions.</Text>
                            <Form onSubmit={submit} className="os-form">
                                <InputLabel>
                                    Your email
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        placeholder="Email address"
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </InputLabel>
                                <InputError message={errors.email}/>
                                <div className='os-delimeter'></div>
                                <div className='os-btns'>
                                    <Button
                                        fontWeight={'bold'}
                                        gap={22}
                                        icon={true}
                                        fullWidthMob={true}
                                    >
                                        Reset Password
                                        <Img
                                            src={'img/icons/btn-arrow.svg'}
                                            width={14}
                                            height={14}/>
                                    </Button>
                                    <Button
                                        href={route('login')}
                                        tag='a'
                                        fontWeight={'bold'}
                                        gap={16}
                                        variant={'outline'}
                                        fullWidthMob={true}
                                    >
                                        Back to Log In
                                    </Button>
                                </div>
                                {status && <div className="os-message">{status}</div>}

                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
