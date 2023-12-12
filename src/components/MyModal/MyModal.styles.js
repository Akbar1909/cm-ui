const myModalStyles = {
  body: {
    border: 'none',
    borderRadius: '0.5rem',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: (theme) => theme.palette.background.paper,
    boxShadow: 24,
    p: '16px'
  },
  confirmation: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '400px',
    height: '250px'
  },
  confirmationContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default myModalStyles;
