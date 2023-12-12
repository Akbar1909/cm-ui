const ICON_SQUARE_SIZE = 56;

const myAnimatedCardNumberStyles = {
  root: {
    backgroundColor: (theme) => theme.palette.common.white,
    py: '28px',
    boxShadow: (theme) => theme.shadows[7]
  },
  value: {
    fontSize: '2rem'
  },
  iconBox: {
    minWidth: ICON_SQUARE_SIZE,
    minHeight: ICON_SQUARE_SIZE,
    maxWidth: ICON_SQUARE_SIZE,
    maxHeight: ICON_SQUARE_SIZE,
    width: ICON_SQUARE_SIZE,
    height: ICON_SQUARE_SIZE,
    backgroundColor: (theme) => theme.palette.primary.main,
    borderRadius: '12px',
    '& svg': {
      color: (theme) => theme.palette.common.white,
      width: 40,
      height: 40
    }
  }
};

export default myAnimatedCardNumberStyles;
