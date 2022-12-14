/* @flow */
import { size as count } from 'lodash';
import React, { useState } from 'react';
import { useUpdateEffect } from 'react-use';
import styled, { css } from 'styled-components';
import { TABLE_SIZE_TO_PX, TSizes } from '../../constants/sizes';
import { IReqoreIntent, IReqoreTheme } from '../../constants/theme';
import ReqoreThemeProvider from '../../containers/ThemeProvider';
import { changeLightness, getReadableColor } from '../../helpers/colors';
import { useReqoreTheme } from '../../hooks/useTheme';
import { IReqoreIconName } from '../../types/icons';
import ReqoreTableBody from './body';
import ReqoreTableHeader, { StyledColumnGroupHeader } from './header';
import { IReqoreTableHeaderStyle, StyledTableHeader } from './headerCell';
import { fixSort, flipSortDirection, sortTableData } from './helpers';

export type TReqoreTableColumnContent =
  | React.FC<{ [key: string]: any; _selectId?: string }>
  | 'time-ago'
  | 'tag'
  | `tag:${IReqoreIntent}`
  | `tag:#${string}`
  | 'title'
  | `title:${IReqoreIntent}`
  | 'text'
  | `text:${IReqoreIntent}`;

export interface IReqoreTableColumn {
  dataId: string;
  header?: string | JSX.Element;
  grow?: 1 | 2 | 3 | 4;
  width?: number;
  content?: TReqoreTableColumnContent;
  props?: React.HTMLAttributes<HTMLDivElement>;
  align?: 'center' | 'left' | 'right';
  columns?: IReqoreTableColumn[];
  sortable?: boolean;
  icon?: IReqoreIconName;
  iconSize?: string;
  tooltip?: string;
  intent?: IReqoreIntent;
  cellTooltip?: (data: { [key: string]: any; _selectId?: string }) => string | JSX.Element;
  onCellClick?: (data: { [key: string]: any; _selectId?: string }) => void;
}

export interface IReqoreTableRowData {
  [key: string]: any;
  _selectId?: string;
  _intent?: IReqoreIntent;
  _disabled?: boolean;
}

export type IReqoreTableRowClick = (data: IReqoreTableRowData) => void;
export type IReqoreTableData = IReqoreTableRowData[];

export interface IReqoreTableProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: IReqoreTableColumn[];
  data?: IReqoreTableData;
  className?: string;
  width?: number;
  height?: number;
  sort?: IReqoreTableSort;
  striped?: boolean;
  selectable?: boolean;
  selected?: string[];
  selectedRowIntent?: IReqoreIntent;
  onSortChange?: (sort?: IReqoreTableSort) => void;
  onSelectedChange?: (selected?: any[]) => void;
  selectToggleTooltip?: string;
  onRowClick?: IReqoreTableRowClick;
  customTheme?: IReqoreTheme;
  rounded?: boolean;
  flat?: boolean;
  size?: TSizes;
}

export interface IReqoreTableStyle {
  theme: IReqoreTheme;
  width?: number;
  striped?: boolean;
  selectable?: boolean;
  rounded?: boolean;
  flat?: boolean;
}

export interface IReqoreTableSort {
  by?: string;
  direction?: 'asc' | 'desc';
}

const StyledTableWrapper = styled.div<IReqoreTableStyle>`
  ${({ theme, width, rounded, flat }: IReqoreTableStyle) => css`
    width: ${width ? `${width}px` : '100%'};

    position: relative;
    clear: both;
    overflow: hidden;
    z-index: 1;

    display: flex;
    flex-flow: column;

    border-radius: ${rounded ? '10px' : undefined};

    background-color: ${theme.main};
    color: ${getReadableColor(theme, undefined, undefined, true)};

    ${!flat &&
    css`
      ${StyledTableHeader}, ${StyledColumnGroupHeader} {
        ${({ theme }: IReqoreTableHeaderStyle) => css`
          border-bottom: 1px solid ${changeLightness(theme.main, 0.07)};
        `}
      }
    `}
  `}
`;

