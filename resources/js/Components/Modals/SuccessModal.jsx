import {Img} from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";

export default function SuccessModal({gifts, modalData, activeCardIndex, closeModal}) {
    return (
        <>
            <div className="os-gift-modal__top">
                <Img src={modalData.author?.avatar} width={160} height={160} className={'os-gift-modal__user'}/>
            </div>
            <div className="os-gift-modal__cards">
                <div className='os-gift-card'>
                    <Img src={`/img/gift/${gifts[activeCardIndex]?.picture}`} width={128} height={128}/>
                    <div>
                        <div className="os-title os-title--bold">{gifts[activeCardIndex]?.name}</div>
                        <div className="os-text os-text--sm">{gifts[activeCardIndex]?.price}</div>
                    </div>
                </div>
            </div>
            <div className="os-title os-title--h4 os-title--bold">You have successfully given a gift</div>
            <div className="os-text">Your “{gifts[activeCardIndex]?.name}” gift has been sent to {modalData.author?.name} and can be used right now.</div>
            <Button fontWeight={'bold'} onClick={closeModal} fullWidthMob={true}>
                Go back
            </Button>
        </>
    );
}
