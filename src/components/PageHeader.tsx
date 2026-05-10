import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  action?: ReactNode;
};

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'stretch', sm: 'center' }}
      spacing={2}
      sx={{ mb: 3 }}
    >
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      {action}
    </Stack>
  );
}
