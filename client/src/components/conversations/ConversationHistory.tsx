import { Fragment, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useGetCurrentConversation } from "../../store/conversations";
import BenderIcon from "./BenderIcon";
import { type IMessage } from "@data";
import CodeBlock from './CodeBlock'; // Đã import

const preprocessContent = (content: string) => {
  if (!content) return "";
  return content
    .replace(/\\\[/g, "$$")
    .replace(/\\\]/g, "$$")
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$")
    .replace(/\[ /g, "$$ ")
    .replace(/ \]/g, " $$");
};

function ConversationHistory() {
  const theme = useTheme();
  const { currentConversation } = useGetCurrentConversation();
  const containerRef = useRef<HTMLDivElement>(null); // Đổi ref sang container
  const prevMessagesLengthRef = useRef(0);

  // Scroll đến cuối container thay vì dùng scrollIntoView
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const currentLength = currentConversation?.messages?.length || 0;
    
    // Chỉ scroll khi có tin nhắn mới
    if (currentLength > prevMessagesLengthRef.current) {
      // Delay để đợi DOM render xong
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      
      prevMessagesLengthRef.current = currentLength;
      return () => clearTimeout(timer);
    }
  }, [currentConversation?.messages?.length]);

  // Màn hình chào mừng
  if (!currentConversation?.messages?.length) {
    return (
      <Box 
        sx={{ 
          width: "100%",
          height: "100%",
          display: "flex",        
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center",    
        }}
      >
        <Typography variant="h3" textAlign="center" sx={{ fontSize: "20px", opacity: 0.8 }}>
          Chào mừng bạn đến với HUS, tôi có thể giúp gì cho bạn?
        </Typography>
      </Box>
    );
  }

  // 💥 TẠO CUSTOM COMPONENTS CHO REACTMARKDOWN 💥
  const markdownComponents = {
    // Chỉ định component custom cho thẻ 'code'
    code({ node, inline, className, children, ...props }: any) {
      // Nếu là code inline (`ví dụ`), render bình thường
      if (inline) {
        return (
          <code className={className} {...props}>
            {String(children).replace(/\n$/, '')}
          </code>
        );
      }

      // Nếu là code block (```language), sử dụng CodeBlock component
      // CodeBlock phải được thiết kế để nhận `className` và `children`
      return (
        <CodeBlock 
          className={className} 
          {...props}
        >
          {children}
        </CodeBlock>
      );
    },
    // 💡 Đề xuất: Nếu bạn muốn tùy chỉnh các thành phần khác (ví dụ: tables, p, h1, etc.), 
    // bạn có thể thêm chúng vào đây.
  };

  return (
    <Box
      ref={containerRef} // THÊM REF VÀO CONTAINER
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        paddingTop: "15px",
        paddingBottom: "10px",
      }}
    >
      {currentConversation?.messages?.map(
        ({ _id, role, content, images }: IMessage & { images?: string[] }) => {
          const isDarkMode = theme.palette.mode === 'dark';
          return (
            <Box 
                key={_id || `msg-${Date.now()}-${Math.random()}`}
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    padding: "0 20px",
                }}
            >
              <Box sx={{ 
                  width: "100%", 
                  maxWidth: "800px", 
                  display: "flex",
                  flexDirection: "column",
                  alignItems: role === "user" ? "flex-end" : "flex-start"
              }}>
                  {role === "user" ? (
                    <Box
                      sx={{
                        background: isDarkMode ? "#444654" : "#f0f0f0",
                        color: isDarkMode ? "#ffffff" : "#000000",
                        "& *": { color: isDarkMode ? "#ffffff !important" : "#000000 !important" },
                        display: "inline-block",
                        padding: "10px 20px",
                        marginBottom: "20px",
                        borderRadius: "12px",
                        maxWidth: "100%", 
                        overflowWrap: "break-word",
                      }}
                    >
                      {images && images.length > 0 && (
                          <img 
                            src={images[0]} 
                            alt="User upload" 
                            style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "10px" }}
                            onLoad={scrollToBottom} // Scroll lại khi ảnh load xong
                          />
                      )}
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {preprocessContent(content)}
                      </ReactMarkdown>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", gap: "15px", marginBottom: "20px", width: "100%" }}>
                      <Box sx={{ 
                          color: isDarkMode ? "#ffffff" : "#000000",
                          "& svg": { fill: isDarkMode ? "#ffffff" : "#000000" }, 
                          "& img": { filter: isDarkMode ? "none" : "invert(1)" },
                          marginTop: "5px"
                      }}>
                         <BenderIcon />
                      </Box>

                      <Box sx={{ flexGrow: 1, overflow: "hidden", "& p": { marginTop: 0 } }}>
                        <ReactMarkdown 
                          remarkPlugins={[remarkMath]} 
                          rehypePlugins={[rehypeKatex]}
                          // 💥 Đã thêm components để tùy chỉnh Code Block
                          components={markdownComponents} 
                        >
                            {preprocessContent(content)}
                        </ReactMarkdown>
                      </Box>
                    </Box>
                  )}
              </Box>
            </Box>
          );
        }
      )}
      {/* Không cần div ref nữa */}
    </Box>
  );
}

export default ConversationHistory;