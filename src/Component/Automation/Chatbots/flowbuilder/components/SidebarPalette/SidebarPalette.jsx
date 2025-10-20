
import React, { useMemo } from 'react';
import { SECTION_DATA } from './sections-data';
import * as LucideIcons from 'lucide-react';
import { cn } from '../../lib/utils';
import styles from './sidebar-palette.module.css';

export default function SidebarPalette({
  onDragStart,
  onItemClick,
  filterChannels,
  className,
}) {
  
  const allItems = useMemo(() => {
    let items = SECTION_DATA.flatMap(sec => sec.items);
    if (!filterChannels || filterChannels.length === 0) return items;
    
    const allowed = new Set(filterChannels);
    return items.filter((it) => !it.channels || it.channels.some((c) => allowed.has(c)));
  }, [filterChannels]);


  function toPayload(it) {
    return { 
        key: it.key, 
        label: it.label, 
        icon: it.icon,
        type: it.type, 
        color: it.color, 
        description: it.description,
        content: it.content,
        quickReplies: it.quickReplies,
    };
  }


  function handleDragStart(e, item) {
    const payload = toPayload(item);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/x-flow-node', JSON.stringify(payload));
    e.dataTransfer.setData('text/plain', item.label);
    
    const ghost = document.createElement('div');
    ghost.className = "flex flex-col items-center justify-center text-center gap-2 p-3 rounded-lg shadow-xl bg-card text-card-foreground border border-border";
    ghost.style.width = '130px';
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px';

    const iconContainer = document.createElement('div');
    iconContainer.className = "w-10 h-10 rounded-full grid place-items-center bg-primary/10 flex-shrink-0";
    
    const Icon = LucideIcons[item.icon] || LucideIcons.HelpCircle;
    
    const iconElement = document.createElement('div');
    iconElement.style.color = 'hsl(var(--primary))';
    iconElement.innerHTML = `<!-- Approximating icon, actual SVG might differ -->`;
    iconContainer.appendChild(iconElement);

    const labelElement = document.createElement('span');
    labelElement.className = "text-sm font-medium leading-snug";
    labelElement.innerText = item.label;

    ghost.appendChild(iconContainer);
    ghost.appendChild(labelElement);

    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 75, 40);

    setTimeout(() => {
      document.body.removeChild(ghost);
    }, 0);
    
    onDragStart(e, payload);
  }

  function handleItemClick(item) {
    const payload = toPayload(item);
    onItemClick?.(payload);
  }
  
  return (
    <nav className={cn("  flex flex-col gap-4 overflow-y ")} aria-label="Node palette">
        {SECTION_DATA.map(section => (
            <div key={section.key}>
                <h3 className="text-sm font-medium  mb-2 px-2">{section.title}</h3>
                <div className="grid grid-cols-2 gap-2">
                    {section.items.map(item => {
                        const Icon = typeof item.icon === 'string' ? LucideIcons[item.icon] ?? LucideIcons.HelpCircle : item.icon;
                        const isVisible = !filterChannels || filterChannels.length === 0 || !item.channels || item.channels.some(c => filterChannels.includes(c));
                        
                        if (!isVisible) return null;

                        return (
                        <button
                            key={item.key}
                            type="button"
                            className={styles.paletteItem}
                            style={{'--item-color': item.color}}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                            onClick={() => handleItemClick(item)}
                            aria-label={`Add ${item.label}`}
                            title={`${item.label}${item.description ? ` - ${item.description}`:''}`}
                        >
                            <div className={styles.paletteItemIconWrapper}>
                                <Icon className={styles.paletteItemIcon} />
                            </div>
                            <span className={styles.paletteItemLabel}>{item.label}</span>
                        </button>
                        )
                    })}
                </div>
            </div>
        ))}
    </nav>
  );
}
