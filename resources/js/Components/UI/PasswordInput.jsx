import React, { useState } from 'react';
import { InputLabel, TextInput } from "@/Components/UI/Form.jsx";
import { Img } from "@/Components/UI/Content.jsx";

const PasswordInput = ({ value, onChange, label = 'Password', enableStrengthCheck = false, hasError = false }) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ label: 'Weak', modifier: 'weak', percentage: 20 });

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const evaluatePasswordStrength = (password) => {
        let strength = { label: 'Weak', modifier: 'weak', percentage: 20 };

        const hasUpperCase = /\p{Lu}/u.test(password);
        const hasLowerCase = /\p{Ll}/u.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
        const isLongEnough = password.length >= 8;

        if (isLongEnough && hasUpperCase && hasNumbers && hasSpecialChar && hasLowerCase) {
            strength = { label: 'Ultimate', modifier: 'ultimate', percentage: 100 };
        } else if (password.length >= 6 && (hasUpperCase || hasNumbers)) {
            strength = { label: 'Average', modifier: 'average', percentage: 50 };
        } else if (password.length >= 4) {
            strength = { label: 'Weak', modifier: 'weak', percentage: 30 };
        }

        setPasswordStrength(strength);
    };

    const handlePasswordChange = (e) => {
        const inputPassword = e.target.value;
        onChange(e);

        if (enableStrengthCheck) {
            evaluatePasswordStrength(inputPassword);
        }
    };

    return (
        <div className="os-password-input">
            <InputLabel className="os-password-input__label">
                {label}
                <TextInput
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    placeholder="*************"
                    value={value}
                    autoComplete="current-password"
                    onChange={handlePasswordChange}
                    className="os-password-input__field"
                    hasError={hasError}
                    required
                />
                <div onClick={togglePasswordVisibility} className={`os-password-input__toggle ${hasError ? 'os-password-input__toggle--error' : ''}`}>
                    {isPasswordVisible ? (
                        <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4.00001C14.79 4.00001 18.17 6.13001 19.82 9.50001C19.23 10.72 18.4 11.77 17.41 12.62L18.82 14.03C20.21 12.8 21.31 11.26 22 9.50001C20.27 5.11001 16 2.00001 11 2.00001C9.73 2.00001 8.51 2.20001 7.36 2.57001L9.01 4.22001C9.66 4.09001 10.32 4.00001 11 4.00001ZM9.93 5.14001L12 7.21001C12.57 7.46001 13.03 7.92001 13.28 8.49001L15.35 10.56C15.43 10.22 15.49 9.86001 15.49 9.49001C15.5 7.01001 13.48 5.00001 11 5.00001C10.63 5.00001 10.28 5.05001 9.93 5.14001ZM1.01 1.87001L3.69 4.55001C2.06 5.83001 0.77 7.53001 0 9.50001C1.73 13.89 6 17 11 17C12.52 17 13.98 16.71 15.32 16.18L18.74 19.6L20.15 18.19L2.42 0.450012L1.01 1.87001ZM8.51 9.37001L11.12 11.98C11.08 11.99 11.04 12 11 12C9.62 12 8.5 10.88 8.5 9.50001C8.5 9.45001 8.51 9.42001 8.51 9.37001ZM5.11 5.97001L6.86 7.72001C6.63 8.27001 6.5 8.87001 6.5 9.50001C6.5 11.98 8.52 14 11 14C11.63 14 12.23 13.87 12.77 13.64L13.75 14.62C12.87 14.86 11.95 15 11 15C7.21 15 3.83 12.87 2.18 9.50001C2.88 8.07001 3.9 6.89001 5.11 5.97001Z" fill="currentColor"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="19" viewBox="0 0 22 15" fill="none">
                            <path d="M11 2C14.79 2 18.17 4.13 19.82 7.5C18.17 10.87 14.79 13 11 13C7.21 13 3.83 10.87 2.18 7.5C3.83 4.13 7.21 2 11 2ZM11 0C6 0 1.73 3.11 0 7.5C1.73 11.89 6 15 11 15C16 15 20.27 11.89 22 7.5C20.27 3.11 16 0 11 0ZM11 5C12.38 5 13.5 6.12 13.5 7.5C13.5 8.88 12.38 10 11 10C9.62 10 8.5 8.88 8.5 7.5C8.5 6.12 9.62 5 11 5ZM11 3C8.52 3 6.5 5.02 6.5 7.5C6.5 9.98 8.52 12 11 12C13.48 12 15.5 9.98 15.5 7.5C15.5 5.02 13.48 3 11 3Z" fill="currentColor"/>
                        </svg>
                    )}
                </div>
            </InputLabel>

            {(enableStrengthCheck && value) && (
                <div className={`os-password-strength os-password-strength--${passwordStrength.modifier}`}>
                    <div className="os-password-strength__bar">
                        <div className={`os-password-strength__progress os-password-strength__progress--${passwordStrength.modifier}`}
                             style={{ width: `${passwordStrength.percentage}%` }}>
                        </div>
                    </div>
                    <p className={`os-password-strength__message os-password-strength__message--${passwordStrength.modifier}`}>
                        Password strength: {passwordStrength.label}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PasswordInput;
