import React, { useRef } from 'react';
import styled from 'styled-components';
import { useTooltipContext } from '../context/console-tooltip';

const Button = styled.button<{ 'ignore-horizontal-padding'?: boolean }>`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: center;
	padding: 4px ${({ 'ignore-horizontal-padding': ignoreHorizontalPadding }) => ignoreHorizontalPadding ? '4px' : 'calc(var(--margin) / 2)'};
	border: 0;
	appearance: none;
	outline: none;
	background-color: transparent;
	cursor: pointer;
	&:before {
		content: '';
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: var(--border-radius);
		background-color: transparent;
		opacity: 0.2;
		transition: all 300ms ease-in-out;
		z-index: -1;
	}
	&:hover:before {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--console-waive-color);
	}
`;

export const LinkButton = (props: {
	tooltip?: string;
	ignoreHorizontalPadding?: boolean;
	children: ((props: any) => React.ReactNode) | React.ReactNode
}) => {
	const { tooltip, children, ignoreHorizontalPadding } = props;

	const buttonRef = useRef<HTMLButtonElement>(null);
	const tooltipContext = useTooltipContext();

	const onMouseEnter = () => {
		if (!buttonRef.current || !tooltip) {
			return;
		}

		const { top, left } = buttonRef.current.getBoundingClientRect();
		tooltipContext.show(tooltip, { x: left, y: top - 36, caretLeft: 12 });
	};

	return <Button ignore-horizontal-padding={ignoreHorizontalPadding}
	               onMouseEnter={onMouseEnter} onMouseLeave={tooltipContext.hide}
	               ref={buttonRef}>
		{children}
	</Button>;
};