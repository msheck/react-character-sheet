// Props for ColorItems
export interface ColorItems {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  sheetBackground: string;
  itemBackground: string;
  accentBackground: string;
}

// Define layout items
export interface LayoutItem {
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  i: string;
  type?: string;
  isLocked?: boolean;
  static?: boolean;
  isDraggable?: boolean;
  template?: boolean;
  label?: string;
  title?: string;
  data?: string[][];
  colSizes?: (number | null)[];
}

// Define layouts
export interface Layouts {
  [key: string]: LayoutItem[];
}

// Props for ToolboxItem
export interface ToolboxItemProps {
  item: LayoutItem;
  onTakeItem: (item: LayoutItem) => void;
  onRemoveItem: (item: LayoutItem) => void;
}

// Props for Toolbox
export interface ToolboxProps {
  items: LayoutItem[];
  onTakeItem: (item: LayoutItem) => void;
  onRemoveItem: (item: LayoutItem) => void;
}

// Props for GridItem
export interface GridItemProps {
  layoutItem: LayoutItem;
  editMode: boolean;
  onPutItem: (item: LayoutItem) => void;
  allowEditItem: (id: string) => void;
  updateItem: (id: string, field: string, value: string) => void;
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