import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { fromDateTimeLocalValue, toDateTimeLocalValue } from "../../utils/date";
import type { TxnResponseDto } from "../../dtos/txn.dto";
import type { TxnClassificationDto, TxnClassificationLevel } from "../../dtos/txnClassification.dto";
import {
  transactionSchema,
  type TransactionFormValues,
} from "./transactionSchema";

type TransactionFormProps = {
  open: boolean;
  loading: boolean;
  transaction?: TxnResponseDto | null;
  typeOptions: TxnClassificationDto[];
  categoryOptions: TxnClassificationDto[];
  onCreateClassification: (values: {
    level: TxnClassificationLevel;
    name: string;
    description: string;
    parentId?: number | null;
  }) => Promise<TxnClassificationDto>;
  onClose: () => void;
  onSubmit: (values: TransactionFormValues) => Promise<void>;
};

export function TransactionForm({
  open,
  loading,
  transaction,
  typeOptions,
  categoryOptions,
  onCreateClassification,
  onClose,
  onSubmit,
}: TransactionFormProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [classificationDialogOpen, setClassificationDialogOpen] =
    useState(false);
  const [newClassificationLevel, setNewClassificationLevel] =
    useState<TxnClassificationLevel>("TYPE");
  const [newClassificationName, setNewClassificationName] = useState("");
  const [newClassificationDescription, setNewClassificationDescription] =
       useState("");
     const [isCreatingClassification, setIsCreatingClassification] =
       useState(false);
     const [snackbarOpen, setSnackbarOpen] = useState(false);
   
     const {
       control,
       handleSubmit,
       reset,
       watch,
       setValue,
       formState: { errors },
     } = useForm<TransactionFormValues>({
       resolver: zodResolver(transactionSchema),
       defaultValues: getDefaultValues(transaction, typeOptions, categoryOptions),
     });
     const effectiveAmountDifferent = watch("effectiveAmountDifferent");
     const selectedTypeId = watch("txnTypeId");
   
     const filteredCategories = categoryOptions.filter(
       (cat) => !cat.parentId || cat.parentId === selectedTypeId
     );

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(transaction, typeOptions, categoryOptions));
    }
  }, [open, reset, transaction, typeOptions, categoryOptions]);

  const handleAddClassification = async () => {
    if (!newClassificationName.trim()) return;

    setIsCreatingClassification(true);
    try {
      const newClassification = await onCreateClassification({
          level: newClassificationLevel,
          name: newClassificationName.trim(),
          description: newClassificationDescription.trim(),
          parentId: newClassificationLevel === "CATEGORY" ? selectedTypeId : null,
        });
  
        // Select the newly created classification
        if (newClassificationLevel === "TYPE") {
          setValue("txnTypeId", newClassification.id);
        } else {
          setValue("txnCategoryId", newClassification.id);
        }
  
        setClassificationDialogOpen(false);
      setNewClassificationName("");
      setNewClassificationDescription("");
    } catch (error) {
      console.error("Failed to create classification:", error);
    } finally {
      setIsCreatingClassification(false);
    }
  };

  const submit = handleSubmit(async (values) => {
    const effectiveAmount = values.effectiveAmountDifferent
      ? values.effectiveAmount
      : values.amount;

    await onSubmit({
      ...values,
      effectiveAmount,
      time: fromDateTimeLocalValue(values.time),
    });
    reset(getDefaultValues(null, typeOptions, categoryOptions));
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
      >
        <DialogTitle>
          {transaction ? "Edit Transaction" : "New Transaction"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Controller
              name="txnTypeId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Type"
                  error={!!errors.txnTypeId}
                  helperText={errors.txnTypeId?.message}
                  {...field}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "ADD_NEW") {
                      setNewClassificationLevel("TYPE");
                      setClassificationDialogOpen(true);
                      return;
                    }
                    const numVal = Number(val);
                    field.onChange(numVal);
                  }}
                >
                  {typeOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem
                    value="ADD_NEW"
                    sx={{ color: "primary.main", fontWeight: "bold" }}
                  >
                    + Add New Type
                  </MenuItem>
                </TextField>
              )}
            />
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Amount"
                  type="number"
                  inputProps={{ min: 0.0, step: 0.01 }}
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="effectiveAmountDifferent"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                  }
                  label="Effective amount is different"
                />
              )}
            />
            {effectiveAmountDifferent && (
              <Controller
                name="effectiveAmount"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Effective Amount"
                    type="number"
                    inputProps={{ min: 0.0, step: 0.01 }}
                    error={!!errors.effectiveAmount}
                    helperText={
                      errors.effectiveAmount?.message ??
                      "Used for balance and analytics calculations"
                    }
                    {...field}
                  />
                )}
              />
            )}
            <Controller
              name="txnCategoryId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Category"
                  error={!!errors.txnCategoryId}
                  helperText={errors.txnCategoryId?.message}
                  {...field}
                  SelectProps={{
                    onOpen: () => {
                      if (!selectedTypeId) {
                        setSnackbarOpen(true);
                      }
                    },
                  }}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "ADD_NEW") {
                      setNewClassificationLevel("CATEGORY");
                      setClassificationDialogOpen(true);
                      return;
                    }
                    const numVal = Number(val);
                    field.onChange(numVal);
                  }}
                >
                  {filteredCategories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem
                    value="ADD_NEW"
                    sx={{ color: "primary.main", fontWeight: "bold" }}
                  >
                    + Add New Category
                  </MenuItem>
                </TextField>
              )}
            />
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Time"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.time}
                  helperText={errors.time?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Note"
                  multiline
                  minRows={2}
                  error={!!errors.note}
                  helperText={errors.note?.message}
                  {...field}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            flexDirection: { xs: "column-reverse", sm: "row" },
            gap: 1,
          }}
        >
          <Button onClick={onClose} sx={{ width: { xs: "100%", sm: "auto" } }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={loading}
            onClick={submit}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {transaction ? "Update" : "Save"}
          </Button>
        </DialogActions>
    </Dialog>

    <Snackbar
      open={snackbarOpen}
      autoHideDuration={4000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={() => setSnackbarOpen(false)}
        severity="error"
        sx={{ width: "100%" }}
      >
        Please select a transaction type first.
      </Alert>
    </Snackbar>

    <Dialog
      open={classificationDialogOpen}
        onClose={() => setClassificationDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Add New {newClassificationLevel === "TYPE" ? "Type" : "Category"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              autoFocus
              label="Name"
              value={newClassificationName}
              onChange={(e) => setNewClassificationName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              multiline
              rows={2}
              value={newClassificationDescription}
              onChange={(e) => setNewClassificationDescription(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClassificationDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={isCreatingClassification || !newClassificationName.trim()}
            onClick={handleAddClassification}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function getDefaultValues(
  transaction?: TxnResponseDto | null,
  typeOptions: TxnClassificationDto[] = [],
  categoryOptions: TxnClassificationDto[] = [],
): TransactionFormValues {
  const amount = transaction?.amount ?? 0;
  const effectiveAmount = transaction?.effectiveAmount ?? amount;
  const effectiveAmountDifferent = Boolean(
    transaction && effectiveAmount !== amount,
  );

  const txnTypeId =
    transaction?.txnType?.id ??
    (typeOptions.length > 0 ? typeOptions[0].id : 0);
  const txnCategoryId =
    transaction?.txnCategory?.id ??
    (categoryOptions.length > 0 ? categoryOptions[0].id : 0);

  return {
    txnTypeId,
    amount,
    effectiveAmountDifferent,
    effectiveAmount,
    txnCategoryId,
    note: transaction?.note ?? "",
    time: transaction?.time
      ? transaction.time.slice(0, 16)
      : toDateTimeLocalValue(),
  };
}
