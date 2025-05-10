import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
    Box, 
    Button, 
    Card, 
    CardContent, 
    Typography, 
    CircularProgress,
    Alert,
    Snackbar,
    Paper,
    IconButton  
} from '@mui/material';
import { 
    Mic as MicIcon, 
    Stop as StopIcon, 
    CloudUpload as CloudUploadIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import axios from 'axios';
import QueryInput from '../components/QueryInput';
import AudioPlayer from '../components/AudioPlayer';
import Sidebar from '../components/Sidebar';
import ResponseDisplay from '../components/ResponseDisplay';
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('WeatherAgent Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Alert 
                    severity="error" 
                    action={
                        <Button 
                            color="inherit" 
                            size="small"
                            onClick={() => this.setState({ hasError: false, error: null })}
                        >
                            Try Again
                        </Button>
                    }
                >
                    <Typography variant="h6">Something went wrong</Typography>
                    <Typography variant="body2">
                        Please try refreshing the page or contact support if the problem persists.
                    </Typography>
                </Alert>
            );
        }

        return this.props.children;
    }
}

const WeatherAgent = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState("hahaha");
    const [error, setError] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        try {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                const audioData = e.target.result;
                await handleAudioSubmit(audioData);
            };
            
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error processing audio file:', error);
            setError('Failed to process audio file');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'audio/*': ['.mp3', '.wav', '.ogg', '.m4a']
        },
        multiple: false
    });

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onstop = async () => {
                const audioBlob = new Blob(chunks, { type: 'audio/wav' });
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const audioData = e.target.result;
                    await handleAudioSubmit(audioData);
                };
                reader.readAsDataURL(audioBlob);
            };

            recorder.start();
            setMediaRecorder(recorder);
            setAudioChunks(chunks);
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
            setError('Failed to start recording. Please check microphone permissions.');
        }
    };

    const stopRecording = async () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            console.log("🔍 Stopped recording");
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioData = await audioBlob.arrayBuffer();
            // await handleAudioSubmit(audioData);
            
        }
    };

    const handleAudioSubmit = async (audioData) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.post('http://localhost:5000/api/query/voice', {
                audioData
            });
            console.log("🔍 Response:\n", response.data);
            
            setResponse(response.data);
        } catch (error) {
            console.error('Error processing voice query:', error);
            setError(error.response?.data?.error || 'Failed to process voice query');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseError = () => {
        setError(null);
    };

    const handleQuery = async (query) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.post('http://localhost:5000/api/query/text', {
                query
            });
            console.log(response.data);
            setResponse(response.data);
        } catch (error) {
            console.error('Error processing text query:', error);
            setError(error.response?.data?.error || 'Failed to process text query');
        } finally {
            setIsLoading(false);
        }
    };

    const stopAudio = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const audioUrl = '/output.mp3';
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const history1 = [
        { query: 'What is the weather in Tokyo?' },
        { query: 'What is the weather in New York?' },
        { query: 'What is the weather in London?' },
        { query: 'What is the weather in Paris?' },
        { query: 'What is the weather in Tokyo?' },
    ];
    const [history, setHistory] = useState(history1);
    const addToHistory = (query) => {
        setHistory([...history, { query }]);
    };


    return (
        <ErrorBoundary>
            <IconButton onClick={toggleSidebar} sx={{ position: 'fixed', left: 0, top: 10 }}>
                <MenuIcon />
            </IconButton>
            <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Weather Voice Assistant
                        </Typography>
                        <QueryInput onSubmit={handleQuery} />
                        
                        <AudioPlayer
                            style={{ marginTop: '10px' }}
                            audioUrl={audioUrl}
                            onStop={stopAudio}
                        />
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 , mt: 3}}>
                            {/* Voice Recording Section */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color={isRecording ? "error" : "primary"}
                                    onClick={isRecording ? stopRecording : startRecording}
                                    startIcon={isRecording ? <StopIcon /> : <MicIcon />}
                                    size="large"
                                >
                                    {isRecording ? "Stop Recording" : "Start Recording"}
                                </Button>
                                
                                {isRecording && (
                                    <Typography variant="body2" color="text.secondary">
                                        Recording... Click stop when finished
                                    </Typography>
                                )}
                            </Box>

                            {/* File Upload Section */}
                            <Paper
                                {...getRootProps()}
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                                    border: '2px dashed',
                                    borderColor: isDragActive ? 'primary.main' : 'divider',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        bgcolor: 'action.hover'
                                    }
                                }}
                            >
                                <input {...getInputProps()} />
                                <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                <Typography>
                                    {isDragActive
                                        ? "Drop the audio file here"
                                        : "Drag and drop an audio file here, or click to select"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Supported formats: MP3, WAV, OGG, M4A
                                </Typography>
                            </Paper>

                            {/* Loading State */}
                            {isLoading && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                    <CircularProgress />
                                    <Typography color="text.secondary">
                                        Processing your voice query...
                                    </Typography>
                                </Box>
                            )}

                            {/* Response Display */}
                            {response && !isLoading && (
                                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Response:
                                    </Typography>
                                    <Typography>
                                        {response}
                                    </Typography>
                                </Paper>
                            )}
                        </Box>
                    </CardContent>
                    {/* <ResponseDisplay response={response} /> */}
                </Card>

                {/* Error Snackbar */}
                <Snackbar 
                    open={!!error} 
                    autoHideDuration={6000} 
                    onClose={handleCloseError}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            </Box>
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} history={history} />
        </ErrorBoundary>

    );
};

export default WeatherAgent;