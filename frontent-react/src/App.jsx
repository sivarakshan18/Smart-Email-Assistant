import React, { useState } from "react";
import axios from 'axios'
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";

const App = () => {
  const [emailContent, SetEmailContent] = useState("");
  const [tone, SetTone] = useState("");
  const [generatedReply, SetGeneratedReply] = useState("");
  const [loading, SetLoading] = useState(false);
  const [error, SetError] = useState("");

  const handleSubmit = async () => {
    SetLoading(true)
    SetError('')
    try{
      const response =await axios.post("http://localhost:8080/api/email/generate",{
        emailContent,
        tone
      });
      SetGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data))
    }
    catch(error){
      SetError('Failed to generate email reply . please try again')
      console.log(error);
    }
    finally{
      SetLoading(false)
    }
  };
  return (
    <>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Email Reply Generator
        </Typography>
        <Box sx={{ mx: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Orignal Email Content"
            value={emailContent || ""}
            onChange={(e) => SetEmailContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tone (Optional)</InputLabel>
            <Select
              value={tone || ""}
              label={"Tone (Optional)"}
              onChange={(e) => SetTone(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="friendly">Friendly</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : "Generate Reply"}
          </Button>
        </Box>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {generatedReply && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Generated Reply :
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              value={generatedReply || ""}
              inputProps={{ readOnly: true }}
            />
            <Button
            variant="outlined"
            sx={{mt:2}}
            onClick={()=> navigator.clipboard.writeText(generatedReply)}
            >
              Copy to Clipboard
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
};

export default App;
