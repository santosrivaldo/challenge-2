import { Input } from './Input'

export type DateRange = { from: string; to: string }

type DateRangeFilterProps = {
  value: DateRange
  onChange: (next: DateRange) => void
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <Input
        type="date"
        label="From"
        value={value.from}
        onChange={(e) => onChange({ ...value, from: e.target.value })}
      />
      <Input
        type="date"
        label="To"
        value={value.to}
        onChange={(e) => onChange({ ...value, to: e.target.value })}
      />
    </div>
  )
}
