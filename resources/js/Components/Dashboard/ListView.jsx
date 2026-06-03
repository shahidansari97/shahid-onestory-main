import React from 'react';
import Search from '@/Components/Dashboard/Search.jsx';
import DataTable from '@/Components/Dashboard/DataTable.jsx';
import Pagination from '@/Components/Dashboard/Pagination.jsx';

export default function ListView({ searchFields, onSearch, onClear, columns, data, actions, currentPage, lastPage, onPageChange, ...dataTableProps }) {
    return (
        <div className="flex flex-col box box--stacked overflow-auto">
            {(searchFields) && (
                <Search
                    fields={searchFields}
                    onSearch={onSearch}
                    onClear={onClear}
                />
            )}

            <DataTable
                columns={columns}
                data={data}
                actions={actions}
                {...dataTableProps}
            />
            {(lastPage) && (
                <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}
