import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  className?: string
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
  readOnly = false,
  className,
}: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState(
    date ? format(date, "PPP") : ""
  )

  React.useEffect(() => {
    setInputValue(date ? format(date, "PPP") : "")
  }, [date])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    
    // Try to parse the input value as a date
    const parsedDate = new Date(value)
    if (!isNaN(parsedDate.getTime())) {
      onDateChange?.(parsedDate)
    }
  }

  return (
    <Popover>
      <div className={cn("relative", className)}>
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className="pr-10"
        />
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            disabled={disabled || readOnly}
            type="button"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            onDateChange?.(selectedDate)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
