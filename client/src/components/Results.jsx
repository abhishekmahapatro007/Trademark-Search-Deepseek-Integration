import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../assets/Loader.gif';
import { ArrowLeft, ArrowRight, Search, SearchIcon, RotateCcw } from 'lucide-react';
import Select from 'react-select';
import Low from '../assets/low.jpg';
import Mid from '../assets/mid.jpg';
import High from '../assets/high.jpg';
import { useRef } from 'react';
import markdownToTxt from 'markdown-to-txt';
import { marked } from 'marked';

const Results = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('query') || '';

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');
    const navigate = useNavigate();
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const searchInputRef = useRef(null); //for focusing the searchbar on clicking search again

    // Filters
    const [country, setCountry] = useState([{ value: 'UK', label: 'United Kingdom' }]);
    const [live, setLive] = useState(true);
    const [dead, setDead] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;
    const totalPages = Math.ceil(results.length / resultsPerPage);

    const handleChange = (event) => setValue(event.target.value);

    // Trigger search when pressing Enter
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') handleSearch();
    };

    const handleSearch = () => {
        if (!value.trim()) return;
        navigate(`/search?query=${encodeURIComponent(value)}`);
    };

    useEffect(() => {
        if (!searchTerm) return;

        const fetchResults = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:5000/api/search?keyword=${encodeURIComponent(searchTerm)}`
                );
                if (!response.ok) throw new Error('Failed to fetch results');

                const data = await response.json();
                setResults(Array.isArray(data.result) ? data.result : []);
                setAiSuggestion(data.suggestion || null);
            } catch (error) {
                console.error('Error fetching results:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [searchTerm]);

    const toggleLive = () => {
        setLive(!live);
        setDead(false);
    };

    const toggleDead = () => {
        setDead(!dead);
        setLive(false);
    };

    // Apply filters
    const filteredResults = results.filter((item) => {
        const status = item.status?.toLowerCase() || ''; // Ensure lowercase comparison

        if (country.length > 0 && !country.some(c => item.protection?.includes(c.value))) return false;
        if (live && status !== 'live') return false;
        if (dead && status !== 'dead') return false;
        return true;
    });

    // Paginate results
    const paginatedResults = filteredResults.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
    );

    const handleCountryChange = (selectedOptions) => {
        setCountry(selectedOptions); // Store selected countries
    };

    // Options for react-select dropdown
    const countryOptions = [
        { value: 'US', label: 'United States' },
        { value: 'UK', label: 'United Kingdom' },
        { value: 'IN', label: 'India' },
        { value: 'EU', label: 'European Union' },
        { value: 'AU', label: 'Australia' },
        { value: 'TR', label: 'Turkey' },
    ];

    const getAvailability = () => {
        if (filteredResults.length === 0) {
            return {
                text: 'Safe to File',
                bgcolor: 'bg-green-600',
                color: 'text-white',
                percent: '100%',
                buttonText: 'File your Trademark Now!',
                buttonLink: '',
                img: Low,
                butText: 'text-green-600'
            };
        }

        const highestAccuracy = Math.max(...filteredResults.map(item => item.accuracy || 0));

        if (highestAccuracy <= 75) {
            return {
                text: 'Safe to File',
                bgcolor: 'bg-green-600',
                color: 'text-white',
                percent: '75%',
                buttonText: 'File your Trademark',
                buttonLink: '',
                img: Low,
                butText: 'text-green-600'
            };
        }
        if (highestAccuracy > 75 && highestAccuracy <= 90) {
            return {
                text: 'Moderate Risk',
                bgcolor: 'bg-yellow-500',
                color: 'text-white',
                percent: '33%',
                buttonText: 'Consult Our Experts',
                buttonLink: '',
                img: Mid,
                butText: 'text-yellow-600'
            };
        }
        return {
            text: 'High Risk',
            bgcolor: 'bg-red-600',
            color: 'text-white',
            percent: '10%',
            buttonText: 'Search Again',
            buttonLink: '',
            buttonIcon: <RotateCcw />,
            img: High,
            butText: 'text-red-600'
        };
    };


    const availability = getAvailability();

    return (
        <div className="p-5 w-full">
            <h2 className="text-lg font-semibold mb-4">Search Results for: "{searchTerm}"</h2>

            {/* SEARCH INPUT */}
            <div className="p-5 pb-1 relative w-full">
                <Search className="absolute left-3 top-2.5 text-gray-500 translate-x-4 translate-y-5" />
                <input
                    ref={searchInputRef}
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown} // Capture "Enter" key
                    placeholder="Enter your Trademark..."
                    className="border border-gray-300 rounded-lg pl-10 pr-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 placeholder:text-sm"
                />
            </div>

            {/* SEARCH BUTTON */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 mb-4 
                    transition w-36 flex flex-row"
                >
                    Search
                    <SearchIcon className='ml-2 scale-75' />
                </button>
            </div>
            {aiSuggestion && (
                <div className="bg-slate-100 border border-gray-600 rounded-lg p-4 mb-5">
                    <p className="font-semibold">AI Suggestion:</p>
                    <p>{aiSuggestion}</p>
                </div>
            )}
            
            {/* FILTERS */}
            <div className="mb-5 flex gap-4 items-center">
                <Select
                    isMulti
                    options={countryOptions}
                    value={country}
                    onChange={handleCountryChange}
                    className="w-80" 
                    classNamePrefix="react-select"
                    placeholder="Select Countries"
                />

                <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={live} onChange={toggleLive} />
                    <span>Live</span>
                </label>

                <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={dead} onChange={toggleDead} />
                    <span>Dead</span>
                </label>
            </div>

            {/* LOADING OVERLAY */}
            {
                loading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <img src={Loader} alt="Loading..." className="w-20 h-20" />
                    </div>
                )
            }

            {/* RESULTS TABLE */}
            <div className="overflow-x-auto w-full">
                <table className="min-w-full w-full table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="border p-5 text-left">Trademark</th>
                            <th className="border p-5 text-left hidden md:table-cell">Image</th>
                            <th className="border p-5 text-left hidden md:table-cell">Application</th>
                            <th className="border p-5 text-left hidden md:table-cell">Granted</th>
                            <th className="border p-5 text-left hidden md:table-cell">Acc. %</th>
                            <th className="border p-5 text-left">Classes</th>
                            <th className="border p-5 text-left">Countries</th>
                            <th className="border p-5 text-left hidden md:table-cell">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedResults.length > 0 ? (
                            paginatedResults.map((item, index) => (
                                <tr key={index}>
                                    <td className="border p-5 break-words">{item.verbal}</td>
                                    <td className="border p-5 hidden md:table-cell">
                                        <img
                                            src={`https://img.tmsearch.ai/img/210/${item.img}`}
                                            alt={item.verbal}
                                            className="max-w-[80px] h-auto object-contain"
                                        />
                                    </td>
                                    <td className="border p-5 hidden md:table-cell break-words">{item.app}</td>
                                    <td className="border p-5 hidden md:table-cell break-words">{item.date?.granted}</td>
                                    <td className="border p-5 hidden md:table-cell break-words">{item.accuracy || 0}%</td>
                                    <td className="border p-5 break-words">{item.class ? item.class.join(', ') : 'N/A'}</td>
                                    <td className="border p-5 break-words">{item.protection ? item.protection.join(', ') : 'N/A'}</td>
                                    <td className="border p-5 hidden md:table-cell break-words">{item.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="border p-5 text-center">No results found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center mt-5 space-x-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className='flex flex-row bg-blue-500 text-blue-50 w-30 mb-5 rounded-full
                    pl-7 pr-7 p-2 hover:scale-100 hover:bg-blue-400 transition-all scale-90'
                >
                    <ArrowLeft />
                    Prev
                </button>
                <span className='mt-2'>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className='flex flex-row bg-blue-500 text-blue-50 w-30 mb-5 rounded-full
                    pl-7 pr-7 p-2 hover:scale-100 hover:bg-blue-400 transition-all ml-7
                    scale-90'
                >
                    Next
                    <ArrowRight />
                </button>
            </div>
        </div >
    );
};

export default Results;