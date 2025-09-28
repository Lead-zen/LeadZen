import React from 'react';

export function AnalyticsIcon({ className = "h-3 w-3", color = "currentColor" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6.2702 16.7695H2.4502V22.4995H6.2702V16.7695Z" stroke={color} strokeMiterlimit="10"/>
      <path d="M21.5505 9.13965H17.7305V22.4996H21.5505V9.13965Z" stroke={color} strokeMiterlimit="10"/>
      <path d="M13.9098 12.9502H10.0898V22.5002H13.9098V12.9502Z" stroke={color} strokeMiterlimit="10"/>
      <path d="M0.549805 22.5H23.4498" stroke={color} strokeMiterlimit="10"/>
      <path d="M11.0505 9.14C13.1602 9.14 14.8705 7.42973 14.8705 5.32C14.8705 3.21027 13.1602 1.5 11.0505 1.5C8.94074 1.5 7.23047 3.21027 7.23047 5.32C7.23047 7.42973 8.94074 9.14 11.0505 9.14Z" stroke={color} strokeMiterlimit="10"/>
      <path d="M4.36035 11.9997L8.18035 8.17969" stroke={color} strokeMiterlimit="10"/>
    </svg>
  );
}
