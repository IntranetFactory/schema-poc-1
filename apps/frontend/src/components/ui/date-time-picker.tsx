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

interface DateTimePickerProps {
  date?: Date
  onDateTimeChange?: (date: Date | undefined) => void
  disabled?: boolean
  readOnly?: boolean
  className?: string
}

export function DateTimePicker({
  date,
  onDateTimeChange,
  disabled = false,
  readOnly = false,
  className,
}: DateTimePickerProps) {
  const [dateInputValue, setDateInputValue] = React.useState(
    date ? format(date, "PPP") : ""
  )
  const [timeValue, setTimeValue] = React.useState(
    date ? format(date, "HH:mm") : ""
  )

  React.useEffect(() => {
    if (date) {
      setDateInputValue(format(date, "PPP"))
      setTimeValue(format(date, "HH:mm"))
    } else {
      setDateInputValue("")
      setTimeValue("")
    }
  }, [date])

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDateInputValue(value)
    
    // Try to parse the input value as a date
    const parsedDate = new Date(value)
    if (!isNaN(parsedDate.getTime())) {
      const newDate = new Date(parsedDate)
      // Keep existing time if we have one
      if (date) {
        newDate.setHours(date.getHours())
        newDate.setMinutes(date.getMinutes())
        newDate.setSeconds(date.getSeconds())
      } else if (timeValue) {
        // Parse time from timeValue
        const [hours, minutes] = timeValue.split(':').map(Number)
        newDate.setHours(hours || 0)
        newDate.setMinutes(minutes || 0)
      }
      onDateTimeChange?.(newDate)
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTimeValue(value)
    
    // Parse time in format HH:mm
    const [hours, minutes] = value.split(':').map(Number)
    if (!isNaN(hours) && !isNaN(minutes)) {
      const newDate = date ? new Date(date) : new Date()
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
      newDate.setSeconds(0)
      onDateTimeChange?.(newDate)
    }
  }

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate)
      // Keep existing time if we have one
      if (date) {
        newDate.setHours(date.getHours())
        newDate.setMinutes(date.getMinutes())
        newDate.setSeconds(date.getSeconds())
      } else if (timeValue) {
        const [hours, minutes] = timeValue.split(':').map(Number)
        newDate.setHours(hours || 0)
        newDate.setMinutes(minutes || 0)
      }
      onDateTimeChange?.(newDate)
    }
  }

  return (
    <div className={cn("flex gap-2", className)}>
      <div className="flex-1">
        <label className="text-sm font-medium">Date</label>
        <Popover>
          <div className="relative mt-1">
            <Input
              value={dateInputValue}
              onChange={handleDateInputChange}
              placeholder="Select date"
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
              onSelect={handleCalendarSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex-1">
        <label className="text-sm font-medium">Time</label>
        <Input
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          disabled={disabled}
          readOnly={readOnly}
          className="mt-1"
        />
      </div>
    </div>
  )
}
