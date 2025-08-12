import Link from "next/link";

interface SignInLinkProps {
  text?: string;
  linkText?: string;
  href?: string;
}

export function SignInLink({
  text = "Already have an account?",
  linkText = "Sign in",
  href = "/login",
}: SignInLinkProps) {
  return (
    <div className="text-center">
      <span className="text-sm text-gray-600">
        {text}{" "}
        <Link
          href={href}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {linkText}
        </Link>
      </span>
    </div>
  );
}
