import React, { createContext, useState, useMemo, useContext } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const useColorMode = () => useContext(ColorModeContext);

export default function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("themeMode") as "light" | "dark") || "light";
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("themeMode", newMode);
          return newMode;
        });
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                // === CẤU HÌNH GIAO DIỆN SÁNG (LIGHT) ===
                primary: {
                  main: "#10a37f", // Màu xanh lá thương hiệu OpenAI (hoặc để đen #000)
                  contrastText: "#fff",
                },
                secondary: {
                  main: "#f7f7f8", // Màu Sidebar xám siêu nhạt
                  contrastText: "#000",
                },
                background: {
                  default: "#ffffff", // Nền chính trắng tinh
                  paper: "#f7f7f8",   // Nền Sidebar
                },
                text: {
                  primary: "#343541", // Màu chữ xám đen dịu mắt
                  secondary: "#6e6e80",
                },
              }
            : {
                // === CẤU HÌNH GIAO DIỆN TỐI (DARK) ===
                primary: {
                  main: "#10a37f", 
                  contrastText: "#fff",
                },
                secondary: {
                  main: "#202123", // Sidebar đen xám
                  contrastText: "#fff",
                },
                background: {
                  default: "#343541", // Nền chính xám tối
                  paper: "#202123",   // Nền Sidebar
                },
                text: {
                  primary: "#ececf1",
                  secondary: "#c5c5d2",
                },
              }),
        },
        typography: {
          fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
        },
        components: {
            // 1. Cấu hình thanh cuộn (Scrollbar) đẹp hơn
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarColor: mode === "dark" ? "#6b6b6b #2b2b2b" : "#959595 #f5f5f5",
                "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                  backgroundColor: mode === "dark" ? "#2b2b2b" : "#f5f5f5", // Màu nền rãnh trượt
                  width: "8px", // Độ rộng thanh trượt (mảnh hơn)
                },
                "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                  borderRadius: 8,
                  backgroundColor: mode === "dark" ? "#6b6b6b" : "#959595", // Màu tay nắm trượt
                  minHeight: 24,
                  border: mode === "dark" ? "2px solid #2b2b2b" : "2px solid #f5f5f5", // Viền tạo cảm giác nổi
                },
                "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
                  backgroundColor: mode === "dark" ? "#959595" : "#6b6b6b",
                },
              },
            },
          },
          // 1. Sửa màu nền ô nhập liệu (Input)
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#40414f' : '#ffffff',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'dark' ? '#10a37f' : '#10a37f', // Viền khi focus
                }
              }
            }
          },
          // 2. QUAN TRỌNG: Sửa màu thanh Header (AppBar)
          MuiAppBar: {
            styleOverrides: {
              root: {
                // Light Mode: Màu trắng | Dark Mode: Màu tối
                backgroundColor: mode === 'light' ? '#ffffff' : '#343541',
                color: mode === 'light' ? '#202123' : '#ffffff', // Màu icon/chữ trên header
                boxShadow: mode === 'light' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', // Bóng mờ nhẹ cho đẹp
                borderBottom: mode === 'light' ? '1px solid #e5e5e5' : '1px solid #565869',
              }
            }
          },
          // 3. Sửa nút bấm Sidebar (Drawer)
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === 'light' ? '#f7f7f8' : '#202123',
                borderRight: mode === 'light' ? '1px solid #e5e5e5' : '1px solid #4d4d4f',
              }
            }
          }
        }
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}