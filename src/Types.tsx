// Define Color Items
export interface ColorItems {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderColor: string;
  sheetBackground: string;
  itemBackground: string;
}

// Define Layout Items
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
  template?: boolean;
  label?: string;
  title?: string;
  data?: string[][];
  colSizes?: (number | null)[];
}

// Define Layouts
export interface Layouts {
  [key: string]: LayoutItem[];
}

// Define Tabs
export interface Tab {
  id: string;
  label: string;
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

// Props for DropDrag
export interface SheetProps {
  tabId: string;
  editMode: boolean;
  className?: string;
  rowHeight?: number;
  cols?: { [key: string]: number };
  breakpoints?: { [key: string]: number };
  containerPadding?: [number, number] | { [key: string]: [number, number] };
  containerMargin?: [number, number] | { [key: string]: [number, number] };
  onLayoutChange?: (layout: LayoutItem[], layouts: Layouts) => void;
  toggleEditMode?: () => void;
}

// Base props for components using LayoutItem and updateItem
export interface ComponentProps {
  layoutItem: LayoutItem;
  updateItem: (id: string, field: string, value: string) => void;
}

// Props for TextList component
export interface TextListProps extends ComponentProps {
  removeItem: (id: string, rowIndex: number, colIndex: number) => void;
  addItem: (id: string, rowIndex: number, value: string) => void;
}

// Props for TextTable component
export interface TextTableProps extends TextListProps {
  updateColSize: (id: string, colIndex: number, size: number) => void;
}