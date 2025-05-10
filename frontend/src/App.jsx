import { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import WeatherAgent from './pages/WeatherAgent';

function App() {
  const [count, setCount] = useState(0);

  return (
    
      <WeatherAgent />
  );
}

export default App;




// function App() {
//   return <WeatherAgent />;
// }

// export default App;