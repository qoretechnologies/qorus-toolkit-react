import { IReqoreTheme } from '@qoretechnologies/reqore/dist/constants/theme';
import styled from 'styled-components';

export const StyledFlowDesignerState = styled.div<{ theme: IReqoreTheme }>`
  background-color: ${(props: { theme: IReqoreTheme }) => props.theme.main};
  color: ${(props: { theme: IReqoreTheme }) => props.theme.text.color};
`;

export const FlowDesignerState = () => {
  return <StyledFlowDesignerState> This is a test </StyledFlowDesignerState>;
};
