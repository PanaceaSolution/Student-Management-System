import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

export function DateSelect({ className, onChange }) {
   const [date, setDate] = useState(null); 

   const handleSelect = (selectedDate) => {
      setDate(selectedDate);
      onChange(selectedDate);  
   };

   return (
      <div className={cn("grid gap-2", className)}>
         <Popover>
            <PopoverTrigger asChild>
               <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                     "w-auto bg-[#FFFFFF]  justify-start text-left font-normal",
                     !date && "text-muted-foreground"
                  )}
                  aria-label="Select a date range"
               >
                  <CalendarIcon className="mr-1 h-4 w-3" />
                  {date ? (
                     date.to ? (
                        <>
                           {format(date.from, "LLL dd, y")} -{" "}
                           {format(date.to, "LLL dd, y")}
                        </>
                     ) : (
                        format(date.from, "LLL dd, y")
                     )
                  ) : (
                     <span className="text-gray-900 text-sm">Pick a date</span> 
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
               <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={new Date()}  
                  selected={date}
                  onSelect={handleSelect}
                  numberOfMonths={1}
               />
            </PopoverContent>
         </Popover>
      </div>
   );
}
