import Link from "next/link";

interface SignUpLinkProps {
  text?: string;
  linkText?: string;
  href?: string;
}

export function SignUpLink({
  text = "Don't have an account?",
  linkText = "Sign up",
  href = "/register",
}: SignUpLinkProps) {
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
