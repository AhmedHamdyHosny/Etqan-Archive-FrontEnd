export interface GenericDataFormat {
  filters: FilterItem[];
  sorts: SortItems[];
  // includes: IncludeItems | null | undefined;
  paging: PagingItem;
}

export interface FilterItem {
  property: string;
  value: any;
  operation:
    | 'Equal'
    | 'NotEqual'
    | 'GreaterThan'
    | 'LessThan'
    | 'GreaterThanOrEqual'
    | 'LessThanOrEqual'
    | 'Like';
  logicalOperation: 'And' | 'Or';
}

export interface SortItems {
  property: string;
  sortType: 'Asc' | 'Desc';
  priority: number;
}

export interface IncludeItems {
  properties: string;
  references: string;
}

export interface PagingItem {
  pageNumber: number;
  pageSize: number;
}


export class CustomSelectListItem {
  text: string;
  altText: string | undefined;
  value: string;
  selected: boolean = false;
  relatedItems: CustomSelectListItem[] = [];

  constructor(text: string, value:string, selected:boolean = false){
      this.text = text;
      this.value = value;
      this.selected = selected;
  }
}
