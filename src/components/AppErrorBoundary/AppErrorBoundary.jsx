import { ErrorBoundary as Boundary } from 'react-error-boundary';
import { Typography } from '@mui/material';

const ErrorBoundary = ({ children }) => {
  return (
    <Boundary
      FallbackComponent={() => <Typography children="Something went wrong" />}
      onError={(error, errorInfo) => {
        // log the error
        console.log('Error caught!');
        console.error(error);
        console.error(errorInfo);

        // record the error in an APM tool...
      }}
      onReset={() => {
        // reloading the page to restore the initial state
        // of the current page
        console.log('reloading the page...');
        window.location.reload();

        // other reset logic...
      }}>
      {children}
    </Boundary>
  );
};

export default ErrorBoundary;
