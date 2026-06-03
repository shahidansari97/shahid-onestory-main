import { useState, useEffect, useRef } from 'react';

export default function SelectPublishType({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const options = [
        { value: 'public', label: 'Public' },
        { value: 'private', label: 'Private' }
    ];
    
    const selectedOption = options.find(option => option.value === (value || 'public'));

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
        onChange(option.value);
        setIsOpen(false);
    };

    const getPublishTypeColor = (publishType) => {
        return publishType === 'public' 
            ? 'bg-green-100 text-green-800 border-green-300' 
            : 'bg-gray-100 text-gray-800 border-gray-300';
    };

    return (
        <div className="relative w-32" ref={selectRef}>
            <div
                className={`flex justify-center border rounded px-3 py-2 cursor-pointer ${getPublishTypeColor(selectedOption?.value)}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption ? selectedOption.label : 'Public'}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={20} height={20} viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4"/></svg>
            </div>
            {isOpen && (
                <div className="absolute z-10 mt-1 bg-white border rounded shadow-lg w-full">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${getPublishTypeColor(option.value)}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
