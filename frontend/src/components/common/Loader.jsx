export default function Loader({ size = "md", text }) {
  const s = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" }[size];
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${s} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
      {text && <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>}
    </div>
  );
}
