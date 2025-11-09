import React from 'react';

const StaffRegistrationPageSimple: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Staff Registration Page</h1>
      <p>This is a test to see if the basic component renders.</p>
      <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px' }}>
        <h2>Basic Form</h2>
        <form>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name">Name:</label>
            <input id="name" type="text" style={{ marginLeft: '10px', padding: '5px' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email">Email:</label>
            <input id="email" type="email" style={{ marginLeft: '10px', padding: '5px' }} />
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffRegistrationPageSimple;