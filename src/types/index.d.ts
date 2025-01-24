declare type Nullable<T> = T | null;

declare interface FlatListItem<Item> {
  index: number;
  item: Item;
}

declare function vp(size: number): size;