const ReqoreTable = ({
  className,
  height = 300,
  width,
  columns,
  data = [],
  sort,
  onSortChange,
  selectable,
  selected,
  onSelectedChange,
  selectToggleTooltip,
  customTheme,
  rounded,
  onRowClick,
  striped,
  selectedRowIntent,
  size,
  ...rest
}: IReqoreTableProps) => {
  const [leftScroll, setLeftScroll] = useState<number>(0);
  const [_data, setData] = useState<IReqoreTableData>(data || []);
  const [_sort, setSort] = useState<IReqoreTableSort>(fixSort(sort));
  const [_selected, setSelected] = useState<string[]>([]);
  const [_selectedQuant, setSelectedQuant] = useState<'all' | 'none' | 'some'>('none');
  const theme = useReqoreTheme('main', customTheme);

  useUpdateEffect(() => {
    if (onSortChange) {
      onSortChange(_sort);
    }
  }, [_sort]);

  useUpdateEffect(() => {
    setData(data);
  }, [data]);

  useUpdateEffect(() => {
    if (selectable) {
      setSelected(selected);
    }
  }, [selected]);

  useUpdateEffect(() => {
    if (onSelectedChange) {
      onSelectedChange(_selected);
    }

    const selectableData: IReqoreTableData = _data.filter((datum) => datum._selectId ?? false);

    if (count(_selected)) {
      if (count(_selected) === count(selectableData)) {
        setSelectedQuant('all');
      } else {
        setSelectedQuant('some');
      }
    } else {
      setSelectedQuant('none');
    }
  }, [_selected]);

  const handleSortChange = (by?: string) => {
    setSort((currentSort: IReqoreTableSort) => {
      const newSort: IReqoreTableSort = { ...currentSort };

      newSort.by = by;
      newSort.direction =
        currentSort.by === by ? flipSortDirection(currentSort.direction) : currentSort.direction;

      return newSort;
    });
  };

  const handleSelectClick = (selectId: string) => {
    setSelected((current) => {
      let newSelected = [...current];
      const isSelected = newSelected.find((selected) => selectId === selected);

      if (isSelected) {
        newSelected = newSelected.filter((selected) => selected !== selectId);
      } else {
        newSelected = [...newSelected, selectId];
      }

      return newSelected;
    });
  };

  const handleToggleSelectClick = () => {
    switch (_selectedQuant) {
      case 'none':
      case 'some': {
        const selectableData: string[] = _data
          .filter((datum) => datum._selectId ?? false)
          .map((datum) => datum._selectId);

        setSelected(selectableData);
        break;
      }
      default: {
        setSelected([]);
        break;
      }
    }
  };

  return (
    <ReqoreThemeProvider theme={theme}>
      <StyledTableWrapper
        {...rest}
        className={`${className || ''} reqore-table`}
        rounded={rounded}
        width={width}
      >
        <ReqoreTableHeader
          columns={columns}
          leftScroll={leftScroll}
          onSortChange={handleSortChange}
          sortData={_sort}
          selectable={selectable}
          selectedQuant={_selectedQuant}
          onToggleSelectClick={handleToggleSelectClick}
          hasVerticalScroll={count(_data) * TABLE_SIZE_TO_PX[size] > height}
          selectToggleTooltip={selectToggleTooltip}
        />
        <ReqoreTableBody
          data={_sort ? sortTableData(_data, _sort) : _data}
          columns={columns}
          setLeftScroll={setLeftScroll}
          height={height}
          selectable={selectable}
          onSelectClick={handleSelectClick}
          onRowClick={onRowClick}
          selected={_selected}
          selectedRowIntent={selectedRowIntent}
          size={size}
          striped={striped}
          flat={rest.flat}
        />
      </StyledTableWrapper>
    </ReqoreThemeProvider>
  );
};

export default ReqoreTable;
