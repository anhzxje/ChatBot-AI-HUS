import { SyntheticEvent, useState, useRef, useEffect, ChangeEvent } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import FormHelperText from "@mui/material/FormHelperText";
import LinearProgress from "@mui/material/LinearProgress";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ClearIcon from "@mui/icons-material/Clear";

import { useUpdateConversation } from "../../store/conversations";

function ConversationInput() {
  const theme = useTheme();
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    currentConversation,
    isLoading,
    error,
    updateConversation,
    clearError,
  } = useUpdateConversation();

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentConversation?._id, currentConversation?.messages?.length]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = (e: SyntheticEvent) => {
    e.preventDefault();
    if (content.trim() || selectedImage) {
      // Logic gửi tin nhắn + ảnh (Cần update store sau này)
      updateConversation(content); 
      
      setContent("");
      setSelectedImage(null);
      clearError();
    }
  };

  return (
    <Box sx={{ 
        width: "100%", 
        display: "flex", 
        justifyContent: "center", // Căn giữa ô nhập liệu
        p: 2 ,
        pb: 4,
    }}>
      <form 
        onSubmit={sendMessage} 
        style={{ width: "100%", maxWidth: "800px" }} // Giới hạn chiều rộng khớp với History
      >
        {isLoading && (
            <LinearProgress color="info" sx={{ width: "100%", marginBottom: "10px", borderRadius: "5px" }} />
        )}

        <FormHelperText error={!!error} sx={{ textAlign: "center" }}>
            {error}
        </FormHelperText>
      
        <FormControl
            sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%", 
            // Xóa margin auto để tránh xung đột với Box cha
            
            background: theme.palette.mode === 'dark' ? "#40414f" : "#ffffff",
            border: `1px solid ${theme.palette.mode === 'dark' ? "#565869" : "#d9d9e3"}`,
            borderRadius: "12px",
            boxShadow: "0 0 15px rgba(0,0,0,0.1)",
            "& textarea:focus-visible": {
                outline: "none",
            },
            }}
        >
            {selectedImage && (
            <Box sx={{ p: 2, borderBottom: "1px solid rgba(128,128,128,0.2)", position: "relative" }}>
                <img src={selectedImage} alt="Preview" style={{ maxHeight: "100px", borderRadius: "8px" }} />
                <IconButton 
                    size="small" 
                    onClick={() => setSelectedImage(null)}
                    sx={{ position: "absolute", top: 5, left: 5, background: "rgba(0,0,0,0.5)", color: "white" }}
                >
                    <ClearIcon fontSize="small"/>
                </IconButton>
            </Box>
            )}

            <TextareaAutosize
            ref={inputRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            aria-label="Hỏi HUS"
            placeholder="Hỏi HUS..."
            maxRows={6}
            style={{
                resize: "none",
                width: "100%",
                padding: "15px",
                borderRadius: "12px 12px 0 0",
                border: 0,
                background: "transparent",
                color: theme.palette.text.primary,
                fontSize: "16px",
                lineHeight: "1.5",
                fontFamily: "inherit"
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
                }
            }}
            />
            
            <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
            }}
            >
            <input 
                type="file" 
                accept="image/*" 
                hidden 
                ref={fileInputRef} 
                onChange={handleFileChange}
            />
            <IconButton 
                color="default" 
                onClick={() => fileInputRef.current?.click()}
                sx={{ color: theme.palette.text.secondary }}
            >
                <AttachFileIcon />
            </IconButton>

            <IconButton 
                type="submit" 
                disabled={!content && !selectedImage}
                sx={{ 
                    color: (content || selectedImage) ? theme.palette.primary.main : theme.palette.action.disabled,
                }}
            >
                <SendIcon />
            </IconButton>
            </Box>
        </FormControl>
      </form>
    </Box>
  );
}

export default ConversationInput;