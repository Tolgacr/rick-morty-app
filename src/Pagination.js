import React from 'react';
import './App.css'; // Stil için

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageWindow = (current, total, windowSize = 2) => {
    const start = Math.max(1, current - windowSize);
    const end = Math.min(total, current + windowSize);
    const pages = [];

    if (start > 1) pages.push(1, '...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total) pages.push('...', total);

    return pages;
  };

  const pageWindow = getPageWindow(currentPage, totalPages);

  return (
    <div className="pagination-container">
      <button onClick={() => onPageChange(1)}>{'«'}</button>
      <button onClick={() => onPageChange(Math.max(1, currentPage - 5))}>{'⇤'}</button>
      {pageWindow.map((page, i) => (
        <button
          key={i}
          className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
          disabled={page === '...'}
          onClick={() => typeof page === 'number' && onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 5))}>{'⇥'}</button>
      <button onClick={() => onPageChange(totalPages)}>{'»'}</button>
    </div>
  );
};

export default Pagination;