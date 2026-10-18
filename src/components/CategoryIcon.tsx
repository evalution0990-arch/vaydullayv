import React from 'react';
import {
  Briefcase,
  GraduationCap,
  HeartPulse,
  Smile,
  Wallet,
  Home,
  CheckCircle2,
  Clock,
  Sparkles,
  Droplet,
  BookOpen,
  Activity,
  Moon,
  Flame,
  Calendar,
  Layers
} from 'lucide-react';
import { CategoryId } from '../types';

interface CategoryIconProps {
  category?: CategoryId;
  iconName?: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  iconName,
  className = 'w-4 h-4',
  size
}) => {
  const iconProps = { className, size };

  if (iconName) {
    switch (iconName) {
      case 'Droplet': return <Droplet {...iconProps} />;
      case 'BookOpen': return <BookOpen {...iconProps} />;
      case 'Activity': return <Activity {...iconProps} />;
      case 'Sparkles': return <Sparkles {...iconProps} />;
      case 'Moon': return <Moon {...iconProps} />;
      case 'Flame': return <Flame {...iconProps} />;
      case 'HeartPulse': return <HeartPulse {...iconProps} />;
      case 'Briefcase': return <Briefcase {...iconProps} />;
      case 'GraduationCap': return <GraduationCap {...iconProps} />;
      case 'Wallet': return <Wallet {...iconProps} />;
      case 'Home': return <Home {...iconProps} />;
      case 'Smile': return <Smile {...iconProps} />;
      case 'Calendar': return <Calendar {...iconProps} />;
      default: return <Sparkles {...iconProps} />;
    }
  }

  switch (category) {
    case 'work':
      return <Briefcase {...iconProps} />;
    case 'study':
      return <GraduationCap {...iconProps} />;
    case 'health':
      return <HeartPulse {...iconProps} />;
    case 'personal':
      return <Smile {...iconProps} />;
    case 'finance':
      return <Wallet {...iconProps} />;
    case 'home':
      return <Home {...iconProps} />;
    default:
      return <Layers {...iconProps} />;
  }
};
