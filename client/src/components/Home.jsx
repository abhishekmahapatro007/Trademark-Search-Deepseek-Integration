import React from 'react';
import InputField from './InputField';
import { motion } from "framer-motion";  // Make sure to import motion from framer-motion instead of "motion/react"

const Home = () => {
    return (
        <div className="bg-slate-200 w-full h-full flex items-center justify-center">
            {/* TEXT CONTAINER */}
            <motion.div 
                initial={{ opacity: 0.2, y: -20 }}
                transition={{ duration: 1 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-5 mt-20 justify-center items-center p-5 w-full max-w-screen-lg">
                <h1 className="text-3xl sm:text-5xl md:text-6xl flex items-center text-center font-bold flex-row">
                    Search over
                    <span className="text-orange-400 ml-1 md:ml-4">
                        12 million+
                    </span>
                </h1>
                <h1 className="text-3xl sm:text-5xl md:text-6xl flex items-center text-center font-bold">
                    Trademarks for free
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-center max-w-2xl">
                    The world's most trusted company in Trademark Registration.
                    Our best trademark filing starts at $99*. File today.
                </p>
                <InputField />
            </motion.div>
        </div>
    );
};

export default Home;


// import React from 'react'
// import InputField from './InputField'
// import { motion } from "motion/react"

// const Home = () => {
//     return (
//         <div className='bg-slate-200 w-full h-full flex items-center justify-center'>
//             {/* TEXT CONTAINER */}
//             <motion.div 
//                 initial={{ opacity: 0.2, y: -20 }}
//                 transition={{ duration: 1 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 className='flex flex-col gap-5 mt-20 justify-center items-center p-5'>
//                 <h1 className='text-6xl flex items-center text-center font-bold flex-row'>
//                     Search over
//                     <span className='text-orange-400 ml-4'>
//                         {" "}12 million+
//                     </span>
//                 </h1>
//                 <h1 className='text-6xl flex items-center text-center font-bold'>
//                     Trademarks for free
//                 </h1>
//                 <p>
//                     The world's most trusted company in Trademark Registration.
//                     Our best trademark filing starts at $99*. File today.
//                 </p>
//                 <InputField />
//                 {/* <SearchResults/> */}
//             </motion.div>
//         </div>
//     )
// }

// export default Home