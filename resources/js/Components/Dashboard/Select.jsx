import { useState, useEffect, useRef } from 'react';

export default function Select({ options, value, onChange, getStatusColor }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(
        options.find(option => option.id === value)
    );

    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        onChange(option.id);
        setIsOpen(false);
    };

    return (
        <div className="relative w-32 m-auto" ref={selectRef}>
            <div
                className={`flex justify-center border rounded px-3 py-2 cursor-pointer ${getStatusColor(selectedOption?.id)}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption ? selectedOption.name : 'Select an option'}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={20} height={20} viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4"/></svg>
            </div>
            {isOpen && (
                <div className="absolute z-10 mt-1 bg-white border rounded shadow-lg w-full">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${getStatusColor(option.id)}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
