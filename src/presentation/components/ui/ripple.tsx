import { cn } from "@/shared/utils";
import type React from "react";


interface RippleEffectProps {
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  color?: string;
  intensity?: "light" | "medium" | "strong";
  rings?: number;
  position?:
    | "center"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
  className?: string;
}

export function RippleEffect({
  size = "md",
  color = "primary",
  intensity = "medium",
  rings = 5,
  position = "center",
  className,
}: RippleEffectProps) {
  const sizeConfig = {
    sm: { base: 8, increment: 2 },
    md: { base: 12, increment: 4 },
    lg: { base: 16, increment: 6 },
    xl: { base: 28, increment: 14 },
    xxl: { base: 36, increment: 16 },
  };

  const intensityConfig = {
    light: [4, 6, 8, 10, 12],
    medium: [6, 8, 10, 12, 16],
    strong: [8, 12, 16, 20, 25],
  };

  const positionConfig = {
    center: "items-center justify-center",
    "top-left": "items-start justify-start",
    "top-right": "items-start justify-end",
    "bottom-left": "items-end justify-start",
    "bottom-right": "items-end justify-end",
    "top-center": "items-start justify-center",
    "bottom-center": "items-end justify-center",
  };

  const { base, increment } = sizeConfig[size];
  const opacities = intensityConfig[intensity];
  const positionClasses = positionConfig[position];

  return (
    <div
      className={cn(
        "absolute inset-0 flex pointer-events-none",
        positionClasses,
        className
      )}
    >
      <div className="relative">
        {Array.from({ length: rings }).map((_, index) => {
          const ringSize = base + increment * (rings - index - 1);
          const opacity = opacities[index] || opacities[opacities.length - 1];

          return (
            <div
              key={index}
              className={`absolute border rounded-full`}
              style={{
                width: `${ringSize * 4}px`,
                height: `${ringSize * 4}px`,
                borderColor: `hsl(var(--${color}) / ${opacity}%)`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

interface RippleWrapperProps {
  children: React.ReactNode;
  rippleProps?: RippleEffectProps;
  className?: string;
}

export function RippleWrapper({
  children,
  rippleProps,
  className,
}: RippleWrapperProps) {
  return (
    <div className={cn("relative", className)}>
      <RippleEffect {...rippleProps} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface RippleBackgroundProps extends RippleEffectProps {
  containerClassName?: string;
}

export function RippleBackground({
  containerClassName,
  ...rippleProps
}: RippleBackgroundProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        containerClassName
      )}
    >
      <RippleEffect {...rippleProps} />
    </div>
  );
}
