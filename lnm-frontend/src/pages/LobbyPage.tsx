import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';

const LobbyPage: React.FC = () => {
    const [lobbyName, setLobbyName] = useState<string>('');

    const handleCreateLobby = () => {
        if (lobbyName.trim()) {
            console.log(`Creating lobby with name: ${lobbyName}`);
            // Логика создания лобби
        } else {
            alert('Please enter a lobby name');
        }
    };

    return (
        <div className={'background'}>
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Create a New Lobby
                </Typography>
                <Box component="form" noValidate autoComplete="off">
                    <TextField
                        fullWidth
                        label="Lobby Name"
                        variant="outlined"
                        value={lobbyName}
                        onChange={(e) => setLobbyName(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateLobby}
                        fullWidth
                    >
                        Create Lobby
                    </Button>
                </Box>
            </Paper>
        </Container>
        </div>
    );
};

export default LobbyPage;
