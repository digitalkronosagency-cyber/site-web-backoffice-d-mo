import {
  Zap,
  ShieldCheck,
  Siren,
  Gauge,
  BatteryCharging,
  Hammer,
  Lightbulb,
  Home,
  Wrench,
  Clock,
  Award,
  PhoneCall,
  type LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  ShieldCheck,
  Siren,
  Gauge,
  BatteryCharging,
  Hammer,
  Lightbulb,
  Home,
  Wrench,
  Clock,
  Award,
  PhoneCall,
};

export const ICON_OPTIONS = Object.keys(ICON_MAP);

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Zap;
}
