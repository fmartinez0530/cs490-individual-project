import React from "react";
import { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    //  Need this since Routing makes window.location not update on tab clicks
    const location = useLocation();
    const [selectedTab, setSelectedTab] = useState(location.pathname);

    const handleTabClick = (path) => {
        setSelectedTab(path);
    };

    return (
        <header>
            <h2>CS 490</h2>
            <nav>
                <ul>
                    <Link to="/" onClick={() => handleTabClick("/")}>
                        <li><span className={selectedTab === "/" ? "selected" : ""}>HOME</span></li>
                    </Link>
                    <Link to="/customers" onClick={() => handleTabClick("/customers")}>
                        <li><span className={selectedTab === "/customers" ? "selected" : ""}>CUSTOMERS</span></li>
                    </Link>
                    <Link to="/films" onClick={() => handleTabClick("/films")}>
                        <li><span className={selectedTab === "/films" ? "selected" : ""}>FILMS</span></li>
                    </Link>
                </ul>
            </nav>

            {/* Honestly, this is just a quick way to center the nav element */}
            <h2 className="hidden">CS 490</h2>
        </header >
    );
}

export default Navbar;