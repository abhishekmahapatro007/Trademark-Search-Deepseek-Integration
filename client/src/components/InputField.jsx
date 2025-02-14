import React, { useState } from 'react';
import { Search, SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loader from '../assets/Loader.gif'; 

const InputField = () => {
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSearch = () => {
        if (!value.trim()) return; 
        navigate(`/search?query=${encodeURIComponent(value)}`);
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') handleSearch();
    };

    return (
        <>
            {/* SEARCH INPUT */}
            <div className="p-5 pb-1 relative w-full">
                <Search 
                    className="absolute left-3 top-2.5 text-gray-500 translate-x-4 translate-y-5" 
                />
                <input
                    type="text"
                    value={value}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    placeholder="Enter your Trademark..."
                    className="border border-gray-300 rounded-lg pl-10 pr-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 placeholder:text-sm"
                />
            </div>

            {/* SEARCH BUTTON */}
            <div className="flex justify-center mt-4">
                <button 
                    onClick={handleSearch} 
                    className="bg-blue-500 text-blue-100 px-6 py-2 rounded-full hover:bg-blue-600 transition
                    w-36 flex flex-row"
                >
                    Search
                    <SearchIcon className='ml-2 scale-75'/>
                </button>
            </div>

            {/* LOADING OVERLAY */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <img src={Loader} alt="Loading..." className="w-20 h-20" />
                </div>
            )}
            {/* testing the loader  */}
            {/* <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <img src={Loader} alt="Loading..." className="w-20 h-20" />
            </div> */}
        </>
    );
};

export default InputField;


// import React, { useState, useEffect } from 'react';
// import { Search } from 'lucide-react';

// const InputField = () => {
//     const [value, setValue] = useState('');
//     const [results, setResults] = useState([]); // Store API results
//     const [totalResults, setTotalResults] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const handleChange = (event) => {
//         setValue(event.target.value);
//     };

//     // Utility to limit text length (8-10 words)
//     const truncateText = (text, wordLimit = 8) => {
//         if (!text) return text;
//         const words = text.split(' ');
//         if (words.length > wordLimit) {
//             return words.slice(0, wordLimit).join(' ') + '...';
//         }
//         return text;
//     };

//     const getImageUrl = (imagePath) => {
//         if (!imagePath) return ''; // Return empty if no path is provided
      
//         // Extract the image ID by splitting the path and getting the last part (e.g., '9161711.jpg')
//         const imageFile = imagePath.split('/').pop();
      
//         // Construct the full URL with the base URL and image path
//         return `https://img.tmsearch.ai/img/210/${imagePath}`;
//       };

//     useEffect(() => {
//         if (!value) {
//             setResults([]); // Reset results if input is empty
//             setTotalResults(null);
//             return;
//         }

//         const fetchData = async () => {
//             setLoading(true);
//             console.log("Fetching data for:", value);

//             try {
//                 const response = await fetch(
//                     `http://localhost:5000/api/search?keyword=${value}` // Now using your backend
//                 );

//                 console.log("Response received:", response);

//                 if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//                 const data = await response.json();
//                 // console.log("API Response:", data);

//                 setTotalResults(data.total || 0);
//                 setResults(Array.isArray(data.result) ? data.result : []);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//                 setTotalResults(0);
//                 setResults([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [value]);

//     return (
//         <>
//             {/* INPUT FIELD */}
//             <div className="p-5 pb-1 relative w-full">
//                 <Search className="absolute left-3 top-2.5 text-gray-500 translate-x-4 translate-y-5" />
//                 <input
//                     type="text"
//                     value={value}
//                     onChange={handleChange}
//                     placeholder="Enter your Trademark..."
//                     className="border border-gray-300 rounded-lg pl-10 pr-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 placeholder:text-sm"
//                 />
//                 {loading && <p className="mt-2 text-gray-500">Loading...</p>}
//                 {totalResults !== null && !loading && (
//                     <p className="mt-5 text-gray-700">Total results: {totalResults}</p>
//                 )}
//             </div>
//         </>
//     );
// };

// export default InputField;