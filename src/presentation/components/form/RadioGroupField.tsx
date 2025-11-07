import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@presentation/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@presentation/components/ui/radio-group";

interface RadioGroupOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupFieldProps {
  name: string;
  label: string;
  options: RadioGroupOption[];
  description?: string;
  required?: boolean;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

export function RadioGroupField({
  name,
  label,
  options,
  description,
  required,
  className,
  orientation = 'vertical'
}: RadioGroupFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel>
            {label} {required && <span className="text-red-500 ml-0.5">*</span>}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={`${orientation === 'horizontal' ? 'flex flex-row gap-4' : 'flex flex-col gap-2'} ${className || ''}`}
            >
              {options.map((option) => (
                <FormItem
                  key={option.value}
                  className={`flex items-center space-x-3 space-y-0 border ${
                    option.value === field.value
                      ? "border-primary"
                      : "border-border"
                  } py-2 px-4 rounded-lg`}
                >
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <div className="flex flex-col gap-0.5">
                    <FormLabel
                      className={`font-medium ${
                        option.value === field.value
                          ? "text-primary"
                          : ""
                      }`}
                    >
                      {option.label}
                    </FormLabel>
                    {option.description && (
                      <FormDescription className="text-xs">
                        {option.description}
                      </FormDescription>
                    )}
                  </div>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}
