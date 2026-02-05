import { Tooltip, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { FC } from "react";

interface InfoIconProps {
  tooltip: string;
}

export const InfoIconComponent: FC<InfoIconProps> = ({ tooltip }) => {
  return (
    <Tooltip
      title={tooltip}
      placement="top"
      slotProps={{
        tooltip: {
          sx: { fontSize: "0.8rem", backgroundColor: "primary.dark", borderWidth: 2 },
        },
      }}
    >
      <IconButton
        sx={{
          color: "text.secondary",
          "&:hover": {
            color: "primary.main",
          },
          padding: 0.5,
        }}
      >
        <InfoIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};
