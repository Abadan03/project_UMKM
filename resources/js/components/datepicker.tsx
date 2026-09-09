import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
    value?: DateRange;
    onChange: (value: DateRange | undefined) => void;
}

export function DatePickerWithRange({
    value,
    onChange,
}: DatePickerWithRangeProps) {
    return (
        <Field className="mx-auto w-auto">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date-picker-range"
                        className="flex justify-start rounded-none border-2 border-[#1a0a2e] bg-[#ddc8f0] px-2.5 font-normal text-[#1a0a2e] hover:bg-[#ddc8f0] hover:text-[#1a0a2e] shadow-[3px_3px_0px_0px_#1a0a2e] focus-visible:ring-2 focus-visible:ring-[#ffdd00]"
                    >
                        <CalendarIcon data-icon="inline-start" />

                        {value?.from ? (
                            value.to ? (
                                <>
                                    {format(value.from, "LLL dd, y")} -{" "}
                                    {format(value.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(value.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        defaultMonth={value?.from}
                        selected={value}
                        onSelect={onChange}
                        numberOfMonths={1}
                    />
                </PopoverContent>
            </Popover>
        </Field>
    );
}
