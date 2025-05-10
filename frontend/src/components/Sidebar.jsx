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
  import { useState } from 'react';
  
  export default function Sidebar({ open, toggleSidebar, history }) {
    const [expandedIndex, setExpandedIndex] = useState(null);
  
    const handleToggle = (index) => {
      setExpandedIndex(index === expandedIndex ? null : index);
    };
  
    return (
      <Drawer variant="persistent" anchor="left" open={open}>
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
  