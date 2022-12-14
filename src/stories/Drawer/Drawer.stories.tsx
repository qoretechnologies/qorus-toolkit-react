import { Meta, Story } from '@storybook/react/types-6-0';
import { noop } from 'lodash';
import React, { useState } from 'react';
import { useMount, useUnmount } from 'react-use';
import ReqoreControlGroup from '../../components/ControlGroup';
import { IReqoreDrawerProps, ReqoreDrawer } from '../../components/Drawer';
import ReqoreDropdown from '../../components/Dropdown';
import { IReqoreUIProviderProps } from '../../containers/UIProvider';
import {
  ReqoreButton,
  ReqoreContent,
  ReqoreLayoutContent,
  ReqorePanel,
  ReqoreTabs,
  ReqoreTabsContent,
  ReqoreUIProvider,
} from '../../index';

export default {
  title: 'ReQore/Drawer',
  component: ReqoreDrawer,
  args: {
    theme: {
      main: '#222222',
    },
  },
} as Meta;

const TestComponent = () => {
  useMount(() => {
    console.log('mounted test component');
  });

  useUnmount(() => {
    console.log('unmounted test component');
  });

  return <p> Testing mounting and Unmounting</p>;
};

const Template: Story<IReqoreUIProviderProps & IReqoreDrawerProps> = (
  args: IReqoreUIProviderProps & IReqoreDrawerProps
) => {
  const [drawerData, setDrawerData] = useState<IReqoreDrawerProps>({
    position: 'right',
    isHidden: false,
    resizable: false,
    isOpen: true,
    children: null,
    hidable: true,
    hasBackdrop: false,
    onClose: noop,
    size: '500px',
    maxSize: '80%',
    minSize: '20%',
    flat: false,
    floating: false,
    blur: 0,
    opacity: 1,
  });

  const updateItem = (item: string, value: any) => {
    setDrawerData({
      ...drawerData,
      [item]: value,
    });
  };

  return (
    <ReqoreUIProvider {...args}>
      <ReqoreLayoutContent>
        <ReqoreContent style={{ width: '100%', height: '100%', padding: '20px' }}>
          <ReqoreControlGroup>
            <ReqoreButton
              intent={drawerData.isOpen ? 'success' : undefined}
              onClick={() => updateItem('isOpen', !drawerData.isOpen)}
            >
              Toggle
            </ReqoreButton>
            <ReqoreButton
              intent={drawerData.resizable ? 'success' : undefined}
              onClick={() => updateItem('resizable', !drawerData.resizable)}
            >
              Resizable
            </ReqoreButton>
            <ReqoreButton
              intent={drawerData.hidable ? 'success' : undefined}
              onClick={() => updateItem('hidable', !drawerData.hidable)}
            >
              Hidable
            </ReqoreButton>
            <ReqoreButton
              intent={drawerData.hasBackdrop ? 'success' : undefined}
              onClick={() => updateItem('hasBackdrop', !drawerData.hasBackdrop)}
            >
              Has backdrop
            </ReqoreButton>
            <ReqoreButton
              intent={drawerData.flat ? 'success' : undefined}
              onClick={() => updateItem('flat', !drawerData.flat)}
            >
              Flat
            </ReqoreButton>
            <ReqoreButton
              intent={drawerData.floating ? 'success' : undefined}
              onClick={() => updateItem('floating', !drawerData.floating)}
            >
              Floating
            </ReqoreButton>
            <ReqoreButton
              intent={drawerData.blur ? 'success' : undefined}
              onClick={() => updateItem('blur', drawerData.blur ? 0 : 2)}
            >
              Blur
            </ReqoreButton>
            <ReqoreButton
              intent={drawerData.opacity === 0.5 ? 'success' : undefined}
              onClick={() => updateItem('opacity', drawerData.opacity ? 0.5 : 1)}
            >
              Transparent
            </ReqoreButton>
            <ReqoreDropdown
              items={[
                {
                  label: 'top',
                  onClick: () => updateItem('position', 'top'),
                },
                {
                  label: 'right',
                  onClick: () => updateItem('position', 'right'),
                },
                {
                  label: 'left',
                  onClick: () => updateItem('position', 'left'),
                },
                {
                  label: 'bottom',
                  onClick: () => updateItem('position', 'bottom'),
                },
              ]}
              label={drawerData.position}
            />
          </ReqoreControlGroup>
          <ReqoreDrawer {...drawerData} onClose={() => updateItem('isOpen', false)}>
            <ReqoreTabs
              tabs={[
                { label: 'Tab 1 with some long label', id: 'tab1' },
                { label: 'Tab 2 another long label', id: 'tab2' },
              ]}
            >
              <ReqoreTabsContent tabId='tab1'>
                <TestComponent />
                <ReqorePanel fill title='Tab 1 contents' collapsible flat rounded padded>
                  I am a message a very long message - Shadowlands has mechanisms put in place for
                  allowing players to catch up on Renown, the system of gaining favor and unlocking
                  rewards, Campaign chapters, and soulbinds within your Covenant.
                </ReqorePanel>
                <ReqoreButton>Hello</ReqoreButton>
              </ReqoreTabsContent>
              <ReqoreTabsContent tabId='tab2'>Tab 2 here</ReqoreTabsContent>
            </ReqoreTabs>
          </ReqoreDrawer>
        </ReqoreContent>
      </ReqoreLayoutContent>
    </ReqoreUIProvider>
  );
};

export const Basic = Template.bind({});
Basic.args = {} as IReqoreUIProviderProps & IReqoreDrawerProps;

export const LightColor = Template.bind({});
LightColor.args = {
  theme: {
    main: '#ffffff',
  },
};

export const CustomColor = Template.bind({});
CustomColor.args = {
  theme: {
    main: '#0d0221',
    color: '#2de2e6',
  },
};
