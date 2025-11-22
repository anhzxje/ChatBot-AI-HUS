import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box"; // <--- ĐÃ BỔ SUNG DÒNG NÀY
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  useDeleteConversation,
  useGetConversationList,
  useSetCurrentConversationId,
  useUpdateConversationTitle,
} from "../../store/conversations";

function ConversationPicker() {
  const { isLoading, conversationList } = useGetConversationList();

  if (isLoading) {
    return (
      <List disablePadding>
        {[1, 2, 3].map((i) => (
           <div key={i} style={{ height: "48px", padding: "8px 16px" }}>
             <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 1 }} />
           </div>
        ))}
      </List>
    );
  }

  if (!conversationList.length) {
    return (
      <Box sx={{ p: 2, textAlign: "center", opacity: 0.7 }}>
        <Typography variant="h6" gutterBottom>
          Chưa có hội thoại
        </Typography>
        <Typography variant="body2">
          Bấm dấu + để bắt đầu trò chuyện mới với HUS.
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {conversationList?.map(
        ({ _id, title }: { title: string; _id: string }) => (
          <ConversationPickerItem key={_id} _id={_id} title={title} />
        )
      )}
    </List>
  );
}

function ConversationPickerItem({
  title,
  _id,
}: {
  title: string;
  _id: string;
}) {
  const [editMode, setEditMode] = useState<boolean>(false);
  return (
    <ListItem disablePadding>
      {editMode ? (
        <ItemEditMode
          _id={_id}
          title={title}
          editMode={editMode}
          setEditMode={setEditMode}
        />
      ) : (
        <ItemSelectMode _id={_id} title={title} setEditMode={setEditMode} />
      )}
    </ListItem>
  );
}

function ItemEditMode({
  _id,
  title,
  editMode,
  setEditMode,
}: {
  title: string;
  _id: string;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useTheme();
  const [newTitle, setNewTitle] = useState<string>(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateConversationTitle } = useUpdateConversationTitle({
    conversationId: _id,
  });

  useEffect(() => {
    if (editMode) inputRef?.current?.select();
  }, [editMode]);

  const handleInputChange = (e: React.FocusEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setEditMode(false);
    if (e.target.value && e.target.value !== title) {
      updateConversationTitle(e.target.value.trim());
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
       inputRef.current?.blur();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={newTitle}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      onKeyDown={handleKeyDown}
      style={{
        all: "unset",
        width: "100%",
        boxSizing: "border-box",
        margin: "12px 16px",
        padding: "5px",
        color: theme.palette.text.primary, 
        borderBottom: `2px solid ${theme.palette.primary.main}`,
        background: "transparent"
      }}
    />
  );
}

function ItemSelectMode({
  _id,
  title,
  setEditMode,
}: {
  _id: string;
  title: string;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useTheme();
  const { currentConversationId, setCurrentConversationId } =
    useSetCurrentConversationId();
  const [displayMoreMenu, setDisplayMoreMenu] = useState(false);

  const isSelected = _id === currentConversationId;

  return (
    <Tooltip title={title} placement="right" arrow>
      <ListItemButton
        onClick={() => {
          setCurrentConversationId(_id);
        }}
        onMouseEnter={() => setDisplayMoreMenu(true)}
        onMouseLeave={() => setDisplayMoreMenu(false)}
        selected={isSelected}
        sx={{
            borderRadius: "6px",
            margin: "2px 8px",
            "&.Mui-selected": {
                backgroundColor: theme.palette.mode === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
            }
        }}
      >
        <ListItemText
          primary={title}
          sx={{
            "& .MuiListItemText-primary": {
              fontWeight: isSelected ? 600 : 400,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maskImage: `linear-gradient(to right, black 85%, transparent 100%)`,
              WebkitMaskImage: `linear-gradient(to right, black 85%, transparent 100%)`,
            },
          }}
        />
        {displayMoreMenu && (
          <MoreMenu
            _id={_id}
            setDisplayMoreMenu={setDisplayMoreMenu}
            setEditMode={setEditMode}
            isSelected={isSelected}
          />
        )}
      </ListItemButton>
    </Tooltip>
  );
}

function MoreMenu({
  setDisplayMoreMenu,
  setEditMode,
  _id,
  isSelected,
}: {
  _id: string;
  isSelected: boolean;
  setDisplayMoreMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { deleteConversation } = useDeleteConversation({ conversationId: _id });
  const open = Boolean(anchorEl);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setDisplayMoreMenu(false);
  };
  const handleEditMode = () => {
    handleClose();
    setEditMode(true);
  };
  const handleDelete = () => {
    handleClose();
    deleteConversation();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          position: "absolute",
          right: "8px",
          color: theme.palette.text.secondary,
          opacity: 0.8,
          "&:hover": {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <MoreHorizIcon fontSize="small" />
      </IconButton>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleEditMode}>
          <EditIcon fontSize="small" sx={{ marginRight: "10px" }} />
          <Typography variant="body2">Đổi tên</Typography>
        </MenuItem>
        
        <MenuItem onClick={handleDelete} sx={{ color: theme.palette.error.main }}>
          <DeleteIcon fontSize="small" sx={{ marginRight: "10px" }} />
          <Typography variant="body2">Xóa cuộc trò chuyện</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}

export default ConversationPicker;