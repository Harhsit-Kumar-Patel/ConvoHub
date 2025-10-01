import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className = '', side = 'top', align = 'center', ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    side={side}
    align={align}
    className={`z-50 overflow-hidden rounded-md border bg-popover px-2 py-1.5 text-xs text-popover-foreground shadow-md ${className}`}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
