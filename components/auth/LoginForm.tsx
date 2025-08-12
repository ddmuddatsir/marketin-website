import { LoginHeader } from "./LoginHeader";
import { ErrorMessage } from "./ErrorMessage";
import { EmailPasswordForm } from "./EmailPasswordForm";
import { LoginDivider } from "./LoginDivider";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { SignUpLink } from "./SignUpLink";

interface LoginFormProps {
  error: string | null;
  isLoading: boolean;
  onEmailPasswordSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn: () => void;
}

export function LoginForm({
  error,
  isLoading,
  onEmailPasswordSubmit,
  onGoogleSignIn,
}: LoginFormProps) {
  return (
    <div className="max-w-md w-full space-y-8">
      <LoginHeader />

      <div className="mt-8 space-y-6">
        <ErrorMessage error={error} />

        <EmailPasswordForm
          onSubmit={onEmailPasswordSubmit}
          isLoading={isLoading}
        />

        <LoginDivider />

        <GoogleSignInButton onClick={onGoogleSignIn} isLoading={isLoading} />

        <SignUpLink />
      </div>
    </div>
  );
}
