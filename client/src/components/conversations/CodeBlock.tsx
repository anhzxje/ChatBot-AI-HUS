import React, { useState } from 'react';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

// Component CodeBlock mới
const CodeBlock = ({ children, className, node, ...props }: any) => {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  
  // Trích xuất nội dung mã nguồn
  const code = String(children).replace(/\n$/, '');
  
  // Trích xuất ngôn ngữ (ví dụ: `language-javascript`)
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1].toUpperCase() : 'TEXT';

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Đặt lại sau 2 giây
    });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
        borderRadius: '8px',
        margin: '15px 0',
        padding: '0', // Loại bỏ padding vì sẽ thêm padding vào `pre`
        overflow: 'hidden',
        border: `1px solid ${theme.palette.mode === 'dark' ? '#444' : '#ddd'}`,
      }}
    >
      {/* Thanh Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '5px 10px',
          backgroundColor: theme.palette.mode === 'dark' ? '#3e3e3e' : '#e0e0e0',
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#444' : '#ddd'}`,
        }}
      >
        <Typography 
            variant="caption" 
            sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}
        >
          {lang}
        </Typography>
        <IconButton 
          size="small" 
          onClick={handleCopy} 
          title="Copy code"
        >
          {copied ? 
            <CheckIcon fontSize="small" color="success" /> : 
            <ContentCopyIcon 
                fontSize="small" 
                sx={{ color: theme.palette.text.secondary }}
            />
          }
        </IconButton>
      </Box>

      {/* Vùng Mã Nguồn */}
      <pre 
        style={{ 
          padding: '10px 15px', 
          margin: 0, 
          overflowX: 'auto', 
          fontSize: '0.9em' 
        }}
      >
        <code className={className} {...props}>
          {code}
        </code>
      </pre>
    </Box>
  );
};

export default CodeBlock;