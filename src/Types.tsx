// Define layout items
export interface LayoutItem {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
  static?: boolean;
  isDraggable?: boolean;
  title?: string; // Add title field
  description?: string; // Add description field
}

//Define layouts
export interface Layouts {
  [key: string]: LayoutItem[];
}

// Props for ToolBoxItem
export interface ToolBoxItemProps {
  item: LayoutItem;
  onTakeItem: (item: LayoutItem) => void;
  onRemoveItem: (item: LayoutItem) => void;
}

// Props for ToolBox
export interface ToolBoxProps {
  items: LayoutItem[];
  onTakeItem: (item: LayoutItem) => void;
  onRemoveItem: (item: LayoutItem) => void;
}

// Props for DropDrag
export interface Props {
  className?: string;
  rowHeight?: number;
  cols?: { [key: string]: number };
  breakpoints?: { [key: string]: number };
  containerPadding?: [number, number] | { [key: string]: [number, number] };
  verticalCompact?: boolean;
  onLayoutChange?: (layout: LayoutItem[], layouts: Layouts) => void;
}