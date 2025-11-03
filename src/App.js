// import React, { useEffect, useState } from 'react';
// import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, onValue } from 'firebase/database';
// import { Line } from 'react-chartjs-2';
// import 'chart.js/auto';
// import './App.css';

// // Firebase configuration provided by the user
// const firebaseConfig = {
//   apiKey: "AIzaSyB9ererNsNonAzH0zQo_GS79XPOyCoMxr4",
//   authDomain: "waterdtection.firebaseapp.com",
//   databaseURL: "https://waterdtection-default-rtdb.firebaseio.com",
//   projectId: "waterdtection",
//   storageBucket: "waterdtection.firebasestorage.app",
//   messagingSenderId: "690886375729",
//   appId: "1:690886375729:web:172c3a47dda6585e4e1810",
//   measurementId: "G-TXF33Y6XY0"
// };

// // Initialize Firebase app and database
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// export default function App() {
//   // Holds the latest values from the database
//   const [data, setData] = useState({});
//   // Holds historical data for each key to feed into charts
//   const [history, setHistory] = useState({});
//   // Loading state
//   const [loading, setLoading] = useState(true);
  
//   // Mock data for demonstration - in real implementation this would come from Firebase
//   const [mockElectricalData, setMockElectricalData] = useState({
//     feedForwardStatus: 'Active',
//     activePower: 1250.5,
//     reactivePower: 350.2,
//     apparentPower: 1298.7,
//     powerFactor: 0.96,
//     inputCurrent: 5.42,
//     phaseACurrent: 4.85,
//     phaseBCurrent: 4.92,
//     phaseCCurrent: 4.88,
//     neutralCurrent: 0.15
//   });

//   // Initialize history with current data when data first loads (after refresh)
//   useEffect(() => {
//     if (Object.keys(data).length > 0 && Object.keys(history).length === 0) {
//       const initialHistory = {};
//       const currentTime = Date.now();
      
//       Object.entries(data).forEach(([key, value]) => {
//         if (key.toLowerCase() === 'any') return;
//         initialHistory[key] = [{ time: currentTime, value: value }];
//       });
      
//       setHistory(initialHistory);
//     }
//   }, [data, history]);

//   useEffect(() => {
//     // Reference to the AVR node in your database
//     const avrRef = ref(database, 'AVR');
    
//     // Listen for realtime updates
//     const unsubscribe = onValue(avrRef, (snapshot) => {
//       const val = snapshot.val() || {};
      
//       // Save the latest values
//       setData(val);
//       setLoading(false);
      
//       // Update chart history for each key except 'Any'
//       setHistory((prevHistory) => {
//         const updatedHistory = { ...prevHistory };
//         const currentTime = Date.now();
        
//         Object.entries(val).forEach(([key, value]) => {
//           if (key.toLowerCase() === 'any') return;
          
//           if (!updatedHistory[key]) {
//             updatedHistory[key] = [];
//           }
          
//           // Only add new point if value has changed or this is the first data point
//           const lastEntry = updatedHistory[key][updatedHistory[key].length - 1];
//           const shouldAddPoint = !lastEntry || 
//                                 lastEntry.value !== value || 
//                                 updatedHistory[key].length === 0;
          
//           if (shouldAddPoint) {
//             updatedHistory[key] = [
//               ...updatedHistory[key],
//               { time: currentTime, value: value }
//             ].slice(-20); // keep only the last 20 points
//           }
//         });
        
//         return updatedHistory;
//       });
//     });
    
//     // Cleanup listener when component unmounts
//     return () => unsubscribe();
//   }, []);

