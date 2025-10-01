import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';

const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className = '', ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={`fixed bottom-2 right-2 z-[100] flex max-h-screen w-80 flex-col gap-2 outline-none ${className}`}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const Toast = React.forwardRef(({ className = '', ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={`grid w-full rounded-md border bg-popover p-3 text-sm text-popover-foreground shadow-md ${className}`}
    {...props}
  />
));
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastTitle = React.forwardRef(({ className = '', ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={`font-medium ${className}`} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className = '', ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={`text-xs text-muted-foreground ${className}`} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

const ToastAction = ToastPrimitives.Action;
const ToastClose = ToastPrimitives.Close;

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastAction, ToastClose };
