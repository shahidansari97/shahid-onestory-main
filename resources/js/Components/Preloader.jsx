import React from 'react';
import Button from "@/Components/UI/Button.jsx";

export default function Preloader({ onStart }) {
    const handleStart = () => {
        if (onStart) {
            onStart();
        }
    };

    return (
        <div className='os-preloader'>
            <h1 className='os-title os-title--h1 os-title--white'>
                Welcome <br />to your story
            </h1>
            <Button fontWeight={'bold'} onClick={handleStart}>
                Let’s start
            </Button>
        </div>
    );
}
