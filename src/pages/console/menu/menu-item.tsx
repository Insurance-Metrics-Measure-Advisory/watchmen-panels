import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import styled from 'styled-components';
import { useTooltip } from '../context/console-tooltip';

const MenuItemContainer = styled.div.attrs({
	'data-widget': 'menu-item-container'
})`
	display: flex;
	position: relative;
	padding: 0 calc((var(--console-menu-width) - var(--console-menu-item-icon-size)) / 2) \
			 0 calc(var(--margin) / 4);
	height: var(--console-menu-height);
	align-items: center;
	cursor: pointer;
	&:hover {
		color: var(--console-primary-color);
		> div:last-child {
			opacity: 1;
		}
	}
	&[data-active=true] {
		> div:first-child {
			color: var(--invert-color);
			background-color: var(--console-primary-color);
		}
	}
	> div:first-child {
		border-radius: var(--border-radius);
		height: 32px;
		display: flex;
		align-items: center;
	}
`;
const MenuItemIcon = styled(FontAwesomeIcon).attrs({
	'data-widget': 'menu-item-icon'
})<{ 'icon-size'?: number }>`
	&[data-widget='menu-item-icon'] {
		width: var(--console-menu-item-icon-size);
		font-size: ${({ 'icon-size': iconSize }) => iconSize != null ? `${iconSize}em` : ''};
	}
`;
const MenuItemLabel = styled.div`
	position: relative;
	flex-grow: 1;
	margin-left: calc((var(--console-menu-width) - 32px) / 2);
	opacity: 0.7;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-variant: petite-caps;
`;

export const MenuItem = (props: {
	icon: IconProp,
	iconSize?: number,
	label: string
	showTooltip: boolean,
	className?: string,
	active?: boolean
}) => {
	const { icon, iconSize, label, showTooltip, className, active } = props;

	const containerRef = useRef<HTMLDivElement>(null);

	const { mouseEnter, mouseLeave } = useTooltip({
		show: showTooltip,
		tooltip: label,
		ref: containerRef,
		rect: ({ left, top }) => ({ x: left + 8, y: top - 24 - (iconSize != null ? 4 : 0), caretLeft: 12 })
	});

	return <MenuItemContainer className={className} data-active={active}
	                          ref={containerRef}
	                          onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
		<div><MenuItemIcon icon={icon} icon-size={iconSize}/></div>
		<MenuItemLabel>{label}</MenuItemLabel>
	</MenuItemContainer>;
};