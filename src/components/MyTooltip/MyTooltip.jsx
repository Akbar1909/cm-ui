import Tooltip from '@mui/material/Tooltip';

const MyTooltip = ({ title, placement = 'top', children, sx }) => {
  return (
    <Tooltip sx={[...(Array.isArray(sx) ? sx : [sx])]} title={title} placement={placement}>
      {children}
    </Tooltip>
  );
};

export default MyTooltip;
