import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  addExcludedWriter,
  selectExcludedWriters,
} from "@/features/preferences/store/preferencesSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AddWriterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormErrors {
  name?: string;
  surname?: string;
  duplicate?: string;
}

const validate = (name: string, surname: string): FormErrors => {
  const errors: FormErrors = {};
  if (name.trim().length === 0) {
    errors.name = "Name is required.";
  }
  if (surname.trim().length === 0) {
    errors.surname = "Surname is required.";
  }
  return errors;
};

const AddWriterDialog = ({
  open,
  onOpenChange,
}: AddWriterDialogProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const excludedWriters = useAppSelector(selectExcludedWriters);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const resetForm = () => {
    setName("");
    setSurname("");
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(name, surname);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const fullName = `${name.trim()} ${surname.trim()}`;

    if (excludedWriters.includes(fullName)) {
      setErrors({ duplicate: "This writer is already excluded." });
      return;
    }

    dispatch(addExcludedWriter(fullName));
    resetForm();
    onOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Excluded Writer</DialogTitle>
          <DialogDescription>
            Articles by this writer will be hidden from your feed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="writer-name">Name</Label>
            <Input
              id="writer-name"
              placeholder="e.g. John"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name)
                  setErrors((prev) => ({ ...prev, name: undefined }));
                if (errors.duplicate)
                  setErrors((prev) => ({ ...prev, duplicate: undefined }));
              }}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="writer-surname">Surname</Label>
            <Input
              id="writer-surname"
              placeholder="e.g. Doe"
              value={surname}
              onChange={(e) => {
                setSurname(e.target.value);
                if (errors.surname)
                  setErrors((prev) => ({ ...prev, surname: undefined }));
                if (errors.duplicate)
                  setErrors((prev) => ({ ...prev, duplicate: undefined }));
              }}
              aria-invalid={!!errors.surname}
            />
            {errors.surname && (
              <p className="text-destructive text-xs">{errors.surname}</p>
            )}
          </div>

          {errors.duplicate && (
            <p className="text-destructive text-xs">{errors.duplicate}</p>
          )}

          <DialogFooter>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWriterDialog;
