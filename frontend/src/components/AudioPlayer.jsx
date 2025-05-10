import { useEffect, useRef } from 'react';
import { IconButton } from '@mui/material';
import { Stop, PlayArrow ,PlayArrowRounded} from '@mui/icons-material';

export default function AudioPlayer({ audioUrl, onStop }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioUrl]);

  return audioUrl ? (
    <div>
      <audio ref={audioRef} src={audioUrl} />
      <IconButton onClick={() => { audioRef.current.pause(); onStop(); }}>
        <PlayArrowRounded />
      </IconButton>
    </div>
  ) : null;
}
