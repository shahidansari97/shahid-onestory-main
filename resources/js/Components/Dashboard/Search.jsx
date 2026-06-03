
import React from 'react';
import { Button, TextInput } from "@/Components/Dashboard/Form.jsx";
import {Select} from '@/Components/Dashboard/Form.jsx';

export default function Search({ fields, onSearch, onClear }) {
    return (
        <div className="flex flex-col p-4 gap-3 md:flex-row md:items-center">
            {fields.map((field, index) => {
                switch (field.type) {
                    case 'text':
                        return (
                            <TextInput
                                key={index}
                                type="text"
                                placeholder={field.placeholder}
                                value={field.value}
                                onChange={field.onChange}
                                className={field.className}
                            />
                        );
                    case 'date':
                        return (
                            <TextInput
                                key={index}
                                type="date"
                                placeholder={field.placeholder}
                                value={field.value}
                                onChange={field.onChange}
                                className={field.className}
                            />
                        );
                    case 'number':
                        return (
                            <TextInput
                                key={index}
                                type="number"
                                min={field.min}
                                max={field.max}
                                placeholder={field.placeholder}
                                value={field.value}
                                onChange={field.onChange}
                                className={field.className}
                            />
                        );
                    case 'select':
                        return (
                            <Select
                                key={index}
                                options={field.options}
                                value={field.value}
                                onChange={field.onChange}
                                className={field.className}
                            />
                        );
                    default:
                        return null;
                }
            })}
            <div className="flex w-full gap-2 md:w-auto">
                {onClear && (
                    <Button onClick={onClear} variant="secondary">Clear</Button>
                )}
                <Button onClick={onSearch}>Search</Button>
            </div>
        </div>
    );
}
