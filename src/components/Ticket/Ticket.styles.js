const ticketStyles = {
  baseRoot: {
    width: '100%',
    minWidth: '250px',
    minHeight: '160px',
    backgroundColor: (theme) => theme.palette.background.neutral,
    border: '0.5px solid',
    borderColor: (theme) => theme.palette.common.treeCards.border,
    borderRadius: '10px',
    color: (theme) => theme.palette.common.treeCards.text.main
  },
  baseContent: {
    height: 80,
    px: '6px',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  baseHeader: {
    height: '40px',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '0.5px solid',
    borderColor: (theme) => theme.palette.common.treeCards.border,
    px: 1.5
  },
  baseFooter: {
    height: '40px',
    minHeight: '40px',
    borderColor: (theme) => theme.palette.grey[200],
    px: 1.2
  },
  footerItem: {
    svg: {
      width: 16,
      height: 16,
      mr: '4px'
    }
  },
  bug: {
    root: {}
  },
  common: {
    root: {}
  },
  popoverMenu: {
    p: 0.5,
    width: 200,
    '& .MuiMenuItem-root': {
      px: 1,
      typography: 'body2',
      borderRadius: 0.75
    },
    '& .MuiSvgIcon-root': {
      width: 20,
      height: 20,
      mr: 1
    }
  }
};

export default ticketStyles;
