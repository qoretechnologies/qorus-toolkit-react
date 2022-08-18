import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FlowDesignerState } from './State';

export default {
  title: 'FlowDesigner/State',
} as ComponentMeta<typeof FlowDesignerState>;

const Template: ComponentStory<typeof FlowDesignerState> = ({}) => {
  return <FlowDesignerState />;
};

export const Default = Template.bind({});
