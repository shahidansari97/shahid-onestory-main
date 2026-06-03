const Title = ({tag: Tag = 'div', className = '', fontSize, children}) => (

    <Tag className={'os-title os-title--fs-' + fontSize + ' ' + className}>
        {children}
    </Tag>
);


const Text = ({tag: Tag = 'div', fontSize, className = '', children}) => {
    const combinedClassName = `${className} ${fontSize ? `os-text--fs-${fontSize}` : ''}`.trim();

    return (
        <Tag className={`os-text ${combinedClassName}`}>
            {children}
        </Tag>
    );
};

const Img = ({src, alt = '', className = '', width, height, ...props}) => {
    return (
        <img
            src={src}
            alt={alt}
            className={className}
            width={width}
            height={height}
            {...props}
        />
    );
};

function Line({size = 'sm', variant = 'horizontal', className=''}) {

    return (
        <>
            {variant === 'horizontal' && size === 'sm' ? (
                <svg width="426" height="6" viewBox="0 0 426 6" className={'os-line ' + className} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.333333 3C0.333333 4.47276 1.52724 5.66667 3 5.66667C4.47276 5.66667 5.66667 4.47276 5.66667 3C5.66667 1.52724 4.47276 0.333333 3 0.333333C1.52724 0.333333 0.333333 1.52724 0.333333 3ZM420.338 3C420.338 4.47276 421.532 5.66667 423.005 5.66667C424.478 5.66667 425.671 4.47276 425.671 3C425.671 1.52724 424.478 0.333333 423.005 0.333333C421.532 0.333333 420.338 1.52724 420.338 3ZM3 3.5H423.005V2.5H3V3.5Z" fill="#DBDBDB"/>
                </svg>
            ) : variant === 'horizontal' && size === 'lg' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="1446" height="6" viewBox="0 0 1446 6" className={'os-line ' + className} fill="none">
                    <path d="M0.333333 3C0.333333 4.47276 1.52724 5.66667 3 5.66667C4.47276 5.66667 5.66667 4.47276 5.66667 3C5.66667 1.52724 4.47276 0.333333 3 0.333333C1.52724 0.333333 0.333333 1.52724 0.333333 3ZM1440.33 3C1440.33 4.47276 1441.53 5.66667 1443 5.66667C1444.47 5.66667 1445.67 4.47276 1445.67 3C1445.67 1.52724 1444.47 0.333333 1443 0.333333C1441.53 0.333333 1440.33 1.52724 1440.33 3ZM3 3.5H723V2.5H3V3.5ZM723 3.5H1443V2.5H723V3.5Z" fill="#DBDBDB"/>
                </svg>
            ) : variant === 'vertical' ? (
                <svg width="6" height="492" viewBox="0 0 6 492" fill="none" xmlns="http://www.w3.org/2000/svg" className={'os-line ' + className}>
                    <path d="M3 0.333333C1.52724 0.333333 0.333333 1.52724 0.333333 3C0.333333 4.47276 1.52724 5.66667 3 5.66667C4.47276 5.66667 5.66667 4.47276 5.66667 3C5.66667 1.52724 4.47276 0.333333 3 0.333333ZM3 486.35C1.52724 486.35 0.333333 487.544 0.333333 489.016C0.333333 490.489 1.52724 491.683 3 491.683C4.47276 491.683 5.66667 490.489 5.66667 489.016C5.66667 487.544 4.47276 486.35 3 486.35ZM2.5 3L2.5 489.016H3.5L3.5 3H2.5Z" fill="#8E8E8E"/>
                </svg>
            ) : null}
        </>
    );
}

export {
    Title,
    Text,
    Img,
    Line
};
