import  {useRef, useState} from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import {TextInput, InputLabel, InputError} from '@/Components/UI/Form.jsx';
import {useForm, usePage} from '@inertiajs/react';
import {Transition} from '@headlessui/react';
import Button from "@/Components/UI/Button.jsx";

export default function UpdatePayPalForm({auth}) {
    const email = useRef();

    const user = usePage()?.props?.auth?.user || {};
    const hasPayPalId = user?.paypal_id !== null && user?.paypal_id !== undefined && user?.paypal_id !== '';

    const [loadings, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

        const handlePayPalVeryfiedSubmit = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route('user.paypal.account.verify'));

                    if (response.data.status) {
                        setSuccess(true);
                        //console.log("success response"+response);
                        //console.log("success dataresponse"+response.data);
                        window.location.href = response.data.url;
                        //window.open(response.data.url, "_blank");
                    }else{
                        //console.log("Error data response"+response.data);
                        //console.log("Error response"+response);
                    }
                } finally {
                    setLoading(false);
                }
            };

        const handlePayPalAccountRemove = async () => {
            try {
                const response = await axios.post(route('user.paypal.account.remove'));
                if (response.data.status) {
                    setSuccess(true);
                    window.location.reload();
                } else {
                    alert("Failed to remove PayPal account.");
                }
            } catch (error) {
                alert("An error occurred.");
            }
        };

    return (
        <section className="">
             {success && (
                <div className="os-message os-message--success">
                    <img src='/img/icons/done.svg' alt="Success" /> Update PayPal Account!
                </div>
            )}
            <div className="os-profile__form">
                <div>
                    <h2 className="os-title os-title--h4">PayPal Account Verification</h2>

                    <p className="os-text">
                        Ensure your account is using a long, random password to stay secure.
                    </p>
                    {user?.paypal_id && (
                        <p><b>PayPal ID:</b> {user.paypal_id}</p>
                    )}
                    {user?.paypal_email && (
                        <p><b>PayPal Email:</b> {user.paypal_email}</p>
                    )}
                    {user?.paypal_id && (
                        <Button onClick={handlePayPalAccountRemove}>
                            Remove PayPal Account
                        </Button>
                    )}
                </div>

                <Button onClick={handlePayPalVeryfiedSubmit}  style={{ 'width':'25%' }}>
                    {hasPayPalId ? "Update" : "Verify"}
                </Button>
            </div>
        </section>
    );
}
