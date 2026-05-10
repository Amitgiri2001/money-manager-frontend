import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ApiErrorDto } from '../dtos/api';

type AppErrorAlertProps = {
  error: ApiErrorDto | null;
};

export function AppErrorAlert({ error }: AppErrorAlertProps) {
  if (!error) {
    return null;
  }

  const fieldErrors = Object.entries(error.fieldErrors ?? {});

  return (
    <Alert severity="error">
      <AlertTitle>{error.status ? `Request failed (${error.status})` : 'Request failed'}</AlertTitle>
      <Stack spacing={0.5}>
        <Typography variant="body2">{error.message}</Typography>
        {fieldErrors.map(([field, message]) => (
          <Typography key={field} variant="body2">
            {field}: {message}
          </Typography>
        ))}
      </Stack>
    </Alert>
  );
}
