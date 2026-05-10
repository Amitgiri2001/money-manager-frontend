import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

type VoiceCommandPanelProps = {
  transcript: string;
  listening: boolean;
  supported: boolean;
  loading: boolean;
  onTranscriptChange: (value: string) => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onParse: () => void;
};

export function VoiceCommandPanel({
  transcript,
  listening,
  supported,
  loading,
  onTranscriptChange,
  onStartListening,
  onStopListening,
  onParse,
}: VoiceCommandPanelProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2.5}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
            <Button
              startIcon={<MicIcon />}
              variant="contained"
              disabled={!supported || listening || loading}
              onClick={onStartListening}
            >
              Start
            </Button>
            <Button
              startIcon={<StopIcon />}
              variant="outlined"
              disabled={!listening}
              onClick={onStopListening}
            >
              Stop
            </Button>
            <Button
              startIcon={<GraphicEqIcon />}
              variant="text"
              disabled={loading || listening || !transcript.trim()}
              onClick={onParse}
            >
              Parse
            </Button>
            <Typography color={listening ? 'primary.main' : 'text.secondary'} variant="body2">
              {supported
                ? listening
                  ? 'Listening...'
                  : 'Ready for voice input'
                : 'Speech recognition is not supported in this browser'}
            </Typography>
          </Stack>
          <TextField
            label="Transcript preview"
            multiline
            minRows={4}
            value={transcript}
            onChange={(event) => onTranscriptChange(event.target.value)}
            placeholder="expense amount 250 category food note dinner yesterday"
            fullWidth
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
