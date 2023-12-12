const styles = {
  fileWidget: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    '& .MuiBox-root': {
      p: '8px'
    }
  },
  actionBox: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)'
  },
  iconButton: {
    borderRadius: '50%',
    width: '30px',
    height: '30px'
  }
};

export default styles;
