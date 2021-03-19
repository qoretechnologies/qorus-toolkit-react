import React, { useEffect, useMemo, useState } from 'react';
import { IReqoreComponent } from '../../types/global';
import ReqoreInput from '../Input';
import ReqoreMenu from '../Menu';
import ReqoreMenuItem, { IReqoreMenuItemProps } from '../Menu/item';

export interface IReqoreDropdownListProps extends IReqoreComponent {
  items?: IReqoreMenuItemProps[];
  multiSelect?: boolean;
  listStyle?: React.CSSProperties;
  width?: string;
  filterable?: boolean;
}

const ReqoreDropdownList = ({
  items,
  multiSelect,
  listStyle,
  _popoverId,
  filterable,
  width,
}: IReqoreDropdownListProps) => {
  const [_items, setItems] = useState<IReqoreMenuItemProps[]>(items);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    setItems(items);
  }, [items]);

  const filteredItems: IReqoreMenuItemProps[] = useMemo(() => {
    if (!filterable || query === '') {
      return _items;
    }

    return _items.filter((item) => {
      const text = item.label || item.children;

      if (!text) {
        return false;
      }

      return text.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
  }, [items, query]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <ReqoreMenu
      _insidePopover={!multiSelect}
      _popoverId={_popoverId}
      style={listStyle}
      width={width}
    >
      {filterable && (
        <ReqoreInput
          value={query}
          onChange={handleQueryChange}
          placeholder='Filter'
          autoFocus
          onClearClick={() => setQuery('')}
        />
      )}
      {filteredItems.map((item: IReqoreMenuItemProps, index: number) => (
        <ReqoreMenuItem
          key={index}
          {...item}
          rightIcon={item.selected ? 'CheckLine' : undefined}
        />
      ))}
    </ReqoreMenu>
  );
};

export default ReqoreDropdownList;
