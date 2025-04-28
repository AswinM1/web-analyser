import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#4BC0C0'];
const SEVERITY_COLORS = {
  critical: '#FF4842',
  serious: '#FF8042',
  moderate: '#FFBB28',
  minor: '#00C49F'
};

const Home = () => {
  const [url, setUrl] = useState('');
  const [issues, setIssues] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [historicalScans, setHistoricalScans] = useState([]);
  const [activeTab, setActiveTab] = useState('issues');
  const navigate = useNavigate();

  // Mock data for historical scans - in a real app, this would come from your backend
  useEffect(() => {
    const mockHistorical = [
      { date: '2025-04-22', score: 68, issues: 12 },
      { date: '2025-04-23', score: 72, issues: 10 },
      { date: '2025-04-24', score: 75, issues: 9 },
      { date: '2025-04-25', score: 79, issues: 7 },
      { date: '2025-04-26', score: 82, issues: 6 },
      { date: '2025-04-27', score: 85, issues: 5 },
      { date: '2025-04-28', score: 88, issues: 4 },
    ];
    setHistoricalScans(mockHistorical);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/test', { url });
      setIssues(res.data.issues);
      setAiSuggestions(res.data.aiSuggestions);
      localStorage.setItem('aiSuggestions', JSON.stringify(res.data.aiSuggestions));
      
      const issuesWithSeverity = res.data.issues.map(issue => ({
        ...issue,
        severity: ['critical', 'serious', 'moderate', 'minor'][Math.floor(Math.random() * 4)]
      }));
      setIssues(issuesWithSeverity);
    } catch (err) {
      setError('Failed to test the URL.');
    } finally {
      setLoading(false);
    }
  };

  const goToSuggestions = () => {
    navigate('/suggestions');
  };

  // Data for charts
  const issueData = issues ? issues.reduce((acc, issue) => {
    const message = issue.message;
    const found = acc.find(item => item.name === message);
    if (found) {
      found.value += 1;
    } else {
      acc.push({ name: message, value: 1 });
    }
    return acc;
  }, []) : [];

  const severityData = issues ? issues.reduce((acc, issue) => {
    const severity = issue.severity;
    const found = acc.find(item => item.name === severity);
    if (found) {
      found.value += 1;
    } else {
      acc.push({ name: severity, value: 1 });
    }
    return acc;
  }, []) : [];

  
  const accessibilityScore = issues ? Math.max(0, 100 - issues.length * 5) : null;

  return (
    

    <div className="bg-[#121212]  w-full  text-white flex-col">
     {/* <div className="absolute top-1/4 -right-32 w-96 h-96 bg-indigo-700 rounded-full blur-3xl opacity-20 animate-pulse"></div>
     <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-700 rounded-full blur-3xl opacity-20 animate-pulse"></div> */}

      <div className="p-6 max-w-7xl mx-auto my-20 bg-[#121212]">
        
        <div className="rounded-xl p-6 shadow-lg flex flex-col justify-center">
          <p  className='text-4xl mx-1 my-6 font-sans font-semibold tracking-tighter text-center'>Paste your url below</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <textarea
  value={url}
  onChange={(e) => setUrl(e.target.value)}
  className="p-3 rounded-lg bg-[#1e1e1e] border flex-grow focus:outline-none w-72 h-32"
  placeholder="Paste your URL here"
  required
/>

         
            <button 
              type="submit" 
              className="bg-indigo-600  w-auto px-3 py-4 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-block animate-pulse">Scanning...</span>
              ) : (
                <span>Analyze Accessibility</span>
              )}
            </button>
          </form>
          
        </div>

        {error && (
          <div className="mt-6 bg-red-900/50 border border-red-700 p-4 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Results Section */}
        {issues && (
          <div className="mt-8">
            {/* Dashboard Header with Score */}
            <div className="bg-gray-800 rounded-xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Here is your results</h2>
                <p className="text-gray-400">We found {issues.length} accessibility issues on your page</p>
              </div>
              <div className="mt-4 md:mt-0 text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="10"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      fill="none"
                      stroke={accessibilityScore > 70 ? "#00C49F" : accessibilityScore > 40 ? "#FFBB28" : "#FF4842"}
                      strokeWidth="10"
                      strokeDasharray={`${(accessibilityScore / 100) * 339} 339`}
                      strokeDashoffset="84.75"
                      strokeLinecap="round"
                      transform="rotate(-90 64 64)"
                    />
                  </svg>
                  <span className="absolute text-3xl font-bold">{accessibilityScore}</span>
                </div>
                <p className="mt-2 font-semibold">Accessibility Score</p>
              </div>
            </div>

            {/* Tabs for different analytics views */}
            <div className="bg-gray-800 rounded-xl overflow-hidden mb-6">
              <div className="flex border-b border-gray-700">
                <button 
                  className={`px-6 py-3 font-medium ${activeTab === 'issues' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setActiveTab('issues')}
                >
                  Issues
                </button>
                <button 
                  className={`px-6 py-3 font-medium ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  Analytics
                </button>
                <button 
                  className={`px-6 py-3 font-medium ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setActiveTab('history')}
                >
                  History
                </button>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'issues' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Issues List */}
                <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Detailed Issues</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {issues.map((issue, index) => (
                      <div key={index} className="p-4 bg-gray-700 rounded-lg border-l-4" style={{ borderColor: SEVERITY_COLORS[issue.severity] }}>
                        <div className="flex justify-between">
                          <h4 className="font-medium">{issue.message}</h4>
                          <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: SEVERITY_COLORS[issue.severity] }}>
                            {issue.severity}
                          </span>
                        </div>
                        <p className="text-gray-400 mt-1 text-sm"><em>{issue.context}</em></p>
                        <p className="text-gray-400 mt-1 text-sm"><strong>Selector:</strong> {issue.selector}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Issues Summary */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Issues by Severity</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={severityData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        innerRadius={40}
                        paddingAngle={2}
                      >
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="mt-6">
                    <h3 className="text-xl font-bold mb-4">Summary</h3>
                    <div className="space-y-2">
                      {Object.keys(SEVERITY_COLORS).map(severity => {
                        const count = severityData.find(item => item.name === severity)?.value || 0;
                        return (
                          <div key={severity} className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: SEVERITY_COLORS[severity] }}></div>
                              <span className="capitalize">{severity}</span>
                            </div>
                            <span>{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Issue Types Distribution */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Issue Types Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={issueData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {issueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Issues Frequency */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Issues Frequency</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={issueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" tick={{ fill: '#aaa' }} />
                      <YAxis tick={{ fill: '#aaa' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      />
                      <Bar dataKey="value" fill="#8884d8">
                        {issueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Element Types with Issues */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Element Types with Issues</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                      layout="vertical" 
                      data={[
                        { name: 'Images', count: 5 },
                        { name: 'Links', count: 3 },
                        { name: 'Forms', count: 4 },
                        { name: 'Buttons', count: 2 },
                        { name: 'Headings', count: 1 }
                      ]}
                      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis type="number" tick={{ fill: '#aaa' }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: '#aaa' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                      <Bar dataKey="count" fill="#36A2EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* WCAG Compliance Breakdown */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4">WCAG Compliance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Perceivable', value: 75 },
                          { name: 'Operable', value: 85 },
                          { name: 'Understandable', value: 90 },
                          { name: 'Robust', value: 70 }
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={60}
                        paddingAngle={5}
                        label
                      >
                        <Cell fill="#0088FE" />
                        <Cell fill="#00C49F" />
                        <Cell fill="#FFBB28" />
                        <Cell fill="#FF8042" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="grid grid-cols-1 gap-6">
                {/* Historical Score Trend */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Accessibility Score Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={historicalScans} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="date" tick={{ fill: '#aaa' }} angle={-45} textAnchor="end" />
                      <YAxis domain={[0, 100]} tick={{ fill: '#aaa' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#00C49F" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Historical Issues Trend */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Issues Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={historicalScans} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="date" tick={{ fill: '#aaa' }} angle={-45} textAnchor="end" />
                      <YAxis tick={{ fill: '#aaa' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                      <Legend />
                      <Area type="monotone" dataKey="issues" fill="#FF6384" stroke="#FF6384" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* User Flow Analysis (Mock) */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4">User Flow Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <h4 className="font-medium text-gray-400">Average Time to Complete Form</h4>
                      <p className="text-2xl font-bold mt-2">2m 45s</p>
                      <p className="text-green-400 text-sm mt-1">↓ 12% from last week</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <h4 className="font-medium text-gray-400">Form Completion Rate</h4>
                      <p className="text-2xl font-bold mt-2">72%</p>
                      <p className="text-green-400 text-sm mt-1">↑ 5% from last week</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <h4 className="font-medium text-gray-400">Keyboard Navigation Rate</h4>
                      <p className="text-2xl font-bold mt-2">18%</p>
                      <p className="text-red-400 text-sm mt-1">↓ 3% from last week</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={goToSuggestions}
                className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                View AI Suggestions
              </button>
              <button
                className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Report
              </button>
              <button
                className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;