import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="text-center py-20 lg:py-28">
      <div className="max-w-md mx-auto">
        {/* Decorative element */}
        <div className="ornament-divider mb-8">
          <div className="w-2 h-2 border border-light-gold/50 rotate-45"></div>
        </div>
        
        {/* Icon */}
        {icon ? (
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-champagne/50 rounded-full">
            {icon}
          </div>
        ) : (
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-champagne/50 rounded-full">
            <Sparkles size={24} className="text-light-gold/60" />
          </div>
        )}
        
        {/* Title */}
        <h3 className="display-serif text-2xl lg:text-3xl text-espresso mb-4 leading-tight">
          {title}
        </h3>
        
        {/* Description */}
        {description && (
          <p className="text-taupe text-sm leading-relaxed mb-8">
            {description}
          </p>
        )}
        
        {/* Decorative element */}
        <div className="ornament-divider mt-8">
          <div className="w-2 h-2 border border-light-gold/50 rotate-45"></div>
        </div>
      </div>
    </div>
  );
}
