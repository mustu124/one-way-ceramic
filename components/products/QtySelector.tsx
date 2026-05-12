'use client'

interface Props {
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
}

export default function QtySelector({ value, onChange, min = 1, max = 99, size = 'md' }: Props) {
  const h = 'h-11'
  const txt = size === 'sm' ? 'text-sm' : 'text-base'

  return (
    <div className={`flex w-full items-center overflow-hidden rounded-lg border border-beige2 ${h}`}>
      <button
        type="button"
        className={`min-w-11 flex-1 bg-beige font-semibold text-brown transition-colors active:bg-beige2 ${h} ${txt}`}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className={`flex flex-[1.5] select-none items-center justify-center border-x border-beige2 font-medium text-text ${h} ${txt}`}>
        {value}
      </span>
      <button
        type="button"
        className={`min-w-11 flex-1 bg-beige font-semibold text-brown transition-colors active:bg-beige2 ${h} ${txt}`}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}
