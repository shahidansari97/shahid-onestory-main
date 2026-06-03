import React from "react";
import '../../css/pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPaginationItems = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="os-pagination">
            <button
                className={`os-pagination__button os-pagination__button--first ${currentPage === 1 ? 'os-pagination__button--disable' : ''}`}
                disabled={currentPage === 1}
                onClick={() => onPageChange(1)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                    <path d="M12.5 0L4 6L12.5 12V0ZM2.5 12V0H0.5V12H2.5Z" fill="currentColor"/>
                </svg>
            </button>
            <button
                className={`os-pagination__button os-pagination__button--prev ${currentPage === 1 ? 'os-pagination__button--disable' : ''}`}
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="13" viewBox="0 0 9 13" fill="none">
                    <path d="M6.7565 12.4619L8.1665 11.0519L3.5865 6.46191L8.1665 1.87191L6.7565 0.461914L0.756505 6.46191L6.7565 12.4619Z" fill="currentColor"/>
                </svg>
            </button>

            {getPaginationItems().map((page, index) =>
                page === '...' ? (
                    <span key={index} className="os-pagination__ellipsis">...</span>
                ) : (
                    <button
                        key={index}
                        className={`os-pagination__number ${
                            currentPage === page ? 'os-pagination__number--active' : ''
                        }`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                className={`os-pagination__button os-pagination__button--next ${currentPage === totalPages ? 'os-pagination__button--disable' : ''}`}
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="13" viewBox="0 0 9 13" fill="none">
                    <path d="M2.2435 0.538086L0.833496 1.94809L5.4135 6.53809L0.833496 11.1281L2.2435 12.5381L8.2435 6.53809L2.2435 0.538086Z" fill="currentColor"/>
                </svg>
            </button>
            <button
                className={`os-pagination__button os-pagination__button--last ${currentPage === totalPages ? 'os-pagination__button--disable' : ''}`}
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(totalPages)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                    <path d="M0.5 12L9 6L0.5 0V12ZM10.5 0V12H12.5V0H10.5Z" fill="currentColor"/>
                </svg>
            </button>
        </div>
    );
};

export default Pagination;
