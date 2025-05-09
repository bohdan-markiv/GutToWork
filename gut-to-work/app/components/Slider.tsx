"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center h-10 px-2 rounded-md border border-gray-300 bg-[#dceefc]", // updated background to match dialog
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-300">
      <SliderPrimitive.Range className="absolute h-full bg-blue-500" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-blue-500 bg-white shadow hover:scale-105 transition-transform">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-blue-700">
        {props.value?.[0] ?? props.defaultValue?.[0]}
      </div>
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
))

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
