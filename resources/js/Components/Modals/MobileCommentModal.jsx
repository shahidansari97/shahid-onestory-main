import {useState} from "react";
import Button from "@/Components/UI/Button.jsx";
import {Img} from "@/Components/UI/Content.jsx";

export default function MobileCommentModal({ gifts, user, modalData, activeCardIndex, handleGiftClick, sendGift, error, setError, loading, validationCode, setValidationCode, openModal, serverError }) {
    const [twoFactorStep, setTwoFactorStep] = useState(false);
    const [insufficientBalance, setInsufficientBalance] = useState(false);

    const handleSendGift = async () => {
        const selectedGift = gifts[activeCardIndex];
        const userBalance = parseFloat(user.balance);
        const giftCost = parseFloat(selectedGift.cost);

        if (!selectedGift) {
            setError(true);
            return;
        }

        if (userBalance < giftCost) {
            setInsufficientBalance(true);
            return;
        }

        const giftResponse = await sendGift();

        if (giftResponse.requires_2fa) {
            setTwoFactorStep(true);
            return;
        }

        if (giftResponse.success) {
            setError(false);
            setInsufficientBalance(false);
            openModal(null, "success", modalData.author);
            return;
        }

        setError(true);
    };

    const onCardClick = (index, cost) => {
        setError(false);
        setInsufficientBalance(false);
        handleGiftClick(index, cost);
    };

    return (
        <>
            <div className="os-gift-modal__top">
                <Img src={user?.avatar} width={160} height={160} className="os-gift-modal__user"/>
                <div className="os-gift-modal__top-to">TO</div>
                <Img src={modalData.author?.avatar} width={160} height={160} className="os-gift-modal__user"/>
            </div>
            <div className="os-title os-title--h4 os-title--bold">
                {twoFactorStep ? "Enter Verification Code" : "Send gift to " + modalData.author?.name}
            </div>
            {twoFactorStep ? (
                <div>
                    <div className="os-text">We sent a verification code to your email. Please enter it below to proceed.</div>
                    <input
                        type="text"
                        placeholder="Enter verification code"
                        value={validationCode}
                        onChange={(e) => setValidationCode(e.target.value)}
                        className="os-input"
                    />
                </div>
            ) : (
                <div className="os-text">
                    Choose a gift to send to {modalData.author?.name}.
                </div>
            )}
            {!twoFactorStep && (
                <div className="os-gift-modal__cards">
                    {gifts.map((item, index) => (
                        <div
                            key={index}
                            className={`os-gift-card ${activeCardIndex === index ? "os-gift-card--active" : ""}`}
                            onClick={() => onCardClick(index, item.cost)}
                        >
                            <Img src={`/img/gift/${item.picture}?v=1`} width={128} height={128}/>
                            <div>
                                <div className="os-title os-title--bold">{item.name}</div>
                                <div className="os-text os-text--sm">{item.cost} coins</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {insufficientBalance ? (
                <>
                    <div className="os-text os-text--c-red">
                        You don't have enough money to send this gift. Please top up your account.
                    </div>
                    <Button
                        icon={true}
                        fontWeight={"bold"}
                        onClick={() => openModal(null, "deposit", modalData.author)}
                        fullWidthMob={true}
                    >
                        Top up the balance
                    </Button>
                </>
            ) : (
                <Button
                    icon={true}
                    fontWeight={"bold"}
                    onClick={handleSendGift}
                    disabled={loading || (twoFactorStep && !validationCode) || activeCardIndex === null}
                    fullWidthMob={true}
                >
                    {loading ? "Processing..." : twoFactorStep ? "Verify & Send" : "Send Gift"}
                </Button>
            )}
            {/* Загальна помилка */}
            {serverError && (
                <div className="os-text os-text--c-red os-gift-modal__error">
                    {serverError}
                </div>
            )}
            <div className={'os-text os-text--sm'}>
                Part of the funds will be donated to the monthly chosen cause.
            </div>
        </>
    );
}
