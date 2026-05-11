import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { confirmVoiceTransaction, parseVoiceCommand } from '../api/voiceApi';
import { queryKeys } from '../api/queryKeys';
import { AppErrorAlert } from '../components/AppErrorAlert';
import { PageHeader } from '../components/PageHeader';
import type { ParsedTxnDto } from '../dtos/voice.dto';
import { ParsedTxnConfirmationDialog } from '../features/voice/ParsedTxnConfirmationDialog';
import { useSpeechToText } from '../features/voice/useSpeechToText';
import { VoiceCommandPanel } from '../features/voice/VoiceCommandPanel';
import { useApiAction } from '../hooks/useApiAction';
import type { AppOutletContext } from '../types/app';

export function VoiceTransactionPage() {
  const { userId } = useOutletContext<AppOutletContext>();
  const queryClient = useQueryClient();
  const [parsed, setParsed] = useState<ParsedTxnDto | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [parseAfterListening, setParseAfterListening] = useState(false);
  const { loading, error, run } = useApiAction();
  const speech = useSpeechToText();

  async function handleParse(command = speech.transcript) {
    if (!command.trim()) {
      return;
    }

    await run(async () => {
      const data = await parseVoiceCommand(userId, command);
      setParsed(data);
    });
  }

  useEffect(() => {
    if (!speech.listening && parseAfterListening && speech.transcript.trim()) {
      setParseAfterListening(false);
      void handleParse(speech.transcript);
    }
  }, [parseAfterListening, speech.listening, speech.transcript]);

  function handleStartListening() {
    setParsed(null);
    setToastMessage('');
    setParseAfterListening(true);
    speech.start();
  }

  async function handleConfirm(confirmed: boolean, editedTxn = parsed) {
    if (!editedTxn) {
      return;
    }

    await run(async () => {
      const result = await confirmVoiceTransaction({
        confirmationId: editedTxn.confirmationId,
        confirmed,
        type: editedTxn.type,
        amount: editedTxn.amount,
        category: editedTxn.category,
        note: editedTxn.note,
        time: editedTxn.time,
        userId: editedTxn.userId,
      });
      setToastMessage(confirmed && result ? `Transaction #${result.id} saved.` : 'Transaction cancelled.');
      if (confirmed && result) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
        await queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
      }
      setParsed(null);
      speech.reset();
    });
  }

  return (
    <>
      <PageHeader title="Voice Transaction" />
      <Stack spacing={3}>
        <AppErrorAlert error={error} />
        {speech.speechError && (
          <Alert severity="warning">Speech recognition error: {speech.speechError}</Alert>
        )}
        <VoiceCommandPanel
          transcript={speech.transcript}
          listening={speech.listening}
          supported={speech.supported}
          loading={loading}
          onTranscriptChange={speech.setTranscript}
          onStartListening={handleStartListening}
          onStopListening={speech.stop}
          onParse={() => handleParse()}
        />
      </Stack>
      <ParsedTxnConfirmationDialog
        parsedTxn={parsed}
        loading={loading}
        onConfirm={(editedTxn) => handleConfirm(true, editedTxn)}
        onCancel={() => handleConfirm(false)}
        onClose={() => setParsed(null)}
      />
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3500}
        onClose={() => setToastMessage('')}
        message={toastMessage}
      />
    </>
  );
}
