import React, { useState } from 'react';
import Lexlogo from "../assets/LexLogo.webp";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className="max-w-screen w-full flex bg-blue-200 h-20 shadow-[0px_4px_10px_rgba(0,0,0,0.25)] z-10 sticky top-0">
            {/* LEFT */}
            <div className="flex w-1/2 justify-start items-center">
                <img
                    src={Lexlogo}
                    alt="Lexlogo"
                    className="w-48 h-auto ml-5 hover:scale-105 transition-all cursor-pointer"
                    onClick={() => navigate("/")}
                />
            </div>

            {/* RIGHT (Hamburger and Links) */}
            <div className="flex w-1/2 justify-end items-center mr-5 relative">
                {/* Hamburger Icon for Mobile */}
                <div className="block md:hidden" onClick={toggleMenu}>
                    <button className="text-blue-700 text-3xl">
                        {menuOpen ? '✖' : '☰'}
                    </button>
                </div>

                {/* Menu Links */}
                <div className={`md:flex md:flex-row md:space-x-5 space-y-20 md:space-y-0 absolute md:static bg-blue-200 w-full md:w-auto top-20 right-5 p-5 md:p-0 ${menuOpen ? 'block' : 'hidden'} md:block`}>
                    <a
                        href="https://uk.lexprotector.com/ukwebinar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-105 transition-all hover:text-blue-700"
                    >
                        <p>Webinar</p>
                    </a>
                    <a
                        href="https://uktrademark.lexprotector.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-105 transition-all hover:text-blue-700"
                    >
                        <p>Uk Trademark</p>
                    </a>
                    <a
                        href="https://lexprotector.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-105 transition-all hover:text-blue-700 pr-5"
                    >
                        <p>About Us</p>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Navbar;


// import React from 'react'
// import Lexlogo from "../assets/LexLogo.webp"
// import { useNavigate } from 'react-router-dom';

// const Navbar = () => {
//     const navigate = useNavigate();

//     return (
//         <div className='max-w-screen w-full flex flex-row bg-blue-200 h-20 shadow-[0px_4px_10px_rgba(0,0,0,0.25)]
//  z-10 sticky top-0'>
//             {/* LEFT */}
//             <div className='flex w-1/2 justify-start items-center'>
//                 <img
//                     src={Lexlogo}
//                     alt="Lexlogo"
//                     className="w-48 h-auto ml-5 hover:scale-105 transition-all"
//                     onClick={() => navigate("/")}
//                 />
//             </div>
//             {/* RIGHT */}
//             <div className='flex w-1/2 justify-end items-center mr-5'>
//             <a
//                     href="https://uk.lexprotector.com/ukwebinar"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className='hover:scale-105 transition-all hover:text-blue-700 pr-5'
//                 >
//                     <p>Webinar</p>
//                 </a>
//                 <a
//                     href="https://uktrademark.lexprotector.com/"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className='hover:scale-105 transition-all hover:text-blue-700 pr-5'
//                 >
//                     <p>Uk Trademark</p>
//                 </a>
//                 <a
//                     href="https://lexprotector.com/"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className='hover:scale-105 transition-all hover:text-blue-700 pr-5'
//                 >
//                     <p>About Us</p>
//                 </a>
//             </div>
//         </div>
//     )
// }

// export default Navbar