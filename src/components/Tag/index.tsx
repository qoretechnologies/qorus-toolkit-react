import _size from 'lodash/size';
import React, { forwardRef, useContext, useRef } from 'react';
import styled, { css } from 'styled-components';
import { ReqorePopover } from '../..';
import {
  PADDING_FROM_SIZE,
  RADIUS_FROM_SIZE,
  SIZE_TO_PX,
  TEXT_FROM_SIZE,
  TSizes,
} from '../../constants/sizes';
import { IReqoreIntent, IReqoreTheme } from '../../constants/theme';
import ThemeContext from '../../context/ThemeContext';
import { changeLightness, getReadableColor, getReadableColorFrom } from '../../helpers/colors';
import { useCombinedRefs } from '../../hooks/useCombinedRefs';
import usePopover from '../../hooks/usePopover';
import { IReqoreTooltip } from '../../types/global';
import { IReqoreIconName } from '../../types/icons';
import ReqoreIcon from '../Icon';

export interface IReqoreTagAction {
  icon: IReqoreIconName;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  tooltip?: IReqoreTooltip;
  intent?: IReqoreIntent;
}

export interface IReqoreTagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  size?: TSizes;
  label?: string;
  onRemoveClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  icon?: IReqoreIconName;
  rightIcon?: IReqoreIconName;
  color?: string;
  tooltip?: IReqoreTooltip;
  disabled?: boolean;
  actions?: IReqoreTagAction[];
  width?: string;
  badge?: boolean;
  intent?: IReqoreIntent;
}

export interface IReqoreTagStyle extends IReqoreTagProps {
  theme: IReqoreTheme;
  removable?: boolean;
  interactive?: boolean;
}

export const StyledTag = styled.div<IReqoreTagStyle>`
  display: inline-flex;
  justify-content: center;
  flex-shrink: 0;
  align-items: center;
  font-family: system-ui;
  font-weight: 600;
  overflow: hidden;
  font-size: ${({ size }) => TEXT_FROM_SIZE[size]}px;
  height: ${({ size }) => SIZE_TO_PX[size]}px;
  min-width: ${({ size }) => SIZE_TO_PX[size]}px;
  border-radius: ${({ badge, size }) => (badge ? 20 : RADIUS_FROM_SIZE[size])}px;
  width: ${({ width }) => width || undefined};

  ${({ theme, color }) =>
    css`
      background-color: ${color || changeLightness(theme.main, 0.1)};
      color: ${color ? getReadableColorFrom(color) : getReadableColor(theme, undefined, undefined)};
      }
    `}

  ${({ theme, color, interactive }) =>
    interactive &&
    css`
      cursor: pointer;
      &:hover {
        background-color: ${changeLightness(color || theme.main, color ? 0.05 : 0.15)};
        color: ${color
          ? getReadableColorFrom(color)
          : getReadableColor(theme, undefined, undefined)};
      }
    `}


  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
      cursor: not-allowed;
    `}
`;

const StyledTagContentWrapper = styled.div<{ size: TSizes }>`
  padding: 0 ${({ size }) => PADDING_FROM_SIZE[size]}px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  flex: 1;
  overflow: hidden;
`;

const StyledTagContent = styled.span<{ size: TSizes }>`
  height: 100%;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledButtonWrapper = styled.div<IReqoreTagStyle>`
  flex-shrink: 0;
  font-size: ${({ size }) => TEXT_FROM_SIZE[size]}px;
  height: ${({ size }) => SIZE_TO_PX[size]}px;
  width: ${({ size }) => SIZE_TO_PX[size]}px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease-out;

  ${({ theme, color }) =>
    css`
      .reqore-icon {
        transform: scale(0.85);
      }
      &:hover {
        cursor: pointer;
        background-color: ${changeLightness(color || theme.main, color ? 0.09 : 0.19)};

        .reqore-icon {
          transform: scale(1);
        }
      }
    `}
`;

const ReqoreTag = forwardRef(
  (
    {
      tooltip,
      label,
      icon,
      rightIcon,
      className,
      onClick,
      size = 'normal',
      onRemoveClick,
      actions,
      badge,
      intent,
      color,
      ...rest
    }: IReqoreTagProps,
    ref
  ) => {
    const innerRef = useRef(null);
    const combinedRef = useCombinedRefs(innerRef, ref);
    const theme: IReqoreTheme = useContext<IReqoreTheme>(ThemeContext);

    usePopover({
      ...tooltip,
      targetElement: combinedRef.current,
      show: !!tooltip?.content,
    });

    // If color or intent was specified, set the color
    const customColor = intent ? theme.intents[intent] : color;

    return (
      <StyledTag
        {...rest}
        color={customColor}
        className={`${className || ''} reqore-tag`}
        size={size}
        ref={combinedRef}
        badge={badge}
        removable={!!onRemoveClick}
        interactive={!!onClick && !rest.disabled}
      >
        <StyledTagContentWrapper size={size} className='reqore-tag-content' onClick={onClick}>
          {icon && (
            <ReqoreIcon
              icon={icon}
              size={`${TEXT_FROM_SIZE[size]}px`}
              margin={label || rightIcon ? 'right' : undefined}
            />
          )}
          {label && <StyledTagContent size={size}>{label}</StyledTagContent>}
          {rightIcon && (
            <ReqoreIcon
              icon={rightIcon}
              size={`${TEXT_FROM_SIZE[size]}px`}
              margin={label ? 'left' : undefined}
            />
          )}
        </StyledTagContentWrapper>
        {_size(actions)
          ? actions.map((action) => (
              <>
                <ReqorePopover
                  {...action.tooltip}
                  component={StyledButtonWrapper}
                  componentProps={{
                    size,
                    color: customColor,
                    className: 'reqore-tag-action',
                    onClick: action.onClick,
                  }}
                  noWrapper
                >
                  <ReqoreIcon icon={action.icon} size={`${TEXT_FROM_SIZE[size]}px`} />
                </ReqorePopover>
              </>
            ))
          : null}
        {onRemoveClick && !rest.disabled ? (
          <ReqorePopover
            component={StyledButtonWrapper}
            componentProps={{
              size,
              color: customColor,
              className: 'reqore-tag-remove',
              onClick: onRemoveClick,
            }}
            noWrapper
            content='Remove'
          >
            <ReqoreIcon icon='CloseLine' size={`${TEXT_FROM_SIZE[size]}px`} />
          </ReqorePopover>
        ) : null}
      </StyledTag>
    );
  }
);

export default ReqoreTag;
