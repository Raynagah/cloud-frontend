import React from 'react';
import { Navbar } from '../components/organisms/Navbar';
import { Outlet } from 'react-router-dom';
import './css/MainLayout.css';

export function MainLayout() {
    return (
        <div className="layout__wrapper">
            <Navbar />
            <main className="layout__main">
                <Outlet />
            </main>
        </div>
    );
}