export const getStatusColorName = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "green" as const;
    case "processing":
      return "blue" as const;
    case "shipped":
      return "purple" as const;
    case "cancelled":
      return "red" as const;
    default:
      return "yellow" as const;
  }
};

export const formatDate = (timestamp: {
  _seconds: number;
  _nanoseconds: number;
}) => {
  const date = new Date(
    timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
  );
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
