// src/components/ResponseDisplay.jsx
import { Paper, Typography } from '@mui/material';

export default function ResponseDisplay({ response }) {
  if (!response) return null;

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Weather Agent Response
      </Typography>
      <Typography>{response}</Typography>
    </Paper>
  );
}
