import React from 'react';
import { Outlet } from 'react-router-dom';

const MillerCompanyLayOut: React.FC = () => {
    return (
        <>
            {/* <Navbar /> */}
            <Outlet />
        </>
    );
};

export default MillerCompanyLayOut;
