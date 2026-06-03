import './../../../css/auth.css';
import './../../../css/form.css';
import GuestLayout from '@/Layouts/GuestLayout';
import { TextInput, InputLabel, InputError, Form } from '@/Components/UI/Form.jsx';
import {Head, Link, useForm, usePage} from '@inertiajs/react';
import { Img, Text, Title } from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";
import PasswordInput from "@/Components/UI/PasswordInput.jsx";
import { trackSignup } from '@/Utils/analytics';
import { authRoute, hasPublishMessageIntent } from '@/Utils/authPublishMessage';

export default function Register({ is_contestant, fromPublishMessage: fromPublishMessageProp = false }) {
    const fromPublishMessage = hasPublishMessageIntent() || fromPublishMessageProp;
    const loginHref = authRoute('login', {}, fromPublishMessage);
    const googleOAuthHref = authRoute('oauth2.google.redirect', {}, fromPublishMessage);
    const facebookOAuthHref = authRoute('oauth2.facebook.redirect', {}, fromPublishMessage);
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        is_contestant: is_contestant,
        from_publish_message: fromPublishMessage ? '1' : '',
    });
    const { auth } = usePage().props;
    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onSuccess: () => {
                // location.reload();
                const userId = auth?.user?.id;
                if (userId) {
                    trackSignup(userId);
                }
            },
        });
    };

    return (
        <GuestLayout className="os-layout--auth-bg" footerClass="os-footer--bg-gradient">
            <Head title="Register" />
            <div className="os-container">
                <div className="os-auth">
                    <div className="os-title-block os-title-block--p-8">
                        <div className="os-title os-title--h2">Create Your Account</div>
                    </div>
                    <div className="os-container os-container--sm">
                        <div className="os-auth__content">

                            <div className="os-auth__reg-link">
                                Already have an account?
                                <Link
                                    href={loginHref}
                                    className="os-text os-text--bold os-text--underline"
                                >
                                    Log In
                                </Link>
                            </div>
                            <div className="os-auth__reg-link" style={{ marginTop: 8 }}>
                                <Link
                                    href={route('home')}
                                    className="os-text os-text--bold os-text--underline"
                                >
                                    Back to main site
                                </Link>
                            </div>
                            <Form onSubmit={submit} className="os-form">
                                <InputLabel>
                                    Username
                                    <TextInput
                                        id="username"
                                        name="username"
                                        value={data.username}
                                        className="mt-1 block w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        placeholder="Username"
                                        onChange={(e) => setData('username', e.target.value)}
                                        required
                                    />
                                </InputLabel>
                                <InputError message={errors.username} className="mt-2" />
                                <InputLabel>
                                    Your email
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        placeholder="Email address"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                </InputLabel>
                                <InputError message={errors.email} className="mt-2" />
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
                                <InputError message={errors.password} />
                                <InputError message={errors.password_confirmation} />
                                <div className='os-delimeter'></div>
                                <div className='os-form__row'>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        fontWeight={'bold'}
                                        gap={'22'}
                                        icon={true}
                                        fullWidthMob={true}
                                    >
                                        Sign Up
                                        <Img
                                            src={'/img/icons/btn-arrow.svg'}
                                            width={14}
                                            height={14}
                                        />
                                    </Button>

                                    <div className={'os-text os-text--center-mob'}>or continue with</div>
                                    <div className='os-auth__social-buttons'>
                                        <a
                                            className="os-btn os-btn--outline os-btn--with-icon os-btn--w-full-mob"
                                            href={googleOAuthHref}
                                        >
                                            <Img
                                                src={'/img/social/google.svg'}
                                                width={20}
                                                height={20}
                                            />
                                        </a>
                                        {/* <a
                                            className="os-btn os-btn--outline os-btn--with-icon os-btn--w-full-mob"
                                            href={facebookOAuthHref}
                                        >
                                            <Img
                                                src={'img/social/facebook.svg'}
                                                width={20}
                                                height={20}
                                            />
                                        </a> */}
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
