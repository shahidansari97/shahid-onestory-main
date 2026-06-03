
import React, { forwardRef, useEffect, useRef } from 'react';
import {Img} from "@/Components/UI/Content.jsx";

const Form = ({ className = '', children, ...props }) => {
    return (
        <form className={`os-form ${className}`} {...props}>
            {children}
        </form>
    );
};

const InputError = ({ message, className = '', ...props }) => {
    return message ? (
        <p {...props} className={'os-form__input-error ' + className}>
            {message}
        </p>
    ) : null;
};

const InputLabel = ({ value, className = '', children, ...props }) => {
    return (
        <label {...props} className={`os-label ` + className}>
            {value ? value : children}
        </label>
    );
};

const Select = ({ name, className = '', options = [], placeholder = '', ...props }) => {
    return (
        <div className='os-select'>
            <select name={name} className={`os-select__dropdown ${className}`} {...props}>
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <Img src='/img/icons/arrow-down.svg'  className='os-select__icon'/>
        </div>
    );
};

const Textarea = ({ name, className = '', placeholder = '', rows = 4, ...props }) => {
    return (
        <textarea
            name={name}
            className={`os-textarea ${className}`}
            placeholder={placeholder}
            rows={rows}
            {...props}
        ></textarea>
    );
};

const TextInput = forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, hasError = false, ...props },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={`os-input ${hasError ? 'os-input--error' : ''} ${className}`}
            ref={input}
        />
    );
});


export {
    Form,
    InputError,
    InputLabel,
    Select,
    Textarea,
    TextInput
};
