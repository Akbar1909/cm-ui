import { Box, CardMedia } from '@mui/material';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';

const styles = {
  root: {}
};

const ImageView = ({ photoUrl, size = 30, alt = '' }) => {
  return (
    <Box sx={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}>
      {photoUrl ? (
        <CardMedia src={photoUrl} component="img" />
      ) : (
        <NoPhotographyIcon sx={{ width: size - 5, height: size - 5 }} />
      )}
    </Box>
  );
};

export default ImageView;
