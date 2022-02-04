import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

export default function SimpleListMenu(props: {
  defaultIndex: number;
  options: any;
  callback: (
    event: React.MouseEvent<HTMLElement>,
    index: number,
    option: any,
  ) => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(props.defaultIndex);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
    option: any,
  ) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    props.callback(event, index, option);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <List
        component="nav"
        aria-label="Distributions"
        sx={{ bgcolor: "background.paper" }}
      >
        <ListItem
          button
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="Model"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickListItem}
        >
          <ListItemText primary={props.options[selectedIndex]} />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "lock-button",
          role: "listbox",
          style: { width: "100%" },
        }}
      >
        {props.options.map((option: any, index: number) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index, option)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
