import '../../../css/support.css';
import '../../../css/donate.css';
import '../../../css/form.css';
import React, {useState, useEffect} from "react";
import GuestLayout from '@/Layouts/GuestLayout.jsx';
import {Img} from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";
import {InputError, InputLabel, Select, Textarea, TextInput} from "@/Components/UI/Form.jsx";
import {Head, Link, useForm, usePage} from "@inertiajs/react";
import Accordion from "@/Components/Accordion.jsx";

const cites = [
    {value: 'london', label: 'London'},
    {value: 'oslo', label: 'Oslo'},
];
const countries = [
    {value: 'england', label: 'England'},
    {value: 'norway', label: 'Norway'},
];
export default function Pay({}) {
    const user = usePage().props.auth.user;

    const {data, setData, patch, errors, processing, recentlySuccessful} = useForm({
        name: user.username,
        email: user.email,
    });
    return (
        <GuestLayout>
            <Head title="Pay"/>
            <div className="os-donate">
                <div className={"os-container os-container--xl"}>
                    <div className="os-title-block os-title-block--p-lg">
                        <div className="os-title os-title--h2">Pay With Credit Card or PayPal</div>
                        <div className="os-text">
                            Please fill out the fields below for payment
                        </div>
                    </div>
                </div>
                <div className="os-container os-container--sm   ">
                    <form className="os-form">
                        <h2 className="os-title os-title--h4">Personal information</h2>
                        <InputLabel>
                            First name
                            <TextInput
                                id="name"
                                type="name"
                                name="name"
                                placeholder="Your Name"
                                autoComplete="username"
                                isFocused={true}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </InputLabel>
                        <InputError className="mt-2" message={errors.name}/>
                        <InputLabel>
                            Last name
                            <TextInput
                                id="name"
                                type="name"
                                name="name"
                                placeholder="Your Name"
                                autoComplete="username"
                                isFocused={true}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </InputLabel>
                        <InputError className="mt-2" message={errors.name}/>
                        <div className="os-form__row">
                            <InputLabel>
                                MM/DD/YY
                                <TextInput
                                    id="name"
                                    type="name"
                                    name="name"
                                    placeholder="Your Name"
                                    autoComplete="username"
                                    isFocused={true}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                            </InputLabel>
                            <InputError className="mt-2" message={errors.name}/>
                            <InputLabel>
                                Phone
                                <TextInput
                                    id="name"
                                    type="name"
                                    name="name"
                                    placeholder="Your Name"
                                    autoComplete="username"
                                    isFocused={true}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                            </InputLabel>
                            <InputError className="mt-2" message={errors.name}/>
                        </div>
                        <InputLabel>
                            Username
                            <TextInput
                                id="username"
                                type="username"

                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </InputLabel>

                        <InputLabel>
                            Your Email
                            <TextInput
                                id="email"
                                type="email"

                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </InputLabel>

                        <InputError className="mt-2" message={errors.email}/>
                        <InputLabel>
                            Country
                            <Select
                                id="country"
                                type="country"
                                options={countries}
                                value={data.country}
                                onChange={(e) => setData('country', e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </InputLabel>
                        <InputLabel>
                            City
                            <Select
                                id="city"
                                type="city"
                                options={cites}
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                required
                                autoComplete="city"
                            />
                        </InputLabel>

                        <InputLabel>
                            Street
                            <TextInput
                                id="email"
                                type="email"

                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </InputLabel>

                        <div className="os-payment">
                            <div className="os-title os-title--h4 os-title--bold">
                                Payment method
                            </div>
                        <Accordion title="<img src='/img/icons/card.svg'> Credit card">
                            <div className="os-form">
                                <InputLabel>
                                    Card Number
                                    <TextInput
                                        id="card-number"
                                        type="text"
                                        placeholder="Card Number"
                                        required
                                    />
                                </InputLabel>
                                <div className="os-form__row">
                                <InputLabel>
                                    Valid Until
                                    <TextInput
                                        id="valid-until"
                                        type="text"
                                        placeholder="MM/YY"
                                        required
                                    />
                                </InputLabel>
                                <InputLabel>
                                    CSC
                                    <TextInput
                                        id="csc"
                                        type="text"
                                        placeholder="CSC"
                                        required
                                    />
                                </InputLabel>
                                </div>
                                <div className="os-delimeter"></div>
                                <Button
                                    tag='a'
                                    className="os-btn--fw-bold os-btn--gap-16"
                                    icon={true}
                                >
                                    Save information
                                    <Img
                                        src={'/img/icons/btn-arrow.svg'}
                                        width={14}
                                        height={14}
                                    />
                                </Button>
                            </div>
                        </Accordion>
                        <div className="os-payment__method"><img src='/img/icons/paypal.svg'/> Paypal</div>
                        </div>
                        <div className="os-delimeter"></div>
                        <Button
                            tag='a'
                            className="os-btn--fw-bold os-btn--gap-16"
                            icon={true}
                        >
                            Save
                            <Img
                                src={'/img/icons/btn-arrow.svg'}
                                width={14}
                                height={14}
                            />
                        </Button>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
};
