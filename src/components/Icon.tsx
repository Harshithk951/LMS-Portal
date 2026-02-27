import { Globe, Bot, BarChart3, Palette, Smartphone, Shield, Cloud, FlaskConical, Footprints, Flame, Zap, Trophy, BookOpen, Target, Accessibility, Mic, Gem, Star, User, GraduationCap, Briefcase, Stethoscope, Wrench, Medal } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
    globe: Globe,
    bot: Bot,
    'bar-chart': BarChart3,
    palette: Palette,
    smartphone: Smartphone,
    shield: Shield,
    cloud: Cloud,
    flask: FlaskConical,
    footprints: Footprints,
    flame: Flame,
    zap: Zap,
    trophy: Trophy,
    'book-open': BookOpen,
    target: Target,
    accessibility: Accessibility,
    mic: Mic,
    gem: Gem,
    star: Star,
    user: User,
    'graduation-cap': GraduationCap,
    briefcase: Briefcase,
    stethoscope: Stethoscope,
    wrench: Wrench,
    medal: Medal,
};

interface IconProps extends LucideProps {
    name: string;
}

export default function Icon({ name, ...props }: IconProps) {
    const IconComponent = iconMap[name];
    if (!IconComponent) return <User {...props} />;
    return <IconComponent {...props} />;
}
