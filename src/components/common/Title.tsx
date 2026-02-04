export default function Title({ text }: { text: string }) {
  return (
    <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
      {text}
    </h1>
  );
}
