import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function TShirtCard({ image, skuCode, name, category, className, onClick }) {
  const categoryColors = {
    men: 'bg-blue-600',
    women: 'bg-rose-600',
    unisex: 'bg-violet-600',
  };

  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div
      className={cn(
        'group relative rounded-2xl bg-white shadow-sm transition-all hover:shadow-md cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      <div className="aspect-[3/4] overflow-hidden rounded-t-2xl">
        <img
          src={image || '/placeholder.svg'}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <Badge
        className={cn(
          'absolute right-4 top-4 text-white text-sm font-medium px-3 py-0.5 rounded-full shadow',
          categoryColors[category],
        )}
      >
        {formattedCategory}
      </Badge>

      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">SKU: {skuCode}</p>
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{name}</h3>
      </div>
    </div>
  );
}