//   // Simulate real-time electrical data updates
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setMockElectricalData(prev => {
//         // Check if system is activated from Firebase data
//         const isSystemActivated = data.System && data.System.toLowerCase() === 'activated';
        
//         return {
//           ...prev,
//           feedForwardStatus: isSystemActivated ? 'Active' : 'Inactive',
//           activePower: isSystemActivated ? (1200 + Math.random() * 100).toFixed(1) : '0.0',
//           reactivePower: isSystemActivated ? (300 + Math.random() * 100).toFixed(1) : '0.0',
//           apparentPower: isSystemActivated ? (1250 + Math.random() * 100).toFixed(1) : '0.0',
//           powerFactor: isSystemActivated ? (0.92 + Math.random() * 0.08).toFixed(2) : '0.00',
//           inputCurrent: isSystemActivated ? (5.0 + Math.random() * 1.0).toFixed(2) : '0.00',
//           phaseACurrent: isSystemActivated ? (4.5 + Math.random() * 0.8).toFixed(2) : '0.00',
//           phaseBCurrent: isSystemActivated ? (4.6 + Math.random() * 0.8).toFixed(2) : '0.00',
//           phaseCCurrent: isSystemActivated ? (4.4 + Math.random() * 0.8).toFixed(2) : '0.00',
//           neutralCurrent: isSystemActivated ? (Math.random() * 0.3).toFixed(2) : '0.00'
//         };
//       });
//     }, 2000); // Update every 2 seconds

//     return () => clearInterval(interval);
//   }, [data.System]); // Depend on system status

//   // Helper function to get display name
//   const getDisplayName = (key) => {
//     return key.toLowerCase() === 'line' ? 'Grid' : key;
//   };

//   // Card styles based on metric types
//   const getCardStyle = (key) => {
//     const keyLower = key.toLowerCase();
    
//     const styles = {
//       line: {
//         icon: '⚡',
//         bgGradient: 'var(--gradient-blue)'
//       },
//       system: {
//         icon: '🔄',
//         bgGradient: 'var(--gradient-green)'
//       },
//       vin: {
//         icon: '🔌',
//         bgGradient: 'var(--gradient-orange)'
//       },
//       vout: {
//         icon: '⚙️',
//         bgGradient: 'var(--gradient-purple)'
//       },
//       current: {
//         icon: '🔋',
//         bgGradient: 'var(--gradient-teal)'
//       },
//       power: {
//         icon: '⚡',
//         bgGradient: 'var(--gradient-red)'
//       },
//       feedforward: {
//         icon: '🎯',
//         bgGradient: 'var(--gradient-blue)'
//       },
//       activepower: {
//         icon: '⚡',
//         bgGradient: 'var(--gradient-red)'
//       },
//       reactivepower: {
//         icon: '🔄',
//         bgGradient: 'var(--gradient-orange)'
//       },
//       apparentpower: {
//         icon: '📊',
//         bgGradient: 'var(--gradient-purple)'
//       },
//       powerfactor: {
//         icon: '📈',
//         bgGradient: 'var(--gradient-green)'
//       },
//       inputcurrent: {
//         icon: '🔌',
//         bgGradient: 'var(--gradient-teal)'
//       },
//       phaseacurrent: {
//         icon: '🔋',
//         bgGradient: 'var(--gradient-blue)'
//       },
//       phasebcurrent: {
//         icon: '🔋',
//         bgGradient: 'var(--gradient-green)'
//       },
//       phaseccurrent: {
//         icon: '🔋',
//         bgGradient: 'var(--gradient-orange)'
//       },
//       neutralcurrent: {
//         icon: '⚪',
//         bgGradient: 'var(--gradient-teal)'
//       }
//     };
    
//     // Return specific style or default
//     return styles[keyLower] || {
//       icon: '📊',
//       bgGradient: 'var(--gradient-purple)'
//     };
//   };

//   // Helper function to format electrical values
//   const formatElectricalValue = (key, value) => {
//     const keyLower = key.toLowerCase();
//     if (keyLower.includes('power') && keyLower !== 'powerfactor') {
//       return `${value} W`;
//     } else if (keyLower.includes('current')) {
//       return `${value} A`;
//     } else if (keyLower === 'powerfactor') {
//       return value;
//     } else if (keyLower === 'feedforwardstatus') {
//       return value;
//     }
//     return value;
//   };

//   // Helper function to get status-based styling for feed-forward
//   const getFeedForwardStatusStyle = (status) => {
//     const isActive = status && status.toString().toLowerCase() === 'active';
//     return {
//       color: isActive ? '#22c55e' : '#ef4444',
//       fontWeight: '600',
//       textShadow: isActive ? '0 0 10px rgba(34, 197, 94, 0.3)' : '0 0 10px rgba(239, 68, 68, 0.3)'
//     };
//   };

//   // Generate cards for original AVR metrics
//   const avrMetricCards = Object.entries(data)
//     .filter(([key]) => key.toLowerCase() !== 'any')
//     .map(([key, value]) => {
//       const { icon, bgGradient } = getCardStyle(key);
//       const displayName = getDisplayName(key);
      
//       return (
//         <div 
//           className="card"
//           key={key} 
//           style={{ background: bgGradient }}
//         >
//           <div className="card-content">
//             <span className="card-icon">{icon}</span>
//             <h2 className="card-title">{displayName}</h2>
//             <div className="card-value-container">
//               <p className="card-value">{value}</p>
//             </div>
//           </div>
//           <div className="card-glow"></div>
//         </div>
//       );
//     });

//   // Generate cards for electrical measurements
//   const electricalMetricCards = Object.entries(mockElectricalData)
//     .map(([key, value]) => {
//       const { icon, bgGradient } = getCardStyle(key);
//       const displayName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
//       const formattedValue = formatElectricalValue(key, value);
//       const isFeedForward = key.toLowerCase() === 'feedforwardstatus';
      
//       return (
//         <div 
//           className="card"
//           key={key} 
//           style={{ background: bgGradient }}
//         >
//           <div className="card-content">
//             <span className="card-icon">{icon}</span>
//             <h2 className="card-title">{displayName}</h2>
//             <div className="card-value-container">
//               <p 
//                 className="card-value"
//                 style={isFeedForward ? getFeedForwardStatusStyle(value) : {}}
//               >
//                 {formattedValue}
//               </p>
//               {isFeedForward && (
//                 <div className={`status-indicator ${value.toLowerCase()}`}></div>
//               )}
//             </div>
//           </div>
//           <div className="card-glow"></div>
//         </div>
//       );
//     });

//   // Combine all metric cards
//   const metricCards = [...avrMetricCards, ...electricalMetricCards];

//   // Helper function to convert string values to numbers for charting
//   const convertValueForChart = (value, allValues) => {
//     const num = parseFloat(value);
//     if (!isNaN(num)) {
//       return num; // Already a number
//     }
    
//     // Handle string values by creating a mapping
//     const stringValue = String(value).toUpperCase();
    
//     // Create a unique set of all string values for this dataset
//     const uniqueStrings = [...new Set(allValues.map(v => String(v).toUpperCase()))];
//     uniqueStrings.sort(); // Sort for consistent mapping
    
//     // Map string to number (starting from 1)
//     const index = uniqueStrings.indexOf(stringValue);
//     return index >= 0 ? index + 1 : 0;
//   };

//   // Generate charts for each metric using its history
//   const chartCards = Object.entries(history)
//     .filter(([key]) => key.toLowerCase() !== 'system')
//     .map(([key, values]) => {
//       // Skip empty history arrays or null/undefined values
//       if (!values || values.length === 0) return null;
      
//       // Use actual timestamps for labels
//       const labels = values.map((d) => new Date(d.time).toLocaleTimeString());
      
//       // Get all values for this dataset to create consistent mapping
//       const allValues = values.map(d => d.value);
      
//       // Convert values for charting (strings to numbers, preserve numbers)
//       const dataSet = values.map((d) => convertValueForChart(d.value, allValues));
      
//       // Keep original values for tooltips
//       const originalValues = values.map(d => d.value);
      
//       const { bgGradient } = getCardStyle(key);
//       const displayName = getDisplayName(key);
      
//       // Extract color from gradient for chart
//       const chartColor = bgGradient.includes('blue') ? '#42a5f5' : 
//                          bgGradient.includes('green') ? '#66bb6a' : 
//                          bgGradient.includes('orange') ? '#ffa726' : 
//                          bgGradient.includes('purple') ? '#ab47bc' :
//                          bgGradient.includes('teal') ? '#26a69a' : '#f44336';
      
//       const chartData = {
//         labels,
//         datasets: [
//           {
//             label: displayName,
//             data: dataSet,
//             fill: true,
//             borderColor: chartColor,
//             backgroundColor: `${chartColor}20`, // 20 = 12.5% opacity
//             borderWidth: 2,
//             pointRadius: 3,
//             pointBackgroundColor: chartColor,
//             tension: 0.4,
//           },
//         ],
//       };
      
//       // Check if we have string values to create custom Y-axis labels
//       const hasStringValues = allValues.some(v => isNaN(parseFloat(v)));
//       const uniqueStringValues = hasStringValues ? 
//         [...new Set(allValues.map(v => String(v).toUpperCase()))].sort() : [];
      
//       return (
//         <div className="chart-card" key={`chart-${key}`}>
//           <h3 className="chart-title">
//             <span className="chart-icon" style={{ background: bgGradient }}>
//               {getCardStyle(key).icon}
//             </span>
//             {displayName} History
//           </h3>
//           <div className="chart-container">
//             <Line
//               data={chartData}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 layout: {
//                   padding: { bottom: 20 },
//                 },
//                 scales: {
//                   x: {
//                     ticks: {
//                       maxTicksLimit: 4,
//                       color: '#666',
//                       font: {
//                         size: 10
//                       }
//                     },
//                     grid: {
//                       display: false,
//                     },
//                   },
//                   y: {
//                     ticks: {
//                       color: '#666',
//                       font: {
//                         size: 10
//                       },
//                       callback: function(value, index, values) {
//                         // If we have string values, show them instead of numbers
//                         if (hasStringValues && uniqueStringValues[value - 1]) {
//                           return uniqueStringValues[value - 1];
//                         }
//                         // For numeric values, show with 1 decimal place
//                         return Number(value).toFixed(1);
//                       }
//                     },
//                     grid: {
//                       color: 'rgba(0,0,0,0.05)',
//                     },
//                     beginAtZero: hasStringValues,
//                     max: hasStringValues ? uniqueStringValues.length : undefined,
//                     min: hasStringValues ? 1 : undefined,
//                   },
//                 },
//                 plugins: {
//                   legend: {
//                     display: false,
//                   },
//                   tooltip: {
//                     backgroundColor: 'rgba(255,255,255,0.9)',
//                     titleColor: '#333',
//                     bodyColor: '#333',
//                     borderColor: 'rgba(0,0,0,0.1)',
//                     borderWidth: 1,
//                     padding: 10,
//                     boxWidth: 10,
//                     usePointStyle: true,
//                     callbacks: {
//                       label: function(context) {
//                         // Show original value in tooltip
//                         const originalValue = originalValues[context.dataIndex];
//                         return `${context.dataset.label}: ${originalValue}`;
//                       }
//                     }
//                   }
//                 },
//                 interaction: {
//                   intersect: false,
//                   mode: 'nearest'
//                 },
//                 animation: {
//                   duration: 1000
//                 }
//               }}
//             />
//           </div>
//         </div>
//       );
//     }).filter(Boolean); // Remove any null entries

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1 className="dashboard-title">
//           Advanced Voltage Regulatory System
//           <span className="dashboard-subtitle">Real-time Monitoring</span>
//         </h1>
//       </div>
      
//       {loading ? (
//         <div className="loading-container">
//           <div className="loading-spinner"></div>
//           <p>Connecting to system...</p>
//         </div>
//       ) : (
//         <>
//           {/* Feed-Forward Status Section */}
//           <div className="section-header">
//             <h2 className="section-title">
//               <span className="section-icon">🎯</span>
//               Feed-Forward Control
//             </h2>
//           </div>
//           <div className="cards-container feed-forward-section">
//             {electricalMetricCards.filter(card => 
//               card.key && card.key.toLowerCase().includes('feedforward')
//             ).length > 0 ? 
//               electricalMetricCards.filter(card => 
//                 card.key && card.key.toLowerCase().includes('feedforward')
//               ) : 
//               <div className="card" style={{ background: 'var(--gradient-blue)' }}>
//                 <div className="card-content">
//                   <span className="card-icon">🎯</span>
//                   <h2 className="card-title">Feed Forward Status</h2>
//                   <div className="card-value-container">
//                     <p 
//                       className="card-value"
//                       style={getFeedForwardStatusStyle(mockElectricalData.feedForwardStatus)}
//                     >
//                       {mockElectricalData.feedForwardStatus}
//                     </p>
//                     <div className={`status-indicator ${mockElectricalData.feedForwardStatus.toLowerCase()}`}></div>
//                   </div>
//                 </div>
//                 <div className="card-glow"></div>
//               </div>
//             }
//           </div>

//           {/* AVR System Metrics */}
//           <div className="section-header">
//             <h2 className="section-title">
//               <span className="section-icon">⚡</span>
//               AVR System Status
//             </h2>
//           </div>
//           <div className="cards-container">
//             {avrMetricCards.length > 0 ? avrMetricCards : (
//               <div className="empty-state">
//                 <p>No AVR metrics available. Waiting for data...</p>
//               </div>
//             )}
//           </div>

//           {/* Power Measurements Section - Only show when system is activated */}
//           {data.System && data.System.toLowerCase() === 'activated' && (
//             <>
//               <div className="section-header">
//                 <h2 className="section-title">
//                   <span className="section-icon">⚡</span>
//                   Power Measurements
//                 </h2>
//               </div>
//               <div className="cards-container power-section">
//                 <div className="card" style={{ background: 'var(--gradient-red)' }}>
//                   <div className="card-content">
//                     <span className="card-icon">⚡</span>
//                     <h2 className="card-title">Active Power</h2>
//                     <div className="card-value-container">
//                       <p className="card-value">{mockElectricalData.activePower} W</p>
//                     </div>
//                   </div>
//                   <div className="card-glow"></div>
//                 </div>
//                 <div className="card" style={{ background: 'var(--gradient-orange)' }}>
//                   <div className="card-content">
//                     <span className="card-icon">🔄</span>
//                     <h2 className="card-title">Reactive Power</h2>
//                     <div className="card-value-container">
//                       <p className="card-value">{mockElectricalData.reactivePower} VAR</p>
//                     </div>
//                   </div>
//                   <div className="card-glow"></div>
//                 </div>
//                 <div className="card" style={{ background: 'var(--gradient-purple)' }}>
//                   <div className="card-content">
//                     <span className="card-icon">📊</span>
//                     <h2 className="card-title">Apparent Power</h2>
//                     <div className="card-value-container">
//                       <p className="card-value">{mockElectricalData.apparentPower} VA</p>
//                     </div>
//                   </div>
//                   <div className="card-glow"></div>
//                 </div>
//                 <div className="card" style={{ background: 'var(--gradient-green)' }}>
//                   <div className="card-content">
//                     <span className="card-icon">📈</span>
//                     <h2 className="card-title">Power Factor</h2>
//                     <div className="card-value-container">
//                       <p className="card-value">{mockElectricalData.powerFactor}</p>
//                     </div>
//                   </div>
//                   <div className="card-glow"></div>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Current Measurements Section - Only show when system is activated */}
//           {data.System && data.System.toLowerCase() === 'activated' && (
//             <>
//               <div className="section-header">
//                 <h2 className="section-title">
//                   <span className="section-icon">🔋</span>
//                   Current Measurements
//                 </h2>
//               </div>
//               <div className="cards-container current-section">
//                 <div className="card" style={{ background: 'var(--gradient-teal)' }}>
//                   <div className="card-content">
//                     <span className="card-icon">🔌</span>
//                     <h2 className="card-title">Input Current</h2>
//                     <div className="card-value-container">
//                       <p className="card-value">{mockElectricalData.inputCurrent} A</p>
//                     </div>
//                   </div>
//                   <div className="card-glow"></div>
//                 </div>
//                 <div className="card" style={{ background: 'var(--gradient-blue)' }}>
//                   <div className="card-content">
//                     <span className="card-icon">🔋</span>
//                     <h2 className="card-title">Phase A Current</h2>
//                     <div className="card-value-container">
//                       <p className="card-value">{mockElectricalData.phaseACurrent} A</p>
//                     </div>
//                   </div>
//                   <div className="card-glow"></div>
//                 </div>
//                 <div className="card" style={{ background: 'var(--gradient-green)' }}>
//                   <div className="card-content">
//                     <span className="card-icon">🔋</span>
//                     <h2 className="card-title">Phase B Current</h2>
//                     <div className="card-value-container">
//                       <p className="card-value">{mockElectricalData.phaseBCurrent} A</p>
//                     </div>
//                   </div>
//                   <div className="card-glow"></div>
//                 </div>
//                 <div className="card" style={{ background: 'var(--gradient-orange)' }}>
//                   <div className="card-content">
//                     <span className="card-icon">🔋</span>
//                     <h2 className="card-title">Phase C Current</h2>
//                     <div className="card-value-container">
//                       <p className="card-value">{mockElectricalData.phaseCCurrent} A</p>
//                     </div>
//                   </div>
//                   <div className="card-glow"></div>
//                 </div>
//                 <div className="card" style={{ background: 'var(--gradient-teal)' }}>
//                   <div className="card-content">
//                     <span className="card-icon">⚪</span>
//                     <h2 className="card-title">Neutral Current</h2>
//                     <div className="card-value-container">
//                       <p className="card-value">{mockElectricalData.neutralCurrent} A</p>
//                     </div>
//                   </div>
//                   <div className="card-glow"></div>
//                 </div>
//               </div>
//             </>
//           )}
          
//           <div className="charts-container">
//             {chartCards.length > 0 ? chartCards : (
//               <div className="empty-state">
//                 <p>No historical data available yet</p>
//               </div>
//             )}
//           </div>
//         </>
//       )}
      
//       <div className="dashboard-footer">
//         <p>Last updated: {new Date().toLocaleString()}</p>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

// Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyB9ererNsNonAzH0zQo_GS79XPOyCoMxr4",
  authDomain: "waterdtection.firebaseapp.com",
  databaseURL: "https://waterdtection-default-rtdb.firebaseio.com",
  projectId: "waterdtection",
  storageBucket: "waterdtection.firebasestorage.app",
  messagingSenderId: "690886375729",
  appId: "1:690886375729:web:172c3a47dda6585e4e1810",
  measurementId: "G-TXF33Y6XY0"
};

// Initialize Firebase app and database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {
  // Holds the latest values from the database
  const [data, setData] = useState({});
  // Holds historical data for each key to feed into charts
  const [history, setHistory] = useState({});
  // Loading state
  const [loading, setLoading] = useState(true);
  // Track last pushed LINE value to avoid duplicates
  const lastLineValueRef = useRef(undefined);
  // Simulated electrical measurements
  const [electricalData, setElectricalData] = useState({
    ActivePower: 1250.5,
    ReactivePower: 350.2,
    ApparentPower: 1298.7,
    PowerFactor: 0.96,
    InputCurrent: 5.42,
    PhaseACurrent: 4.85,
    PhaseBCurrent: 4.92,
    PhaseCCurrent: 4.88,
    NeutralCurrent: 0.15
  });

  useEffect(() => {
    // Reference to the AVR node for current values
    const avrRef = ref(database, 'AVR');
    
    // Reference to the history node
    const historyRef = ref(database, 'AVR/history');
    
    // Listen for current AVR data updates
    const unsubscribeAVR = onValue(avrRef, (snapshot) => {
      const val = snapshot.val() || {};
      
      // Remove history from current data display
      const { history: _, ...currentData } = val;
      
      // Save the latest values (excluding history)
      setData(currentData);
      setLoading(false);
    });
    
    // Listen for history data updates
    const unsubscribeHistory = onValue(historyRef, (snapshot) => {
      const firebaseHistory = snapshot.val();
      
      if (firebaseHistory && typeof firebaseHistory === 'object') {
        const processedHistory = {};
        
        // Convert Firebase history entries to array
        const historyEntries = Object.values(firebaseHistory);
        
        // Process each history entry
        historyEntries.forEach((entry) => {
          if (entry && typeof entry === 'object') {
            // Get timestamp - try different possible field names
            const timestamp = entry.ts_ms || entry.line_ts || entry.timestamp || Date.now();
            
            // Map of Firebase fields to display names
            const fieldMappings = {
              // Map 'line' history to 'Line' so charts reflect pole changes
              'line': 'Line',
              'vin': 'VIN',
              'ActivePower': 'ActivePower',
              'ReactivePower': 'ReactivePower',
              'ApparentPower': 'ApparentPower',
              'PowerFactor': 'PowerFactor',
              'InputCurrent': 'InputCurrent',
              'PhaseACurrent': 'PhaseACurrent',
              'PhaseBCurrent': 'PhaseBCurrent',
              'PhaseCCurrent': 'PhaseCCurrent',
              'NeutralCurrent': 'NeutralCurrent'
            };
            
            // Process each field in the history entry
            Object.entries(fieldMappings).forEach(([firebaseKey, displayKey]) => {
              if (entry[firebaseKey] !== undefined && entry[firebaseKey] !== null) {
                if (!processedHistory[displayKey]) {
                  processedHistory[displayKey] = [];
                }
                
                processedHistory[displayKey].push({
                  time: timestamp,
                  value: entry[firebaseKey]
                });
              }
            });
          }
        });
        
        // Sort each history array by timestamp and keep last 50 points
        Object.keys(processedHistory).forEach(key => {
          if (processedHistory[key].length > 0) {
            processedHistory[key] = processedHistory[key]
              .sort((a, b) => a.time - b.time)
              .slice(-50); // Keep last 50 data points
          } else {
            // Remove empty arrays
            delete processedHistory[key];
          }
        });
        
        // Merge processed history with any existing history to preserve locally captured series
        setHistory(prev => {
          const merged = { ...prev };
          Object.entries(processedHistory).forEach(([k, arr]) => {
            merged[k] = arr;
          });
          return merged;
        });
      }
    });
    
    // Cleanup listeners when component unmounts
    return () => {
      unsubscribeAVR();
      unsubscribeHistory();
    };
  }, []);

  // Capture LINE changes from the current AVR node and append to local history
  useEffect(() => {
    if (loading) return;
    const lineValue = data && data.Line;
    if (lineValue === undefined || lineValue === null) return;

    setHistory(prev => {
      const existing = prev.Line || [];
      const last = existing[existing.length - 1];
      // Avoid pushing duplicates if value hasn't changed
      if (last && String(last.value) === String(lineValue)) {
        return prev;
      }
      const updated = [...existing, { time: Date.now(), value: lineValue }].slice(-50);
      return { ...prev, Line: updated };
    });

    lastLineValueRef.current = lineValue;
  }, [data.Line, loading]);

  // Simulate real-time electrical data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setElectricalData(prev => {
        // Check if system is activated from Firebase data
        const isSystemActivated = data.System && String(data.System).toLowerCase() === 'activated';
        
        if (isSystemActivated) {
          // Generate realistic fluctuating values when activated
          return {
            ActivePower: parseFloat((1200 + Math.random() * 100).toFixed(1)),
            ReactivePower: parseFloat((300 + Math.random() * 100).toFixed(1)),
            ApparentPower: parseFloat((1250 + Math.random() * 100).toFixed(1)),
            PowerFactor: parseFloat((0.92 + Math.random() * 0.08).toFixed(2)),
            InputCurrent: parseFloat((5.0 + Math.random() * 1.0).toFixed(2)),
            PhaseACurrent: parseFloat((4.5 + Math.random() * 0.8).toFixed(2)),
            PhaseBCurrent: parseFloat((4.6 + Math.random() * 0.8).toFixed(2)),
            PhaseCCurrent: parseFloat((4.4 + Math.random() * 0.8).toFixed(2)),
            NeutralCurrent: parseFloat((Math.random() * 0.3).toFixed(2))
          };
        } else {
          // Return zero values when not activated
          return {
            ActivePower: 0.0,
            ReactivePower: 0.0,
            ApparentPower: 0.0,
            PowerFactor: 0.00,
            InputCurrent: 0.00,
            PhaseACurrent: 0.00,
            PhaseBCurrent: 0.00,
            PhaseCCurrent: 0.00,
            NeutralCurrent: 0.00
          };
        }
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [data.System]);

  // Helper function to get display name
  const getDisplayName = (key) => {
    const keyLower = key.toLowerCase();
    if (keyLower === 'any') {
      return 'ANY';
    }
    if (keyLower === 'line') {
      return 'LINE';
    }
    if (keyLower === 'capacitor') {
      return 'CAPACITOR';
    }
    
    // Format camelCase to Title Case
    const formatted = key.replace(/([A-Z])/g, ' $1').trim();
    return formatted.toUpperCase();
  };

  // Card styles based on metric types
  const getCardStyle = (key) => {
    const keyLower = key.toLowerCase();
    
    const styles = {
      any: {
        icon: '⚡',
        bgGradient: 'var(--gradient-blue)'
      },
      capacitor: {
        icon: '⚡',
        bgGradient: 'var(--gradient-blue)'
      },
      line: {
        icon: '⚡',
        bgGradient: 'var(--gradient-blue)'
      },
      system: {
        icon: '🔄',
        bgGradient: 'var(--gradient-green)'
      },
      vin: {
        icon: '🔌',
        bgGradient: 'var(--gradient-orange)'
      },
      activepower: {
        icon: '⚡',
        bgGradient: 'var(--gradient-red)'
      },
      reactivepower: {
        icon: '🔄',
        bgGradient: 'var(--gradient-orange)'
      },
      apparentpower: {
        icon: '📊',
        bgGradient: 'var(--gradient-purple)'
      },
      powerfactor: {
        icon: '📈',
        bgGradient: 'var(--gradient-green)'
      },
      inputcurrent: {
        icon: '🔌',
        bgGradient: 'var(--gradient-teal)'
      },
      phaseacurrent: {
        icon: '🔋',
        bgGradient: 'var(--gradient-blue)'
      },
      phasebcurrent: {
        icon: '🔋',
        bgGradient: 'var(--gradient-green)'
      },
      phaseccurrent: {
        icon: '🔋',
        bgGradient: 'var(--gradient-orange)'
      },
      neutralcurrent: {
        icon: '⚪',
        bgGradient: 'var(--gradient-teal)'
      }
    };
    
    // Return specific style or default
    return styles[keyLower] || {
      icon: '📊',
      bgGradient: 'var(--gradient-purple)'
    };
  };

  // Helper function to get status-based styling
  const getStatusStyle = (status) => {
    const statusLower = String(status).toLowerCase();
    const isActive = statusLower === 'active' || statusLower === 'activated';
    return {
      color: isActive ? '#22c55e' : '#ef4444',
      fontWeight: '600',
      textShadow: isActive ? '0 0 10px rgba(34, 197, 94, 0.3)' : '0 0 10px rgba(239, 68, 68, 0.3)'
    };
  };

  // Helper function to convert string values to numbers for charting
  const convertValueForChart = (value, allValues) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      return num; // Already a number
    }
    
    // Handle string values by creating a mapping
    const stringValue = String(value).toUpperCase();
    
    // Create a unique set of all string values for this dataset
    const uniqueStrings = [...new Set(allValues.map(v => String(v).toUpperCase()))];
    uniqueStrings.sort(); // Sort for consistent mapping
    
    // Map string to number (starting from 1)
    const index = uniqueStrings.indexOf(stringValue);
    return index >= 0 ? index + 1 : 0;
  };

  // Helper function to safely render values - prevents [object Object] display
  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return '—';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Pre-compute which history series to chart: LINE and VIN only
  const chartEntries = Object.entries(history || {}).filter(([key]) => {
    const k = String(key).toLowerCase();
    return k === 'line' || k === 'vin';
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Advanced Voltage Regulatory System
          <span className="dashboard-subtitle">Real-time Monitoring</span>
        </h1>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Connecting to system...</p>
        </div>
      ) : (
        <>
          {/* Feed-Forward Control Status - Based on System status from Firebase */}
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">🎯</span>
              Feed-Forward Control
            </h2>
          </div>
          <div className="cards-container feed-forward-section">
            <div className="card" style={{ background: 'var(--gradient-blue)' }}>
              <div className="card-content">
                <span className="card-icon">🎯</span>
                <h2 className="card-title">FEED FORWARD STATUS</h2>
                <div className="card-value-container">
                  <p 
                    className="card-value"
                    style={getStatusStyle(data.System || 'Inactive')}
                  >
                    {(() => {
                      if (!data.System) return 'Inactive';
                      const systemStatus = String(data.System).toLowerCase();
                      if (systemStatus === 'standby') return 'Inactive';
                      if (systemStatus === 'activated' || systemStatus === 'active') return 'Active';
                      return data.System;
                    })()}
                  </p>
                  <div className={`status-indicator ${data.System && String(data.System).toLowerCase() !== 'standby' ? 'active' : 'inactive'}`}></div>
                </div>
              </div>
              <div className="card-glow"></div>
            </div>
          </div>

          {/* AVR System Metrics */}
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">⚡</span>
              AVR System Status
            </h2>
          </div>
          <div className="cards-container">
            {Object.entries(data)
              // Show all top-level keys except history
              .filter(([key]) => key.toLowerCase() !== 'history')
              .length > 0 ? (
              Object.entries(data)
                .filter(([key]) => key.toLowerCase() !== 'history')
                .map(([key, value]) => {
                  const { icon, bgGradient } = getCardStyle(key);
                  const displayName = getDisplayName(key);
                  
                  return (
                    <div 
                      className="card"
                      key={key} 
                      style={{ background: bgGradient }}
                    >
                      <div className="card-content">
                        <span className="card-icon">{icon}</span>
                        <h2 className="card-title">{displayName}</h2>
                        <div className="card-value-container">
                          <p className="card-value">{renderValue(value)}</p>
                        </div>
                      </div>
                      <div className="card-glow"></div>
                    </div>
                  );
                })
            ) : (
              <div className="empty-state">
                <p>No AVR metrics available. Waiting for data...</p>
              </div>
            )}
          </div>

          {/* Power Measurements Section - Only show when system is activated */}
          {data.System && String(data.System).toLowerCase() === 'activated' && (
            <>
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-icon">⚡</span>
                  Power Measurements
                </h2>
              </div>
              <div className="cards-container power-section">
                <div className="card" style={{ background: 'var(--gradient-red)' }}>
                  <div className="card-content">
                    <span className="card-icon">⚡</span>
                    <h2 className="card-title">Active Power</h2>
                    <div className="card-value-container">
                      <p className="card-value">{data.ActivePower || electricalData.ActivePower} W</p>
                    </div>
                  </div>
                  <div className="card-glow"></div>
                </div>
                <div className="card" style={{ background: 'var(--gradient-orange)' }}>
                  <div className="card-content">
                    <span className="card-icon">🔄</span>
                    <h2 className="card-title">Reactive Power</h2>
                    <div className="card-value-container">
                      <p className="card-value">{data.ReactivePower || electricalData.ReactivePower} VAR</p>
                    </div>
                  </div>
                  <div className="card-glow"></div>
                </div>
                <div className="card" style={{ background: 'var(--gradient-purple)' }}>
                  <div className="card-content">
                    <span className="card-icon">📊</span>
                    <h2 className="card-title">Apparent Power</h2>
                    <div className="card-value-container">
                      <p className="card-value">{data.ApparentPower || electricalData.ApparentPower} VA</p>
                    </div>
                  </div>
                  <div className="card-glow"></div>
                </div>
                <div className="card" style={{ background: 'var(--gradient-green)' }}>
                  <div className="card-content">
                    <span className="card-icon">📈</span>
                    <h2 className="card-title">Power Factor</h2>
                    <div className="card-value-container">
                      <p className="card-value">{data.PowerFactor || electricalData.PowerFactor}</p>
                    </div>
                  </div>
                  <div className="card-glow"></div>
                </div>
              </div>
            </>
          )}

          {/* Current Measurements Section - Only show when system is activated */}
          {data.System && String(data.System).toLowerCase() === 'activated' && (
            <>
              <div className="section-header">
                <h2 className="section-title">
                  <span className="section-icon">🔋</span>
                  Current Measurements
                </h2>
              </div>
              <div className="cards-container current-section">
                <div className="card" style={{ background: 'var(--gradient-teal)' }}>
                  <div className="card-content">
                    <span className="card-icon">🔌</span>
                    <h2 className="card-title">Input Current</h2>
                    <div className="card-value-container">
                      <p className="card-value">{data.InputCurrent || electricalData.InputCurrent} A</p>
                    </div>
                  </div>
                  <div className="card-glow"></div>
                </div>
                <div className="card" style={{ background: 'var(--gradient-blue)' }}>
                  <div className="card-content">
                    <span className="card-icon">🔋</span>
                    <h2 className="card-title">Phase A Current</h2>
                    <div className="card-value-container">
                      <p className="card-value">{data.PhaseACurrent || electricalData.PhaseACurrent} A</p>
                    </div>
                  </div>
                  <div className="card-glow"></div>
                </div>
                <div className="card" style={{ background: 'var(--gradient-green)' }}>
                  <div className="card-content">
                    <span className="card-icon">🔋</span>
                    <h2 className="card-title">Phase B Current</h2>
                    <div className="card-value-container">
                      <p className="card-value">{data.PhaseBCurrent || electricalData.PhaseBCurrent} A</p>
                    </div>
                  </div>
                  <div className="card-glow"></div>
                </div>
                <div className="card" style={{ background: 'var(--gradient-orange)' }}>
                  <div className="card-content">
                    <span className="card-icon">🔋</span>
                    <h2 className="card-title">Phase C Current</h2>
                    <div className="card-value-container">
                      <p className="card-value">{data.PhaseCCurrent || electricalData.PhaseCCurrent} A</p>
                    </div>
                  </div>
                  <div className="card-glow"></div>
                </div>
                <div className="card" style={{ background: 'var(--gradient-teal)' }}>
                  <div className="card-content">
                    <span className="card-icon">⚪</span>
                    <h2 className="card-title">Neutral Current</h2>
                    <div className="card-value-container">
                      <p className="card-value">{data.NeutralCurrent || electricalData.NeutralCurrent} A</p>
                    </div>
                  </div>
                  <div className="card-glow"></div>
                </div>
              </div>
            </>
          )}
          
          {/* Charts Section */}
          <div className="charts-container">
            {chartEntries.length > 0 ? (
              chartEntries
                // Only show two graphs: LINE (from 'line' history) and VIN history
                .map(([key, values]) => {
                  // Skip empty history arrays or null/undefined values
                  if (!values || values.length === 0) return null;
                  
                  // Use actual timestamps for labels
                  const labels = values.map((d) => new Date(d.time).toLocaleTimeString());
                  
                  // Get all values for this dataset to create consistent mapping
                  const allValues = values.map(d => d.value);
                  
                  // Convert values for charting (strings to numbers, preserve numbers)
                  const dataSet = values.map((d) => convertValueForChart(d.value, allValues));
                  
                  // Keep original values for tooltips
                  const originalValues = values.map(d => renderValue(d.value));
                  
                  const { bgGradient } = getCardStyle(key);
                  const displayName = getDisplayName(key);
                  
                  // Extract color from gradient for chart
                  const chartColor = bgGradient.includes('blue') ? '#42a5f5' : 
                                    bgGradient.includes('green') ? '#66bb6a' : 
                                    bgGradient.includes('orange') ? '#ffa726' : 
                                    bgGradient.includes('purple') ? '#ab47bc' :
                                    bgGradient.includes('teal') ? '#26a69a' : '#f44336';
                  
                  const chartData = {
                    labels,
                    datasets: [
                      {
                        label: displayName,
                        data: dataSet,
                        fill: true,
                        borderColor: chartColor,
                        backgroundColor: `${chartColor}20`,
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: chartColor,
                        tension: 0.4,
                      },
                    ],
                  };
                  
                  // Check if we have string values to create custom Y-axis labels
                  const hasStringValues = allValues.some(v => isNaN(parseFloat(v)));
                  const uniqueStringValues = hasStringValues ? 
                    [...new Set(allValues.map(v => String(v).toUpperCase()))].sort() : [];
                  
                  return (
                    <div className="chart-card" key={`chart-${key}`}>
                      <h3 className="chart-title">
                        <span className="chart-icon" style={{ background: bgGradient }}>
                          {getCardStyle(key).icon}
                        </span>
                        {displayName} History
                      </h3>
                      <div className="chart-container">
                        <Line
                          data={chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            layout: {
                              padding: { bottom: 20 },
                            },
                            scales: {
                              x: {
                                ticks: {
                                  maxTicksLimit: 4,
                                  color: '#666',
                                  font: {
                                    size: 10
                                  }
                                },
                                grid: {
                                  display: false,
                                },
                              },
                              y: {
                                ticks: {
                                  color: '#666',
                                  font: {
                                    size: 10
                                  },
                                  callback: function(value, index, values) {
                                    if (hasStringValues && uniqueStringValues[value - 1]) {
                                      return uniqueStringValues[value - 1];
                                    }
                                    return Number(value).toFixed(1);
                                  }
                                },
                                grid: {
                                  color: 'rgba(0,0,0,0.05)',
                                },
                                beginAtZero: hasStringValues,
                                max: hasStringValues ? uniqueStringValues.length : undefined,
                                min: hasStringValues ? 1 : undefined,
                              },
                            },
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                titleColor: '#333',
                                bodyColor: '#333',
                                borderColor: 'rgba(0,0,0,0.1)',
                                borderWidth: 1,
                                padding: 10,
                                boxWidth: 10,
                                usePointStyle: true,
                                callbacks: {
                                  label: function(context) {
                                    const originalValue = originalValues[context.dataIndex];
                                    return `${context.dataset.label}: ${originalValue}`;
                                  }
                                }
                              }
                            },
                            interaction: {
                              intersect: false,
                              mode: 'nearest'
                            },
                            animation: {
                              duration: 1000
                            }
                          }}
                        />
                      </div>
                    </div>
                  );
                }).filter(Boolean)
            ) : (
              <div className="empty-state">
                <p>No historical data available yet</p>
              </div>
            )}
          </div>
        </>
      )}
      
      <div className="dashboard-footer">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}
