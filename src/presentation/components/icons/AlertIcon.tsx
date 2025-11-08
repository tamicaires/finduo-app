import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import React from "react";

type AlertIconVariant = "warning" | "success" | "info" | "destructive";

interface AlertIconProps {
  variant?: AlertIconVariant;
}

export function AlertIcon({ variant = "destructive" }: AlertIconProps) {
  const colorMap = {
    warning: {
      base: "bg-yellow-500",
      lightest: "bg-yellow-500 opacity-5",
      lighter: "bg-yellow-500 opacity-10",
      light: "bg-yellow-500 opacity-30",
      iconColor: "text-white",
      icon: <AlertTriangle className="w-5.5 h-5.5" />,
    },
    success: {
      base: "bg-green-500",
      lightest: "bg-green-500 opacity-5",
      lighter: "bg-green-500 opacity-10",
      light: "bg-green-500 opacity-30",
      iconColor: "text-white",
      icon: <CheckCircle className="w-5.5 h-5.5" />,
    },
    info: {
      base: "bg-primary",
      lightest: "bg-primary opacity-5",
      lighter: "bg-primary opacity-10",
      light: "bg-primary opacity-30",
      iconColor: "text-white",
      icon: <Info className="w-5.5 h-5.5" />,
    },
    destructive: {
      base: "bg-red-500",
      lightest: "bg-red-500 opacity-5",
      lighter: "bg-red-500 opacity-10",
      light: "bg-red-500 opacity-30",
      iconColor: "text-white",
      icon: <AlertTriangle className="w-5.5 h-5.5" />,
    },
  };

  const currentConfig = colorMap[variant];

  return (
    <div className="relative mx-auto mb-4 w-24 h-24 flex items-center justify-center">
      {/* Círculos de fundo estáticos */}
      <div
        className={`absolute inset-0 ${currentConfig.lightest} rounded-full`}
      ></div>
      <div
        className={`absolute inset-0 ${currentConfig.lighter} rounded-full scale-[0.8]`}
      ></div>
      <div
        className={`absolute inset-0 ${currentConfig.light} rounded-full scale-[0.6]`}
      ></div>
      <div
        className={`relative z-10 w-12 h-12 flex items-center justify-center ${currentConfig.base} rounded-full`}
      >
        {/* Renderiza o ícone específico para a variante, passando a cor do ícone */}
        {React.cloneElement(currentConfig.icon, {
          className: `${currentConfig.iconColor} ${currentConfig.icon.props.className}`,
        })}
      </div>
    </div>
  );
}
