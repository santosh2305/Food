import { Minus, Plus, Leaf, UtensilsCrossed } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
export function Quantity({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
}) {
  return (
    <div className="quantity">
      <button
        type="button"
        aria-label={`Decrease ${label} quantity`}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
      >
        <Minus size={14} />
      </button>
      <span aria-label={`${label} quantity`}>{value}</span>
      <button
        type="button"
        aria-label={`Increase ${label} quantity`}
        disabled={value >= 99}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
export function FoodPlaceholder({
  category,
  compact = false,
}: {
  category: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`food-placeholder ${compact ? 'compact' : ''}`}
      aria-label={`${category} photograph coming soon`}
    >
      <span className="placeholder-symbol">
        <UtensilsCrossed size={compact ? 28 : 42} strokeWidth={1} />
      </span>
      {!compact && (
        <>
          <span className="placeholder-category">{category}</span>
          <small>From our home kitchen</small>
        </>
      )}
    </div>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">
          <Leaf size={13} />
          {eyebrow}
        </p>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
export function Modal({
  open,
  onClose,
  title,
  children,
  className = '',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    if (open) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else if (dialog.open) dialog.close();
    return () => {
      document.body.style.overflow = '';
      if (dialog.open) dialog.close();
      if (open) previous?.focus();
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-label={title}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-top">
        <h2>{title}</h2>
        <button
          className="icon-button"
          type="button"
          aria-label={`Close ${title}`}
          onClick={onClose}
        >
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
