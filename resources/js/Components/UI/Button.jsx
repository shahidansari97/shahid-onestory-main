import React from 'react';
import { Link } from '@inertiajs/react';

const Button = ({
    href,
    onClick,
    className = '',
    tag = 'button',
    variant = 'primary',
    fontSize = 'lg',
    padding,
    fontWeight,
    fullWidth,
    fullWidthMob,
    gap,
    icon,
    children,
    ...props
}) => {
    const ButtonElement = tag === 'a' ? Link : tag;

    const variantClasses = {
        primary: 'os-btn--primary',
        outline: 'os-btn--outline',
        gradient: 'os-btn--gradient',
        grey: 'os-btn--grey',
    };

    const paddingClasses = {
        xs: 'os-btn--p-xs',
        m: 'os-btn--p-m',
        xl: 'os-btn--p-xl',
        xxl: 'os-btn--p-xxl',
        s: 'os-btn--p-s',
    };

    const gasClasses = {
        14: 'os-btn--gap-14',
        16: 'os-btn--gap-16',
        22: 'os-btn--gap-22',
    };

    const buttonClass = [
        'os-btn',
        className,
        fontWeight === 'bold' && 'os-btn--fw-bold',
        `os-btn--fs-${fontSize}`,
        variantClasses[variant],
        gasClasses[gap],
        padding && paddingClasses[padding],
        icon && 'os-btn--with-icon',
        fullWidth && 'os-btn--w-full',
        fullWidthMob && 'os-btn--w-full-mob'
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <ButtonElement
            href={href}
            className={buttonClass.trim()}
            onClick={onClick}
            {...props}
        >
            {children}
        </ButtonElement>
    );
};

export default Button;
