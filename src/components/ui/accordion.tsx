'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionContextValue {
  openItems: string[];
  toggle: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = React.createContext<AccordionContextValue>({
  openItems: [],
  toggle: () => undefined,
  type: 'single',
});

interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  className?: string;
  children: React.ReactNode;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = 'single', defaultValue, className, children }, ref) => {
    const [openItems, setOpenItems] = React.useState<string[]>(() => {
      if (!defaultValue) return [];
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    });

    const toggle = React.useCallback(
      (value: string) => {
        setOpenItems((prev) => {
          if (type === 'single') {
            return prev.includes(value) ? [] : [value];
          }
          return prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
        });
      },
      [type],
    );

    return (
      <AccordionContext.Provider value={{ openItems, toggle, type }}>
        <div ref={ref} className={cn('divide-y divide-border', className)}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);
Accordion.displayName = 'Accordion';

interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, className, children }, ref) => (
    <div ref={ref} data-accordion-item={value} className={cn('border-b border-border last:border-b-0', className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child as React.ReactElement<{ value?: string }>, { value });
      })}
    </div>
  ),
);
AccordionItem.displayName = 'AccordionItem';

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string;
  children: React.ReactNode;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ value = '', className, children, ...props }, ref) => {
    const { openItems, toggle } = React.useContext(AccordionContext);
    const isOpen = openItems.includes(value);

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        onClick={() => toggle(value)}
        className={cn(
          'flex w-full items-center justify-between py-4 text-left text-sm font-medium transition-colors hover:text-primary [&[aria-expanded=true]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </button>
    );
  },
);
AccordionTrigger.displayName = 'AccordionTrigger';

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  children: React.ReactNode;
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ value = '', className, children, ...props }, ref) => {
    const { openItems } = React.useContext(AccordionContext);
    const isOpen = openItems.includes(value);

    return (
      <div
        ref={ref}
        hidden={!isOpen}
        className={cn('overflow-hidden text-sm', !isOpen && 'h-0', className)}
        {...props}
      >
        <div className="pb-4">{children}</div>
      </div>
    );
  },
);
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
