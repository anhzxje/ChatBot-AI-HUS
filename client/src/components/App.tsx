import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import TopNav from "./layout/TopNav";
import SideBar, { ToggleSideBarButton } from "./layout/SideBar";
import Main from "./layout/Main";
import AuthDialog from "./auth/AuthDialog";
import ConversationToolbar from "./conversations/ConversationToolbar";
import ConversationPicker from "./conversations/ConversationPicker";
import Conversation from "./conversations/Conversation";
import CurrentUserAvatar from "./auth/CurrentUserAvatar";

// === SỬA DÒNG DƯỚI ĐÂY ===
import KaTeXStyle from "./KaTeXStyle"; // Dùng ".." thay vì "."
// ==========================

function App() {
  return (
    <Box>
      {/* Đặt KaTeXStyle ở đây để nó nạp CSS */}
      <KaTeXStyle /> 
      
      <AuthDialog />
      <TopNav>
        <ToggleSideBarButton />
        <CurrentUserAvatar />
      </TopNav>

      <SideBar>
        <ConversationToolbar />
        <Divider />
        <ConversationPicker />
      </SideBar>

      <Main>
        <Conversation />
      </Main>
    </Box>
  );
}

export default App;