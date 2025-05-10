import React, { useState, useCallback, useRef, useEffect } from 'react';
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
    IconButton,
    Container,
    Avatar,
    TextField,
    InputAdornment
} from '@mui/material';
import { 
    Mic as MicIcon, 
    Stop as StopIcon, 
    CloudUpload as CloudUploadIcon,
    Menu as MenuIcon,
    Send as SendIcon
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
    const [messages, setMessages] = useState([
        { type: 'bot', content: 'Hello! I\'m your weather assistant. How can I help you today?' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            console.log("🔍 Response:\n", response.data.text);
            setMessages(prev => [...prev, { type: 'user', content: response.data.text }]);
            setMessages(prev => [...prev, { type: 'bot', content: response.data.result }]);
        } catch (error) {
            console.error('Error processing voice query:', error);
            setError(error.response?.data?.error || 'Failed to process voice query');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = inputMessage;
        setInputMessage('');
        setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

        try {
            setIsLoading(true);
            const response = await axios.post('http://localhost:5000/api/query/text', {
                query: userMessage
            });
            setMessages(prev => [...prev, { type: 'bot', content: response.data }]);
        } catch (error) {
            console.error('Error processing text query:', error);
            setError(error.response?.data?.error || 'Failed to process text query');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
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
    const [history, setHistory] = useState([]);
    const getHistory = async () => {
        const response = await axios.get('http://localhost:5000/api/query/history');
        console.log("🔍 History:\n", response.data);
        setHistory(response.data);
    };
    useEffect(() => {
        getHistory();
    }, []);
    const addToHistory = (query) => {
        setHistory([...history, { query }]);
    };

    return (
        <ErrorBoundary>
            <Box sx={{ display: 'flex', height: '100vh' }}>
                <Sidebar open={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} history={history} />
                
                <Box sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    height: '100%',
                    bgcolor: '#f5f5f5'
                }}>
                    {/* Chat Header */}
                    <Paper elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6">Weather Assistant</Typography>
                    </Paper>

                    {/* Messages Area */}
                    <Box sx={{ 
                        flexGrow: 1, 
                        overflow: 'auto', 
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        {messages.map((message, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                                    gap: 1
                                }}
                            >
                                {message.type === 'bot' && (
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>W</Avatar>
                                )}
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        maxWidth: '70%',
                                        bgcolor: message.type === 'user' ? 'primary.main' : 'white',
                                        color: message.type === 'user' ? 'white' : 'text.primary',
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography>{message.content}</Typography>
                                </Paper>
                                {message.type === 'user' && (
                                    <Avatar sx={{ bgcolor: 'secondary.main' }}>U</Avatar>
                                )}
                            </Box>
                        ))}
                        {isLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>W</Avatar>
                                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                                    <CircularProgress size={20} />
                                </Paper>
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input Area */}
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Type your message..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleSendMessage} color="primary">
                                                <SendIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <IconButton 
                                color={isRecording ? "error" : "primary"}
                                onClick={isRecording ? stopRecording : startRecording}
                            >
                                {isRecording ? <StopIcon /> : <MicIcon />}
                            </IconButton>
                        </Box>
                    </Paper>
                </Box>
            </Box>

            {/* Error Snackbar */}
            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </ErrorBoundary>
    );
};

export default WeatherAgent;