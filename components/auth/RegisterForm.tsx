import { RegisterHeader } from "./RegisterHeader";
import { ErrorMessage } from "./ErrorMessage";
import { EmailPasswordRegisterForm } from "./EmailPasswordRegisterForm";
import { LoginDivider } from "./LoginDivider";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { SignInLink } from "./SignInLink";

interface RegisterFormProps {
  error: string | null;
  isLoading: boolean;
  onEmailPasswordSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignUp: () => void;
}

export function RegisterForm({
  error,
  isLoading,
  onEmailPasswordSubmit,
  onGoogleSignUp,
}: RegisterFormProps) {
  return (
    <div className="max-w-md w-full space-y-8">
      <RegisterHeader />

      <div className="mt-8 space-y-6">
        <ErrorMessage error={error} />

        <EmailPasswordRegisterForm
          onSubmit={onEmailPasswordSubmit}
          isLoading={isLoading}
        />

        <LoginDivider />

        <GoogleSignInButton
          onClick={onGoogleSignUp}
          isLoading={isLoading}
          text="Sign up with Google"
        />

        <SignInLink />
      </div>
    </div>
  );
}
