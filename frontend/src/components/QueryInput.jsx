import { TextField, IconButton, Stack } from '@mui/material';
import { Mic, Send } from '@mui/icons-material';
import { useState } from 'react';

export default function QueryInput({ onSubmit }) {
  const [query, setQuery] = useState("");

  const handleSend = () => {
    if (query.trim()) onSubmit(query);
    setQuery("");
  };

  return (
    <Stack direction="row" spacing={1}>
      <TextField fullWidth value={query} onChange={(e) => setQuery(e.target.value)} label="Ask about weather..." />
      <IconButton onClick={handleSend}><Send /></IconButton>
      <IconButton><Mic /></IconButton>
    </Stack>
  );
}
