interface LoadingProps {
  message?: string;
}

const Loading = ({ message = 'Memuat data...' }: LoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
        <div className="absolute w-6 h-6 rounded-full bg-blue-50"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default Loading;
