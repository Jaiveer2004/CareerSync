import * as React from "react";
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#1e40af] text-white hover:bg-[#1e3a8a] active:bg-blue-800 shadow-md hover:shadow-lg",
        destructive: "bg-red-600 text-slate-900 hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg",
        outline: "border border-slate-300 bg-transparent text-slate-600 hover:bg-white hover:text-slate-900 active:bg-slate-100",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-white shadow-md hover:shadow-lg",
        ghost: "text-slate-600 hover:bg-white hover:text-slate-900 active:bg-slate-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, 
  VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp 
        className={cn(buttonVariants({variant, size, className}))}
        ref={ref}
        {...props}
      />
    ) 
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }