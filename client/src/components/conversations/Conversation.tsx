import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { TOP_NAV_HEIGHT } from "../layout/TopNav";
import ConversationInput from "./ConversationInput";
import ConversationHistory from "./ConversationHistory";

function Conversation() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        height: `calc(100vh - ${TOP_NAV_HEIGHT}px)`, // Chiều cao cố định
        
        // === CẤU HÌNH GRID (QUAN TRỌNG) ===
        display: "grid", 
        gridTemplateRows: "1fr auto", // 1fr: Lịch sử chat (giãn tối đa), auto: Input (giữ nguyên)
        // ==================================
        
        overflow: "hidden", // Cắt bỏ phần thừa
        position: "relative",
      }}
    >
      {/* 1. PHẦN LỊCH SỬ CHAT (Hàng 1 - 1fr) */}
      {/* Nó sẽ tự động chiếm toàn bộ không gian còn lại */}
      <Box sx={{ overflow: "hidden", width: "100%", height: "100%" }}>
         <ConversationHistory />
      </Box>
      
      {/* 2. PHẦN NHẬP LIỆU (Hàng 2 - auto) */}
      {/* Nó sẽ luôn nằm ở đáy */}
      <Box 
        sx={{ 
          width: "100%",
          paddingBottom: "20px",
          backgroundColor: theme.palette.background.default, 
          borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
          zIndex: 10,
        }}
      >
        <ConversationInput />
      </Box>
    </Box>
  );
}

export default Conversation;