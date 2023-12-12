const tableFilterStyles = {
  root: {
    backgroundColor: 'background.default',
    position: 'absolute',
    inset: '0px auto auto 0px',
    margin: '0px',
    zIndex: 10000,
    width: '200px',
    borderRadius: '10px'
  },
  content: {
    p: '8px 8px 0px 8px'
  },
  badge: {
    px: '6px',
    py: '4px',
    minHeight: '20px',
    minWidth: '20px',
    width: '30px',
    borderRadius: '10%',
    backgroundColor: (theme) => theme.palette.primary.main,
    color: (theme) => theme.palette.common.white
  },
  footer: {
    px: '8px',
    py: '4px',
    borderTop: '1px solid',
    borderColor: (theme) => theme.palette.grey[200],
    borderBottomRadius: '10px'
  },
  header: {
    borderBottom: '1px solid',
    borderColor: (theme) => theme.palette.grey[200],
    p: '8px'
  }
};

const tableHeaderStyles = {
  tableHeadIconBox: {
    p: 0,
    '& svg': {
      width: '14px',
      height: '14px'
    }
  }
};

const tableStyles = {
  sticky: {
    position: 'sticky',
    right: 0,
    zIndex: 1000
  },
  theadCell: {
    backgroundColor: 'background.default',
    border: 'none',
    '&:hover': {
      backgroundColor: (theme) => theme.palette.grey[100]
    }
  },
  tbody: {
    '&>tr': {
      '&>td': {
        border: 'none',
        '& [data-icon=ellipsis-vertical]': {
          height: '18px',
          color: 'common.icon.main'
        }
      },
      '&:nth-of-type(odd)': {
        backgroundColor: (theme) => theme.palette.grey[1000]
      },
      '&:nth-of-type(even)': {
        '&>td': {
          backgroundColor: (theme) => theme.palette.background.default
        }
      },
      '&:hover td': {
        backgroundColor: (theme) => theme.palette.grey[100]
      }
    }
  }
};

export { tableFilterStyles, tableHeaderStyles, tableStyles };
