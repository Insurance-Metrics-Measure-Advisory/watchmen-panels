import React, { Fragment, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../common/path';
import { BigButton, ButtonType } from '../component/button';
import { GuideData, useGuideContext } from '../guide/guide-context';

const ObjectsContainer = styled.div`
	display: flex;
	margin: 0 var(--margin);
	border-radius: calc(var(--border-radius) * 2);
	border: var(--border);
	min-height: 350px;
	overflow: hidden;
`;
const ObjectsList = styled.div`
	position: relative;
	width: 30%;
	display: flex;
	flex-direction: column;
	border-right: var(--border);
	&[data-has-data=false] {
		width: 100%;
		border-right: 0;
		> div {
			display: flex;
		}
		+ div {
			display: none;
		}
	}
`;
const ObjectItem = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	height: 32px;
	padding: 0 calc(var(--margin) / 2);
	cursor: pointer;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow-x: hidden;
	border-bottom: var(--border);
	transition: all 300ms ease-in-out;
	&:nth-child(n + 11):last-child {
		border-bottom-color: transparent;
	}
	&:hover {
		background-color: var(--hover-color);
	}
	&[data-active=true] {
		background-color: var(--active-color);
		color: var(--invert-color);
	}
`;
const NoObjects = styled.div`
	display: none;
	height: 100%;
	align-items: center;
	justify-content: center;
	font-size: 1.2em;
	font-weight: var(--font-bold);
	transition: all 300ms ease-in-out;
	&:hover {
		transform: scale(1.05);
	}
	> a {
		margin: 0 calc(var(--margin) / 4);
	}
`;
const ObjectDetail = styled.div`
	width: 70%;
	display: flex;
	flex-direction: column;
	opacity: 0;
	transition: all 300ms ease-in-out;
	&[data-visible=true] {
		opacity: 1;
	}
`;
const ObjectDetailHeader = styled.div`
	display: grid;
	grid-template-columns: 40% 35% 25%;
	border-bottom: var(--border);
`;
const ObjectDetailHeaderCell = styled.div`
	height: 31px;
	padding: 0 calc(var(--margin) / 2);
	display: flex;
	align-items: center;
`;
const Operations = styled.div`
	display: flex;
	margin-top: var(--margin);
	padding: 0 var(--margin);
	> button:not(:first-child) {
		margin-left: var(--margin);
	}
`;
const Placeholder = styled.div`
	flex-grow: 1;
`;

export default () => {
	const history = useHistory();
	const guide = useGuideContext();

	const [ activeKey, setActiveKey ] = useState<string | null>(null);

	const onImportDataClicked = () => {
		history.push(Path.GUIDE_IMPORT_DATA);
	};
	const onNextClicked = () => {
		history.push(Path.GUIDE_MEASURE_INDICATOR);
	};

	const data = (guide.getData() || {}) as GuideData;
	const onObjectSelected = (key: string) => () => setActiveKey(key);

	return <Fragment>
		<ObjectsContainer>
			<ObjectsList data-has-data={Object.keys(data).length !== 0} data-has-active={activeKey != null}>
				{Object.keys(data)
					.sort((k1, k2) => k1.localeCompare(k2))
					.map(key => {
						return <ObjectItem key={key} onClick={onObjectSelected(key)} data-active={key === activeKey}>
							{key}
						</ObjectItem>;
					})}
				<NoObjects>
					No valid data imported, back and <Link to={Path.GUIDE_IMPORT_DATA}>Import Data</Link> again.
				</NoObjects>
			</ObjectsList>
			<ObjectDetail data-visible={activeKey != null}>
				<ObjectDetailHeader>
					<ObjectDetailHeaderCell>Name</ObjectDetailHeaderCell>
					<ObjectDetailHeaderCell>Label</ObjectDetailHeaderCell>
					<ObjectDetailHeaderCell>Type</ObjectDetailHeaderCell>
				</ObjectDetailHeader>
			</ObjectDetail>
		</ObjectsContainer>
		<Operations>
			<BigButton onClick={onImportDataClicked}>Reimport Data</BigButton>
			<Placeholder/>
			<BigButton inkType={ButtonType.PRIMARY} onClick={onNextClicked}>Next</BigButton>
		</Operations>
	</Fragment>;
}