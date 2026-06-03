import React, { forwardRef, useEffect, useRef } from 'react';

const Form = ({ className = '', children, ...props }) => {
    return (
        <form className={`flex flex-col p-5 box box--stacked ${className}`} {...props}>
            {children}
        </form>
    );
};

const Button = ({
                    type = 'button',
                    onClick,
                    className = '',
                    children,
                    disabled = false,
                    variant = 'primary'
                }) => {
    // Define the base styles
    const baseStyles = `
        transition duration-200 border shadow-sm
        inline-flex items-center justify-center py-2 px-3
        rounded-md font-medium cursor-pointer
        focus:ring-4 focus:ring-opacity-20 focus-visible:outline-none
        dark:focus:ring-slate-700 dark:focus:ring-opacity-50
        [&:hover:not(:disabled)]:bg-opacity-90
        [&:hover:not(:disabled)]:border-opacity-90
        [&:not(button)]:text-center
        disabled:opacity-70 disabled:cursor-not-allowed
         whitespace-nowrap
    `;

    // Define styles for each variant
    const variantStyles = {
        primary: 'bg-primary border-primary text-white dark:border-primary',
        secondary: 'bg-secondary/70 border-secondary/70 text-slate-500 dark:border-darkmode-400 dark:bg-darkmode-400 dark:text-slate-300 [&:hover:not(:disabled)]:bg-slate-100 [&:hover:not(:disabled)]:border-slate-100 [&:hover:not(:disabled)]:dark:border-darkmode-300/80 [&:hover:not(:disabled)]:dark:bg-darkmode-300/80',
        success: 'bg-success border-success text-slate-900 dark:border-success text-white',
        warning: 'bg-warning border-warning text-slate-900 dark:border-warning text-white',
        pending: 'bg-pending border-pending text-white dark:border-pending',
        danger: 'bg-danger border-danger text-white dark:border-danger',
        dark: 'bg-dark border-dark text-white dark:bg-darkmode-800 dark:border-transparent dark:text-slate-300 [&:hover:not(:disabled)]:dark:bg-darkmode-800/70'
    };

    return (
        <div className={'d-flex p-1 float-left'}>
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            >
                {children}
            </button>
        </div>
    );
};

const Alert = ({ children, variant = 'success' }) => {
    const baseClasses = "relative border rounded-md px-5 py-3.5 my-5 flex items-center";
    const variantClasses = variant === 'danger'
        ? "bg-danger border-danger bg-opacity-20 border-opacity-5 text-danger dark:border-danger dark:border-opacity-20"
        : "bg-success border-success bg-opacity-20 border-opacity-5 text-success dark:border-success dark:border-opacity-20";

    return (
        <div
            className={`${baseClasses} ${variantClasses}`}
            role="alert"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-alert-triangle stroke-[1] w-6 h-6 mr-2"
            >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <path d="M12 9v4"></path>
                <path d="M12 17h.01"></path>
            </svg>
            {children}
            {/*<button*/}
            {/*    type="button"*/}
            {/*    className="text-slate-800 py-2 px-3 absolute right-0 my-auto mr-2 btn-close"*/}
            {/*    aria-label="Close"*/}
            {/*>*/}
            {/*    <svg*/}
            {/*        xmlns="http://www.w3.org/2000/svg"*/}
            {/*        width="24"*/}
            {/*        height="24"*/}
            {/*        viewBox="0 0 24 24"*/}
            {/*        fill="none"*/}
            {/*        stroke="currentColor"*/}
            {/*        strokeWidth="2"*/}
            {/*        strokeLinecap="round"*/}
            {/*        strokeLinejoin="round"*/}
            {/*        className="lucide lucide-x stroke-[1] w-4 h-4"*/}
            {/*    >*/}
            {/*        <path d="M18 6 6 18"></path>*/}
            {/*        <path d="m6 6 12 12"></path>*/}
            {/*    </svg>*/}
            {/*</button>*/}
        </div>
    );
};

const Group = ({ className = '', title, children, ...props }) => {
    return (
        <div className="relative mb-4 mt-4 rounded-[0.6rem] border border-slate-200/80 dark:border-darkmode-400">
            <div className="absolute left-0 px-3 ml-4 -mt-2 text-xs uppercase bg-white text-slate-500">
                <div className="-mt-px">{title}</div>
            </div>
            <div className="mt-4 flex flex-col gap-3.5 px-5 py-4 pb-6">
                <div className="preview relative [&amp;.hide]:overflow-hidden [&amp;.hide]:h-0 flex flex-col gap-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

const InputBox = ({ label, type = 'text', placeholder, name, value, onChange,isClass=false, ...props }) => {
    return (
        <div className={`block items-center group form-inline ${!isClass ? 'sm:flex' : ''}`}>
            <InputLabel>{label}</InputLabel>
            <TextInput
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                {...props}
            />
        </div>
    );
};

const SelectBox = ({ label, name, value, onChange, options = [], placeholder = '', ...props }) => {
    return (
        <div className="block items-center group form-inline sm:flex">
            <InputLabel>{label}</InputLabel>
            <Select
                name={name}
                value={value}
                options={options}
                placeholder={placeholder}
                onChange={(val) => onChange({ target: { name, value: val } })}
                {...props}
            />
        </div>
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
        <label {...props} className={`inline-block mb-2 group-[.form-inline]:mb-2 group-[.form-inline]:sm:mb-0 group-[.form-inline]:sm:mr-5 group-[.form-inline]:sm:text-right sm:w-24 ` + className}>
            {value ? value : children}
        </label>
    );
};
const Select = ({ name, className = '', options = [], placeholder = '', onChange, ...props }) => {
    const handleChange = (e) => {
        const value = e.target.value;
        if (onChange) onChange(value);
    };


    return (
        <select
            name={name}
            className={`bg-[length:20px_auto] disabled:bg-slate-100 disabled:cursor-not-allowed disabled:dark:bg-darkmode-700/50 [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-700/50 bg-chevron-black transition duration-200 ease-in-out w-full border-slate-300/60 shadow-sm rounded-md px-3 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:!bg-darkmode-700 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:bg-chevron-white  py-1.5 pl-4 pr-8`}
            onChange={handleChange}
            value={props.value}
            {...props}
        >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

const Textarea = ({ name, className = '', placeholder = '', rows = 4, label, ...props }) => {
    return (
        <>
        <InputLabel>{label}</InputLabel>
        <textarea
            name={name}
            className={`disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-700/50 [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-700/50 transition duration-200 ease-in-out w-full text-sm border-slate-300/60 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-700 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 ${className}`}
            placeholder={placeholder}
            rows={rows}
            {...props}
        ></textarea>
        </>
    );
};

const TextInput = forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
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
            className={'disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&amp;[readonly]]:bg-slate-100 [&amp;[readonly]]:cursor-not-allowed [&amp;[readonly]]:dark:bg-darkmode-800/50 [&amp;[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 [&amp;[type=\'file\']]:border file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:border-r-[1px] file:border-slate-100/10 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-500/70 hover:file:bg-200 group-[.form-inline]:flex-1 group-[.input-group]:rounded-none group-[.input-group]:[&amp;:not(:first-child)]:border-l-transparent group-[.input-group]:first:rounded-l group-[.input-group]:last:rounded-r group-[.input-group]:z-10 ' + className}
            ref={input}
        />
    );
});

export {
    Form,
    InputError,
    InputLabel,
    Select,
    SelectBox,
    Textarea,
    TextInput,
    Group,
    InputBox,
    Alert,
    Button
};
