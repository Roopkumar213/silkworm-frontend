import React from "react";
import { DISEASES } from "./diseases"; // your disease data

const cardStyle = {
  backgroundColor: '#ffffff', // White background
  border: '1px solid #e0e0e0', // Light grey border
  borderRadius: '12px', // Rounded corners
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', // Soft shadow
  padding: '20px',
  margin: '15px 0',
  transition: 'transform 0.2s ease-in-out', // Smooth hover effect
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const headerStyle = {
  color: '#007bff', // Primary blue color for the heading
  fontSize: '1.4em',
  marginBottom: '10px',
  borderBottom: '2px solid #007bff', // Blue underline
  paddingBottom: '5px',
};

const measuresHeaderStyle = {
  color: '#28a745', // Use a secondary color (green) for measures
  fontSize: '1.2em',
  marginTop: '15px',
  marginBottom: '10px',
  borderBottom: '1px solid #ccc',
  paddingBottom: '5px',
};

const listStyle = {
  listStyleType: 'disc', // Standard bullet points
  paddingLeft: '20px',
  margin: '0',
  color: '#333333', // Dark text color
  lineHeight: '1.6',
};

const listItemStyle = {
  marginBottom: '8px',
};

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto', // Center the content
  padding: '20px',
};

const Result = ({ results }) => {
  // helper to get random disease
  const getRandomDisease = () => {
    const index = Math.floor(Math.random() * DISEASES.length);
    return DISEASES[index];
  };

  return (
    <div style={containerStyle} className="results-container">
      {results.map((result, index) => {
        if (!result.label) return null;

        // if healthy, skip showing disease
        if (result.label.toLowerCase() === "healthy") return(
          <div>
           <h1> its healthy No worries</h1>
            </div>
        );

        const diseaseInfo = getRandomDisease(); // pick random disease

        return (
          <div 
            key={index} 
            style={cardStyle}
            className="disease-info-card"
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Disease Name */}
            <h4 style={headerStyle}> Disease:{diseaseInfo.name} </h4>
            
            {/* New Header for Measures */}
            <h2 style={measuresHeaderStyle}>Preventive Measures:</h2>
            
            <ul style={listStyle}>
              {diseaseInfo.measures.map((measure, i) => (
                <li key={i} style={listItemStyle}>
                  {measure}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default Result;