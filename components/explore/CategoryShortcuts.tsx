"use client";

import {
  Music,
  Briefcase,
  Wrench,
  Sparkles,
  UtensilsCrossed,
  Trophy,
  Palette,
  Users,
  Compass,
} from "lucide-react";
import { EXPLORE_CATEGORIES, type ExploreCategory } from "@/lib/explore/types";

const CATEGORY_ICONS: Record<ExploreCategory, React.ElementType> = {
  all: Compass,
  music: Music,
  business: Briefcase,
  workshops: Wrench,
  festivals: Sparkles,
  food_drink: UtensilsCrossed,
  sports: Trophy,
  arts: Palette,
  community: Users,
};

interface CategoryShortcutsProps {
  selectedCategory: ExploreCategory;
  onSelectCategory: (category: ExploreCategory) => void;
}

export default function CategoryShortcuts({
  selectedCategory,
  onSelectCategory,
}: CategoryShortcutsProps) {
  return (
    <section
      aria-label="Event categories"
      className="explore-fade-up w-full"
    >
      <div
        role="tablist"
        aria-label="Filter events by category"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth overscroll-x-contain touch-pan-x -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
      >
        {EXPLORE_CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.key] || Compass;
          const isSelected = selectedCategory === cat.key;

          return (
            <button
              key={cat.key}
              role="tab"
              aria-selected={isSelected}
              tabIndex={0}
              onClick={() => onSelectCategory(cat.key)}
              className={`group flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 focus:outline-none focus:ring-2 focus:ring-violet-500/20 hover:-translate-y-0.5 active:scale-95 cursor-pointer touch-manipulation min-h-[38px] ${
                isSelected
                  ? "bg-violet-700 text-white shadow-md shadow-violet-700/25 scale-[1.02]"
                  : "bg-neutral-50 hover:bg-violet-50/60 hover:text-violet-950 text-neutral-700 border border-neutral-200/70 hover:border-violet-200/80"
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3 ${
                  isSelected ? "text-violet-200" : "text-neutral-500 group-hover:text-violet-600"
                }`}
                aria-hidden="true"
              />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
