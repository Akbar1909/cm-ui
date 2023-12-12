import Checkbox from '@mui/material/Checkbox';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';

export default function MyCheckbox({ sx, label, ...props }) {
  return (
    <Stack direction="row" alignItems="center">
      <Checkbox sx={[{ p: '0px', mr: '6px' }, ...(Array.isArray(sx) ? sx : [sx])]} {...props} />
      {label && (
        <FormLabel
          sx={{
            color: (theme) => theme.palette.grey[800],
            fontSize: '0.875rem'
          }}
          children={label}
        />
      )}
    </Stack>
  );
}
