import { Check } from "lucide-react";
import { BOOKING_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BookingStepperProps {
  currentStep: number;
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  return (
    <nav aria-label="Booking progress" className="overflow-x-auto">
      <ol className="flex items-center gap-2 md:gap-4">
        {BOOKING_STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <li key={step.id} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  isCompleted && "bg-primary text-white",
                  isCurrent && "bg-gray-900 text-white",
                  !isCompleted && !isCurrent && "bg-gray-100 text-gray-400"
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : step.id}
              </div>
              <span
                className={cn(
                  "hidden text-sm font-medium md:inline",
                  isCurrent ? "text-gray-900" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
              {step.id < BOOKING_STEPS.length && (
                <div className="hidden h-px w-8 bg-gray-200 md:block" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
