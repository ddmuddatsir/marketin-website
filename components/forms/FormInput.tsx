import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormInputProps } from "@/types/input";

export function FormInput({
  id,
  label,
  type = "text",
  register,
  error,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        {...register(id)}
        className="focus:ring-2 focus:ring-primary"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
