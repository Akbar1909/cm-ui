import { useRef, useState, useCallback, useEffect } from 'react';
import { Stack, Typography, Card, Box } from '@mui/material';
import CountUp from 'react-countup';
import styles from './MyAnimatedNumberCard.styles';

const MyAnimatedCardNumber = ({ label, duration = 1, icon, ...props }) => {
  const end = typeof props.end === 'number' && !Number.isNaN(props.end) ? props.end : 0;

  return (
    <Card
      sx={{
        height: '100%',
        py: '16px',
        pl: '16px',
        pr: '18px',
        boxShadow: 'none'
      }}>
      <Stack direction="row" height="100%" alignItems="center">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={styles.iconBox}
          mr="16px">
          {icon}
        </Box>
        <Stack>
          <Typography
            variant="subtitle2"
            children={label}
            textAlign="left"
            sx={{ color: (theme) => theme.palette.grey[500], mb: '6px' }}
          />
          <CountUp start={0} delay={0} end={end} duration={duration}>
            {({ countUpRef }) => (
              <Typography
                variant="h2"
                component="span"
                sx={styles.value}
                ref={countUpRef}
                lineHeight="36px"
                textAlign="left"
              />
            )}
          </CountUp>
        </Stack>
      </Stack>
    </Card>
  );
};

export default MyAnimatedCardNumber;
