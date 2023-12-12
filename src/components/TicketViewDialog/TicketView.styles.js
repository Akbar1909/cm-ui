const ticketViewStyles = {
  root: {
    width: '100%',
    pr: '33px'
  },
  content: {
    position: 'relative',
    pl: '53px',
    '&::before': {
      content: "''",
      position: 'absolute',
      top: '20px',
      left: '33px',
      width: '3px',
      height: '90%',
      backgroundColor: '#4B4B4E'
    }
  }
};

export default ticketViewStyles;
