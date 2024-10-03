import React from 'react';
import classnames from 'classnames';
import './Pagination.css';

const PaginationTest = (props) => {
    const {
        onPageChange,
        totalCount,
        currentPage,
        pageSize,
        className,
    } = props;

    //console.log("totalCount: ", totalCount);

    const lastPage = Math.ceil(totalCount / pageSize);

    const PaginationButtons = [];
    if (Math.ceil(totalCount / pageSize) > 7) {
        for (let i = 1; i < 8; i++) {
            if (currentPage <= 5) {
                if (i === 1) {
                    PaginationButtons.push(
                        <li
                            //key={`pagination-item-${i}`} // unique key
                            className={classnames('pagination-item', {
                                selected: i === currentPage
                            })}
                            onClick={() => {
                                if (i !== currentPage) {
                                    onPageChange(i);
                                }
                            }}
                        >
                            {i}
                        </li>
                    );
                }
                else if (i <= 5) {
                    PaginationButtons.push(
                        <li
                            //key={`pagination-item-${i}`} // unique key
                            className={classnames('pagination-item', {
                                selected: i === currentPage
                            })}
                            onClick={() => {
                                if (i !== currentPage) {
                                    onPageChange(i);
                                }
                            }}
                        >
                            {i}
                        </li>
                    );
                } else if (i === 6) {
                    PaginationButtons.push(<li className="pagination-item dots">&#8230;</li>);
                } else {
                    PaginationButtons.push(
                        <li
                            //key={`pagination-item-${lastPage}`} // unique key
                            className={classnames('pagination-item', {
                                selected: lastPage === currentPage
                            })}
                            onClick={() => {
                                if (lastPage !== currentPage) {
                                    onPageChange(lastPage);
                                }
                            }}
                        >
                            {lastPage}
                        </li>
                    );
                }
            } else if (currentPage > 5 && currentPage < lastPage - 4) {
                if (i === 1) {
                    PaginationButtons.push(
                        <li
                            //key={`pagination-item-${i}`} // unique key
                            className={classnames('pagination-item', {
                                selected: i === currentPage
                            })}
                            onClick={() => {
                                if (i !== currentPage) {
                                    onPageChange(i);
                                }
                            }}
                        >
                            {i}
                        </li>
                    );
                } else if (i === 2 || i === 6) {
                    PaginationButtons.push(<li className="pagination-item dots">&#8230;</li>);
                } else if (i === 3) {
                    PaginationButtons.push(
                        <li
                            //key={`pagination-item-${currentPage - 1}`} // unique key
                            className='pagination-item'
                            onClick={() => {
                                if (currentPage - 1 !== currentPage) {
                                    onPageChange(currentPage - 1);
                                }
                            }}
                        >
                            {currentPage - 1}
                        </li>
                    );
                } else if (i === 4) {
                    PaginationButtons.push(
                        <li
                            //key={`pagination-item-${currentPage}`} // unique key
                            className='pagination-item selected'

                            //  Below doesn't make sense, but i'm doing it to keep the pattern
                            onClick={() => {
                                if (currentPage !== currentPage) {
                                    onPageChange(currentPage);
                                }
                            }}
                        >
                            {currentPage}
                        </li>
                    );
                } else if (i === 5) {
                    PaginationButtons.push(
                        <li
                            //key={`pagination-item-${currentPage + 1}`} // unique key
                            className='pagination-item'
                            onClick={() => {
                                if (currentPage + 1 !== currentPage) {
                                    onPageChange(currentPage + 1);
                                }
                            }}
                        >
                            {currentPage + 1}
                        </li>
                    );
                } else {
                    PaginationButtons.push(
                        <li
                            //key={`pagination-item-${lastPage}`} // unique key
                            className='pagination-item'
                            onClick={() => {
                                if (lastPage !== currentPage) {
                                    onPageChange(lastPage);
                                }
                            }}
                        >
                            {lastPage}
                        </li>
                    );
                }
            } else {
                if (i === 1) {
                    PaginationButtons.push(
                        <li
                            //key={`pagination-item-${i}`} // unique key
                            className='pagination-item'
                            onClick={() => {
                                if (i !== currentPage) {
                                    onPageChange(i);
                                }
                            }}
                        >
                            {i}
                        </li>
                    );
                } else if (i === 2) {
                    PaginationButtons.push(<li className="pagination-item dots">&#8230;</li>);
                } else {
                    PaginationButtons.push(
                        <li
                            //key={`pagination-item-${lastPage - (7 - i)}`} // unique key
                            className={classnames('pagination-item', {
                                selected: (lastPage - (7 - i)) === currentPage
                            })}
                            //onClick={() => onPageChange(lastPage - (7 - i))}

                            onClick={() => {
                                if ((lastPage - (7 - i)) !== currentPage) {
                                    onPageChange(lastPage - (7 - i));
                                }
                            }}
                        >
                            {lastPage - (7 - i)}
                        </li>
                    );
                }
            }
        }
    }
    else {
        for (let i = 0; i < Math.ceil(totalCount / pageSize); i++) {
            PaginationButtons.push(
                <li
                    //key={`pagination-item-${i}`} // unique key
                    className={classnames('pagination-item', {
                        selected: (i + 1) === currentPage
                    })}
                    onClick={() => onPageChange(i + 1)}
                >
                    {i + 1}
                </li>
            );
        }

    }


    return (
        <ul className={classnames('pagination-container', { [className]: className })}>
            {/* Left navigation arrow */}
            <li
                className={classnames('pagination-item', {
                    disabled: currentPage === 1,
                })}
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            >
                <div className="arrow left" />
            </li>

            {PaginationButtons}

            {/* Right Navigation arrow */}
            <li
                className={classnames('pagination-item', {
                    disabled: currentPage === lastPage,
                })}
                onClick={() => currentPage < lastPage && onPageChange(currentPage + 1)}
            >
                <div className="arrow right" />
            </li>
        </ul>
    );
};

export default PaginationTest;
