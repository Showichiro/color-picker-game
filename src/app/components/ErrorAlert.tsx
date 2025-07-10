type ErrorAlertProps = {
  error: string | null;
};

export const ErrorAlert = ({ error }: ErrorAlertProps) => {
  if (!error) {
    return null;
  }

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
      {error}
    </div>
  );
};