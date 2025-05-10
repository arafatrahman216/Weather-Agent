// src/components/Sidebar.jsx
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
    Collapse,
} from '@mui/material';
import { ChevronLeft, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';

export default function Sidebar({ open, toggleSidebar, history }) {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const drawerRef = useRef(null);

    const handleToggle = (index) => {
        setExpandedIndex(index === expandedIndex ? null : index);
    };

    return (
        <Drawer 
            variant="temporary" 
            anchor="left" 
            open={open}
            onClose={toggleSidebar}
            ref={drawerRef}
            sx={{
                '& .MuiDrawer-paper': {
                    position: 'fixed',
                    maxWidth: 600,
                    width: '100%',
                    boxSizing: 'border-box',
                },
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }
            }}
        >
            <IconButton onClick={toggleSidebar}>
                <ChevronLeft />
            </IconButton>
            <Typography variant="h6" sx={{ p: 2 }}>
                Query History
            </Typography>
            <List>
                {history && history.map((item, index) => (
                    <div key={index}>
                        <ListItem button onClick={() => handleToggle(index)}>
                            <ListItemText primary={item.query} />
                            {expandedIndex === index ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
                            <Typography sx={{ pl: 4, pr: 2, pb: 1 }}>
                                {item.response}
                            </Typography>
                        </Collapse>
                    </div>
                ))}
            </List>
        </Drawer>
    );
}
  