interface RegisterHeaderProps {
  title?: string;
  subtitle?: string;
}

export function RegisterHeader({
  title = "Create your account",
  subtitle,
}: RegisterHeaderProps) {
  return (
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>
      )}
    </div>
  );
}
