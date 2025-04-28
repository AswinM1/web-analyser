import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('aiSuggestions');
    if (saved) {
      setSuggestions(JSON.parse(saved));
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="p-6 bg-[#121212] min-h-screen text-white">
      <h1 className="text-6xl mb-6 my-14 font-semibold font-sans tracking-tighter text-center">Here is your suggestions </h1>
      
      <div className="grid gap-6">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-[#121212] p-6 rounded-2xl shadow-lg"
          >
            <p className="text-2xl max-w-[800px] font-sans font-semibold text-indigo-400  mb-4">{suggestion}</p>
            
          
            <div className="bg-[#1e1e1e] p-4 rounded-md mt-4 font-mono text-sm overflow-x-auto">
              
              {` */\n.selector {\n  accessibility-property: value;\n}`}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
