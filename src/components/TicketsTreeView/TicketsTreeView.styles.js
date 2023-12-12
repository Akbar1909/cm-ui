const mainColor = (theme) => theme.palette.primary.main;

const ticketsTreeViewStyles = {
  tree: {
    position: 'relative',
    '& ul': {
      position: 'relative',
      py: '50px',
      transition: 'all 0.5s',
      '-webkit-transition': 'all 0.5s',
      '-moz-transition': 'all 0.5s',
      '& li': {
        float: 'left',
        textAlign: 'center',
        listStyleType: 'none',
        position: 'relative',
        py: '40px',
        pr: '20px',
        transition: 'all 0.5s',
        '-webkit-transition': 'all 0.5s',
        '-moz-transition': 'all 0.5s',
        '&::before': {
          content: "''",
          position: 'absolute',
          top: 0,
          right: '50%',
          borderTop: '1px solid',
          borderColor: mainColor,
          width: '50%',
          height: '50px'
        },
        '&::after': {
          content: "''",
          position: 'absolute',
          top: 0,
          borderLeft: '1px solid',
          borderTop: '1px solid',
          borderColor: mainColor,
          width: '50%',
          height: '40px',
          right: 'auto',
          left: '50%'
        },
        '&:only-child::after': {
          display: 'none'
        },
        '&:only-child::before': {
          display: 'none'
        },
        '&:only-child': {
          pt: 0
        },
        '&:first-child::before': {
          border: '0 none'
        },
        '&:last-child::after': {
          border: '0 none'
        },
        '&:last-child::before': {
          borderRight: '1px solid',
          borderColor: mainColor,
          borderRadius: '0 5px 0 0 '
        },
        '&:first-child::after': {
          borderRadius: '5px 0 0 0'
        }
      },
      '& ul::before': {
        content: "''",
        position: 'absolute',
        top: 0,
        left: '50%',
        borderLeft: '1px solid',
        borderColor: mainColor,
        width: 0,
        height: '50px'
      }
    }
  },
  head: {
    m: 'auto',
    minWidth: 194,
    minHeight: 134,
    width: 194,
    height: 134,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: (theme) => theme.palette.background.neutral,
    borderRadius: '6px',
    '&>div.logo': {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: (theme) => theme.palette.grey[700]
    }
  },
  node: {},
  cardSx: {
    mb: '20px',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      height: '30px',
      left: '50%',
      top: '100%',
      border: '0.7px solid',
      borderColor: mainColor
    },
    '&:last-child::after': {
      display: 'none'
    }
  },
  listItem: {
    width: '25%',
    minWidth: '250px'
  }
};

export default ticketsTreeViewStyles;
