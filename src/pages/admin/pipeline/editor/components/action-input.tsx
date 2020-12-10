import styled from 'styled-components';
import Input from '../../../../component/input';

export const ActionInput = styled(Input)`
	height: 24px;
	line-height: 22px;
	padding-top: 0;
	padding-bottom: 0;
	font-size: 0.8em;
	color: var(--console-font-color);
	&:hover,
	&:focus {
		border-color: transparent;
		box-shadow: var(--console-primary-hover-shadow);
	}
`;
