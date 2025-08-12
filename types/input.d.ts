import { ProfileFormData } from "@/hooks/useProfileForm";
import { UseFormRegister } from "react-hook-form";

export interface FormInputProps {
  id: keyof ProfileFormData;
  label: string;
  type?: string;
  register: UseFormRegister<ProfileFormData>;
  error?: string;
}
