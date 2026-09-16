export default function StatBadge({ valor, etiqueta }: { valor: string | number; etiqueta: string }) {
  return (
    <div className="border-l-2 border-gold pl-3">
      <p className="font-display text-3xl leading-none">{valor}</p>
      <p className="text-xs uppercase tracking-wider text-steel mt-1">{etiqueta}</p>
    </div>
  );
}
