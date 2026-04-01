import type { LucideIcon } from 'lucide-react';
import { Building2, Cpu, Edit, FileText, Home, Palette, Plane, Users } from 'lucide-react';

export const serviceIconMap: Array<{ id: string; icon: LucideIcon }> = [
  { id: 'business-license', icon: FileText },
  { id: 'amendment', icon: Edit },
  { id: 'gov-service', icon: Building2 },
  { id: 'ai-it', icon: Cpu },
  { id: 'design', icon: Palette },
  { id: 'real-estate', icon: Home },
  { id: 'travel', icon: Plane },
  { id: 'manpower', icon: Users },
];

export const defaultServiceIcon = FileText;

export const getServiceIconById = (serviceId?: string) => {
  if (!serviceId) return defaultServiceIcon;
  return serviceIconMap.find((entry) => entry.id === serviceId)?.icon ?? defaultServiceIcon;
};