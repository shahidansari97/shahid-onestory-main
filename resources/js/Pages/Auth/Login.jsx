import './../../../css/auth.css';
import './../../../css/form.css';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import {TextInput, InputLabel, InputError, Form} from '@/Components/UI/Form.jsx';
import {Head, Link, useForm,usePage} from '@inertiajs/react';
import {Img, Text} from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";
import PasswordInput from "@/Components/UI/PasswordInput.jsx";
import { authRoute, hasPublishMessageIntent } from '@/Utils/authPublishMessage';

export default function Login({status, canResetPassword, fromPublishMessage: fromPublishMessageProp = false}) {
    const searchParams = new URLSearchParams(window.location.search);
    const redirect = searchParams.get('redirect') || '/';
    const fromPublishMessage = hasPublishMessageIntent() || fromPublishMessageProp;
    const registerHref = authRoute('register', {}, fromPublishMessage);
    const googleOAuthHref = authRoute('oauth2.google.redirect', {}, fromPublishMessage);
    const facebookOAuthHref = authRoute('oauth2.facebook.redirect', {}, fromPublishMessage);
    const { props } = usePage();
     const message = props?.flash?.message;
    const {data, setData, post, processing, errors, reset} = useForm({
        email: '',
        password: '',
        remember: '',
        redirect,
        from_publish_message: fromPublishMessage ? '1' : '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in"/>
            <div className="os-auth">
                {status && <div className="os-message os-message--success">{status}</div>}
                {message && <div className="os-message os-message--success">{message}</div>}    
                <div className="os-title-block os-title-block--p-8">
                    <div className="os-title os-title--h2">Login to Your Account</div>
                </div>
                <div className="os-container os-container--sm">
                    <div className="os-auth__content">
                        <div className="os-auth__reg-link">
                            Don't have account yet?
                            <Link
                                href={registerHref}
                                className="os-text os-text--bold os-text--underline"
                            >
                                Sign up now
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
                                Your email
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    value={data.email}
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    hasError={!!errors.email}
                                />
                            </InputLabel>
                            <InputError message={errors.email} className="mt-2"/>
                            <PasswordInput
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2"/>
                            <div className="os-form__row">
                                <InputLabel className="os-checkbox-label">
                                    <div className="os-checkbox">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            className="os-checkbox__input"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                        />
                                        <label htmlFor="remember" className="os-checkbox__label">
                                            <span className="os-checkbox__custom"></span>
                                            Remember Me
                                        </label>
                                    </div>
                                </InputLabel>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="os-text os-text--bold os-text--underline  os-text--no-wrap"
                                    >
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>
                            <div className='os-delimeter'></div>
                            <div className='os-form__row'>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    fontWeight={'bold'}
                                    gap={22}
                                    icon={true}
                                    fullWidthMob={true}
                                >
                                    Log In
                                    <Img
                                        src={'img/icons/btn-arrow.svg'}
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
                                            src={'img/social/google.svg'}
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
        </GuestLayout>
    );
}
