
import React from 'react';

const BirthdayIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15.25V8.25A2.25 2.25 0 015.25 6H10" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6H6" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V3M12 9V6" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 12a2 2 0 100-4 2 2 0 000 4z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 12v3" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15h4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12h2" />
  </svg>
);

export default BirthdayIcon;
