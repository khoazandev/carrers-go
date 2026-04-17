// 2. Third-party libraries
import { Search, X } from 'lucide-react'

// 4. Shared
import { Input } from '@shared/components/ui/input'
import { Button } from '@shared/components/ui/button'

export default function JobSearchBar({ value, onChange }) {
  return (
    <div className="relative w-full shadow-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Tìm kiếm theo vị trí, công ty, kỹ năng..."
        className="w-full pl-10 pr-10 h-[52px] text-base rounded-xl border-input/80 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={() => onChange('')}
          title="Xóa tìm kiếm"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
