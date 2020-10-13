import { faFlagCheckered, faTruckPickup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

export enum Step {
	DOMAIN_SELECT,
	IMPORT_DATA,
	MAPPING_FACTORS,
	MEASURE_INDICATORS,
	BUILD_METRICS,
	EXPORT_REPORTS
}

const StepLabels = [ 'Domain Select', 'Import Data', 'Mapping Factors', 'Measure Indicators', 'Metrics Reporting', 'Export' ];

const Steps = styled.div`
	position: relative;
	padding: 0 var(--page-margin);
	display: flex;
	flex-direction: column;
	padding-bottom: 1em;
`;
const CurrentStep = styled.div`
	font-size: 1.7em;
	line-height: 1.7em;
	font-weight: var(--font-boldest);
`;
const StepDots = styled.ul`
	list-style-type: none;
	margin-block-start: 0;
	margin-block-end: 0;
	padding-inline-start: 0;
	position: relative;
	display: flex;
	align-items: center;
`;
const StepDot = styled.li`
	height: 8px;
	width: 8px;
	border-radius: 100%;
	background-color: var(--border-color);
	color: var(--border-color);
	border: var(--border);
	font-size: 12px;
	transition: all 300ms 100ms ease-in-out;
	&:not(:first-child) {
		position: relative;
		margin-left: calc(var(--page-margin) * 2);
		&:before {
			content: '';
			display: block;
			position: absolute;
			left: calc(var(--page-margin) * -2 - 1px);
			top: 50%;
			transform: translateY(-50%);
			width: calc(var(--page-margin) * 2);
			height: 1px;
			background-color: var(--border-color);
			z-index: -1;
		}
	}
	&[data-current=true],
	&[data-performed=true] {
		color: var(--font-color);
		background-color: var(--font-color);
		border-color: var(--font-color);
		&:before {
			background-color: var(--font-color);
		}
	}
	&:nth-last-child(2),
	&[data-current=true] {
		 border-color: transparent;
		 background-color: transparent;
	}
	> svg {
		transform: translateY(-4px);
	}
`;
const Current = styled.div<{ step: number }>`
	position: absolute;
	left: calc((8px + var(--page-margin) * 2) * ${({ step }) => step} - 1px);
	transition: left 300ms ease-in-out;
`;

export default (props: { step: Step }) => {
	const { step } = props;

	return <Steps>
		<CurrentStep>{StepLabels[step]}</CurrentStep>
		<StepDots>
			{StepLabels.map((label, index) => {
				let icon;
				if (index === step) {
				} else if (index === Step.EXPORT_REPORTS) {
					icon = <FontAwesomeIcon icon={faFlagCheckered}/>;
				}

				return <StepDot key={label} title={label} data-current={index === step} data-performed={index < step}>
					{icon}
				</StepDot>;
			})}
			<Current step={step}><FontAwesomeIcon icon={faTruckPickup}/></Current>
		</StepDots>
	</Steps>;
}