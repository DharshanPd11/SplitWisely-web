// src/components/MyComponent.js
import React, { useState } from 'react';

const MyComponent = () => {
  const [response, setResponse] = useState(null);

  const handleSubmit = async () => {
    const data = { example: 'data' };
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log('Response from server:', result); 
      setResponse(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={handleSubmit}>Send Data</button>
      {response && <div>Response: {JSON.stringify(response)}</div>}
    </div>
  );
};

export default MyComponent;
