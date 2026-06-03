import './../../../css/support.css';
import './../../../css/story.css';
import React, { useState } from "react";
import GuestLayout from '@/Layouts/GuestLayout';
import { Img } from "@/Components/UI/Content.jsx";
import Button from "@/Components/UI/Button.jsx";
import Carousel from "@/Components/Story/StoryCarousel.jsx";
import axios from 'axios';
import { Head } from "@inertiajs/react";

export default function Poll({ question, variants, hasVoted, data }) {
    const [voteSuccess, setVoteSuccess] = useState(false);
    const [voteError, setVoteError] = useState('');
    const [loading, setLoading] = useState(false);
    const { title, subtitle, description, prescription, images, amount } = data;

    const handleVote = async (variantId) => {
        if (loading) return;
        setLoading(true);
        setVoteError('');

        try {
            const response = await axios.post('/poll/vote', {
                question_id: question.id,
                variant_id: variantId,
            });

            if (response.data.success) {
                setVoteSuccess(true);
            } else {
                setVoteError(response.data.error);
            }
        } catch (error) {
            setVoteError(error.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GuestLayout>
            <Head title="Poll" />
            <div className="os-support">
                <div className="os-support__content">
                    <div className="os-title os-title--h3 os-title--bold">
                        {title}
                    </div>
                    <div className="os-title os-title--h5 os-title--bold">
                        {subtitle}
                    </div>
                    <div className="os-text">
                        {description}
                    </div>
                    {!hasVoted && !voteSuccess && (
                        <div className="os-support__btns">
                            {variants.map((variant) => (
                                <Button
                                    key={variant.id}
                                    variant={'outline'}
                                    fontWeight={'bold'}
                                    fullWidth={true}
                                    onClick={() => handleVote(variant.id)}
                                    disabled={loading}
                                >
                                    {variant.statement}
                                </Button>
                            ))}
                        </div>
                    )}

                    {voteError && (
                        <div className="os-support__vote os-support__vote--error">
                            <div className="os-title os-title--h5 os-title--red os-title--bold">
                                {voteError}
                            </div>
                        </div>
                    )}

                    {(voteSuccess || hasVoted) && (
                        <div className="os-support__vote os-support__vote-success">
                            <Img src={'/img/icons/done.svg'} width={48} height={48} />
                            <div className="os-title os-title--h5 os-title--green os-title--bold">
                                You have successfully voted!
                            </div>
                            <div className="os-text">
                                Thank you for participating in our campaign. Every vote counts.
                            </div>
                        </div>
                    )}
                    <div className="os-support__total">
                        <div className="os-title-block os-title-block--p-xs os-title-block--radius-24 os-title-block--gap-0">
                            <div className="os-title os-title--h5 os-title--bold">
                                Total Collected Amount
                            </div>
                            <div className="os-title os-title--h1 os-title--bold os-title--white">
                                ${amount}
                            </div>
                        </div>
                    </div>
                </div>
                {images && (
                    <div className="os-support__lates">
                        <div className="os-title os-title--h5">
                            {prescription}
                        </div>
                        <Carousel items={images}>
                            {(item, index) => (
                                <Img key={index} src={item.src} className="os-img" alt={item.title} />
                            )}
                        </Carousel>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
