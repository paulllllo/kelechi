import React from 'react';
import { CrosshairIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export type CoordinateTagVariant = 'outline' | 'solid' | 'plain';
export type CoordinateTagSize = 'sm' | 'md';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CoordinateTagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Latitude/longitude pair, auto-formatted as "6.6018° N, 3.3515° E". */
  coordinates?: Coordinates;
  /** Custom coordinate-style value (e.g. grid ref "TQ 3004 8003"). Overrides `coordinates`. */
  value?: React.ReactNode;
  /** Optional short prefix label, e.g. "LOC", "FIG. 01", "REF". */
  label?: string;
  /** Decimal places when formatting `coordinates`. Default 4. */
  precision?: number;
  /** Visual treatment. Default 'outline'. */
  variant?: CoordinateTagVariant;
  /** Size scale. Default 'sm'. */
  size?: CoordinateTagSize;
  /** Show a crosshair icon before the content. */
  showIcon?: boolean;
}

export function CoordinateTag({
  coordinates,
  value,
  label,
  precision = 4,
  variant = 'outline',
  size = 'sm',
  showIcon = false,
  className = '',
  ...rest
}: CoordinateTagProps) {
  const content = value ?? (coordinates ? formatCoordinates(coordinates, precision) : null);

  if (content === null || content === undefined) return null;

  const machineValue = coordinates ? `${coordinates.lat},${coordinates.lng}` : undefined;

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center whitespace-nowrap font-mono uppercase leading-none tracking-wider tabular-nums',
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        className,
      )}
      data-coordinates={machineValue}
      {...rest}
    >
      {showIcon && (
        <CrosshairIcon
          aria-hidden="true"
          className={size === 'md' ? 'h-3.5 w-3.5 shrink-0' : 'h-3 w-3 shrink-0'}
          strokeWidth={1.75}
        />
      )}
      {label && (
        <>
          <span className={LABEL_CLASSES[variant]}>{label}</span>
          <span aria-hidden="true" className={DIVIDER_CLASSES[variant]}>
            /
          </span>
        </>
      )}
      <span className="truncate">{content}</span>
    </span>
  );
}

const SIZE_CLASSES: Record<CoordinateTagSize, string> = {
  sm: 'gap-1.5 text-[10px] px-2 py-1',
  md: 'gap-2 text-xs px-2.5 py-1.5',
};

const VARIANT_CLASSES: Record<CoordinateTagVariant, string> = {
  outline: 'rounded-sm border border-border-strong bg-surface text-ink-2',
  solid: 'rounded-sm border border-ink bg-ink text-background',
  plain: 'border border-transparent !px-0 text-ink-3',
};

const LABEL_CLASSES: Record<CoordinateTagVariant, string> = {
  outline: 'font-medium text-ink',
  solid: 'font-medium text-background',
  plain: 'font-medium text-ink-2',
};

const DIVIDER_CLASSES: Record<CoordinateTagVariant, string> = {
  outline: 'text-border-strong',
  solid: 'text-background/50',
  plain: 'text-border-strong',
};

export function formatCoordinates({ lat, lng }: Coordinates, precision = 4): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(precision)}° ${latDir}, ${Math.abs(lng).toFixed(precision)}° ${lngDir}`;
}
