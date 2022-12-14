import React, { ReactElement, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { TSizes } from '../../constants/sizes';
import { IReqoreIntent } from '../../constants/theme';
import { IReqoreIconName } from '../../types/icons';
import ReqoreTabsList from './list';

export interface IReqoreTabsListItem {
  label: string;
  icon?: IReqoreIconName;
  as?: any;
  disabled?: boolean;
  id: string | number;
  tooltip?: string;
  props?: React.HTMLAttributes<any>;
  onClick?: (event: any) => any;
  onCloseClick?: (id: string | number) => any;
  activeIntent?: IReqoreIntent;
  intent?: IReqoreIntent;
  closeIcon?: IReqoreIconName;
}

export interface IReqoreTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: IReqoreTabsListItem[];
  activeTab?: string | number;
  onTabChange?: (tabId: string | number) => any;
  children?: ReactElement<any>[] | ReactElement<any>;
  fill?: boolean;
  fillParent?: boolean;
  vertical?: boolean;
  activeTabIntent?: IReqoreIntent;
  wrapTabNames?: boolean;
  flat?: boolean;
  size?: TSizes;
  width?: string;

  // Internal prop, ignore!
  _testWidth?: number;
}

const StyledTabs = styled.div<Partial<IReqoreTabsProps>>`
  display: flex;
  ${({ vertical, fillParent, width }) => css`
    width: ${width ? `${width}px` : '100%'};
    height: ${fillParent ? '100%' : undefined};
    flex-flow: ${vertical ? 'row' : 'column'};
  `}
`;

const ReqoreTabs = ({
  tabs,
  activeTab,
  children,
  className,
  onTabChange,
  fill,
  _testWidth,
  vertical,
  activeTabIntent,
  flat,
  size = 'normal',
  width,
  wrapTabNames,
  ...rest
}: IReqoreTabsProps) => {
  const [_activeTab, setActiveTab] = useState<string | number>(activeTab || tabs[0].id);

  useEffect(() => {
    if (activeTab || activeTab === 0) {
      setActiveTab(activeTab);

      if (onTabChange) {
        onTabChange(activeTab);
      }
    }
  }, [activeTab]);

  return (
    <StyledTabs
      {...rest}
      width={width}
      vertical={vertical}
      className={`${className || ''} reqore-tabs`}
    >
      <ReqoreTabsList
        tabs={tabs}
        flat={flat}
        fill={fill}
        size={size}
        width={width}
        vertical={vertical}
        _testWidth={_testWidth}
        activeTab={_activeTab}
        wrapTabNames={wrapTabNames}
        activeTabIntent={activeTabIntent}
        onTabChange={(tabId: string | number) => {
          setActiveTab(tabId);

          if (onTabChange) {
            onTabChange(tabId);
          }
        }}
      />
      {React.Children.map(children, (child) =>
        child && child.props?.tabId === _activeTab ? child : null
      )}
    </StyledTabs>
  );
};

export default ReqoreTabs;
