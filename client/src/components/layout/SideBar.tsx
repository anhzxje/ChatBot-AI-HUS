import React from "react";
import Drawer from "@mui/material/Drawer";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Tooltip from "@mui/material/Tooltip";
import Brightness4Icon from "@mui/icons-material/Brightness4"; // Mặt trăng
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Mặt trời

import { useColorMode } from "../../ThemeContext"; 
import { useToggleSideBar } from "../../store/ui";

export const SIDE_BAR_WIDTH = 240;

export const ToggleSideBarButton = () => {
  const { toggleSideBar, sideBarOpen } = useToggleSideBar();
  return (
    <Tooltip
      title={sideBarOpen ? "Thu gọn danh sách" : "Mở rộng danh sách"}
      placement="bottom-start"
      arrow
    >
      <IconButton onClick={toggleSideBar}>
        <MenuOpenIcon
          fontSize="medium"
          sx={{ transform: sideBarOpen ? "none" : "scaleX(-1)" }}
        />
      </IconButton>
    </Tooltip>
  );
};

function SideBar({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const { sideBarOpen } = useToggleSideBar();
  const { toggleColorMode } = useColorMode();

  return (
    <Drawer
      sx={{
        "& .MuiDrawer-paper": {
          width: SIDE_BAR_WIDTH,
          // Dòng quan trọng: Sử dụng màu Secondary từ theme vừa cài đặt
          backgroundColor: theme.palette.secondary.main, 
          color: theme.palette.text.primary,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid rgba(0,0,0,0.1)", // Viền mỏng
        },
      }}
      variant="persistent"
      anchor="left"
      open={sideBarOpen}
    >
      {/* Phần danh sách chat: Chiếm toàn bộ khoảng trống còn lại */}
      <div style={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
        {children}
      </div>

      {/* 3. Phần nút Dark Mode: Nằm cố định ở đáy */}
      <div 
        style={{ 
          padding: "12px", 
          textAlign: "center", 
          borderTop: theme.palette.mode === 'dark' ? "1px solid #333" : "1px solid #e0e0e0" 
        }}
      >
        <Tooltip title={theme.palette.mode === 'dark' ? "Chế độ Sáng" : "Chế độ Tối"}>
          <IconButton onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? (
              <Brightness7Icon /> 
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Tooltip>
      </div>

    </Drawer>
  );
}

export default SideBar;