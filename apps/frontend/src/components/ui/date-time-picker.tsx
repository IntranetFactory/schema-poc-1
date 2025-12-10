import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateTimePickerProps {
  date?: Date
  onDateTimeChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DateTimePicker({
  date,
  onDateTimeChange,
  placeholder = "Pick a date and time",
  disabled = false,
  className,
}: DateTimePickerProps) {
  const hours = date ? String(date.getHours()).padStart(2, '0') : "12"
  const minutes = date ? String(date.getMinutes()).padStart(2, '0') : "00"

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Keep the existing time if we have a date, otherwise use current time
      const newDate = new Date(selectedDate)
      if (date) {
        newDate.setHours(date.getHours())
        newDate.setMinutes(date.getMinutes())
        newDate.setSeconds(date.getSeconds())
      }
      onDateTimeChange?.(newDate)
    } else {
      onDateTimeChange?.(undefined)
    }
  }

  const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
    const numValue = parseInt(value) || 0
    const baseDate = date || new Date()
    const newDate = new Date(baseDate)
    
    if (type === 'hours') {
      newDate.setHours(Math.max(0, Math.min(23, numValue)))
    } else {
      newDate.setMinutes(Math.max(0, Math.min(59, numValue)))
    }
    
    onDateTimeChange?.(newDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP 'at' HH:mm")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <div className="flex h-full flex-col items-center justify-center p-3 sm:w-[120px]">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <Label htmlFor="hours" className="text-sm font-medium">
                  Time
                </Label>
              </div>
              <div className="mt-3 grid gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="hours" className="text-sm">
                    Hours
                  </Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => handleTimeChange('hours', e.target.value)}
                    className="w-16 text-center"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="minutes" className="text-sm">
                    Minutes
                  </Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => handleTimeChange('minutes', e.target.value)}
                    className="w-16 text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
