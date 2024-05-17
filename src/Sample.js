import React, { useState } from 'react';

const Sample = () => {
  const [state, setState] = useState('');

  const handleChange = (e) => {
    setState(e.target.value);
  };

  const handleClick = () => {
    console.log(state);
  };

  // Define style object based on the value of state
  const style = {
    color: state === 'saran' ? 'blue' : state === 'sakthi' ? 'red' : 'green',
    fontSize: state === 'saran' ? '2rem' : state === 'sakthi' ? '4rem' : '1rem',
    fontWeight: state === 'saran' ? '600' : state === 'sakthi' ? '800' : '400',
  };

  return (
    <div>
      <input type='text' value={state} onChange={handleChange} placeholder='enter here...' />
      <button onClick={handleClick}>click</button>
      {/* Apply the style conditionally */}
      <h1 className='cont' style={style}>{state}</h1>
    </div>
  );
};

export default Sample;
