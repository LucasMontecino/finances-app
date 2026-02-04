export default function Paragraph({ text }: { text: string }) {
  return (
    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{text}</p>
  );
}
