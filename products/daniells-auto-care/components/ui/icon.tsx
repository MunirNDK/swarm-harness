import {
  Sparkles,
  CarFront,
  Armchair,
  ShieldCheck,
  Wand2,
  Layers,
  SunDim,
  Truck,
  Star,
  Menu,
  X,
  Phone,
  ChevronDown,
  MapPin,
  Clock,
  CheckCircle,
  Shield,
  Award,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { ServiceIcon } from '@/lib/site';

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  CarFront,
  Armchair,
  ShieldCheck,
  Wand2,
  Layers,
  SunDim,
  Truck,
  Star,
  Menu,
  X,
  Phone,
  ChevronDown,
  MapPin,
  Clock,
  CheckCircle,
  Shield,
  Award,
  Zap,
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export function Icon({ name, className, size }: IconProps) {
  const LucideIcon = iconMap[name];
  if (!LucideIcon) return null;
  return <LucideIcon className={className} size={size} />;
}
