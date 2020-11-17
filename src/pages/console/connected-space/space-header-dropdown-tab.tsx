import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown, faCube, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ForwardedRef, forwardRef, useReducer, useRef, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import Path from '../../../common/path';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../services/console/types';
import { LinkButton } from '../component/link-button';
import { hideMenu, Menu, MenuItem, MenuState, showMenu, useMenu } from './components';
import { useSpaceContext } from './space-context';
import { TabContainer } from './tabs';

const offset = { offsetX: 6, offsetY: -1 };

export const DropdownTab = forwardRef((props: {
	active: boolean;
	icon: IconProp;
	label?: string;
	onTabClicked: () => void;
	showDropdown: () => void;
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}, ref: ForwardedRef<HTMLDivElement>) => {
	const {
		active,
		icon, label,
		onTabClicked, showDropdown,
		children
	} = props;

	const onMoreClicked = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		showDropdown();
	};

	return <TabContainer active={active} onClick={onTabClicked} ref={ref}>
		<FontAwesomeIcon icon={icon}/>
		<span>{label}</span>
		{children ? <FontAwesomeIcon icon={faCaretDown} onClick={onMoreClicked}/> : null}
		{children}
		<div/>
		<div/>
	</TabContainer>;
});

interface SubjectItem {
	group?: ConsoleSpaceGroup;
	subject: ConsoleSpaceSubject;
}

export const DropdownTabWithData = <T extends ConsoleSpaceGroup | SubjectItem>(props: {
	active: boolean;
	tab: {
		icon: IconProp;
		label: string;
		onClicked: () => void;
	},
	dropdown: {
		items: Array<T>;
		onClicked: (item: T) => void;
		onCloseClicked: (item: T) => void;
		asKey: (item: T) => string;
		asLabel: (item: T) => string;
	}
}) => {
	const {
		active,
		tab: { icon, label, onClicked: onTabClicked },
		dropdown: { items: dropdownItems, onClicked: onItemClicked, onCloseClicked: onItemCloseClicked, asKey: itemAsKey, asLabel: itemAsLabel }
	} = props;

	const containerRef = useRef<HTMLDivElement>(null);
	const [ menuState, setMenuState ] = useState<MenuState>({ left: 0, top: 0, visible: false });
	useMenu({ containerRef, state: menuState, changeState: setMenuState, ...offset });

	const onMenuItemClicked = (item: T) => (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		hideMenu({ containerRef, changeState: setMenuState, ...offset });
		onItemClicked(item);
	};
	const onMenuItemCloseClicked = (item: T) => (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		onItemCloseClicked(item);
	};

	const showDropdown = () => showMenu({ containerRef, state: menuState, changeState: setMenuState, ...offset });

	return <DropdownTab active={active} icon={icon} label={label}
	                    onTabClicked={onTabClicked} showDropdown={showDropdown}
	                    ref={containerRef}>
		{dropdownItems.length !== 0
			? <Menu {...menuState} itemCount={dropdownItems.length}>
				{dropdownItems.map(item => {
					return <MenuItem key={itemAsKey(item)} onClick={onMenuItemClicked(item)}>
						<FontAwesomeIcon icon={icon}/>
						<span>{itemAsLabel(item)}</span>
						<LinkButton onClick={onMenuItemCloseClicked(item)} ignoreHorizontalPadding={true}>
							<FontAwesomeIcon icon={faTimes}/>
						</LinkButton>
					</MenuItem>;
				})}
			</Menu>
			: null}
	</DropdownTab>;
};

export const GroupTab = (props: { space: ConnectedConsoleSpace }) => {
	const { space } = props;

	const location = useLocation();
	const { store: { activeGroupId }, isGroupOpened, openGroupIfCan, closeGroupIfCan } = useSpaceContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const { groups } = space;
	let openedGroups = groups.filter(isGroupOpened).sort((g1, g2) => g1.name.toUpperCase().localeCompare(g2.name.toUpperCase()));
	// eslint-disable-next-line
	const activeGroup = openedGroups.length !== 0 ? openedGroups.find(g => g.groupId == activeGroupId)! : null;

	if (!activeGroup) {
		return null;
	}

	const isGroupsActive = matchPath<{ groupId: string }>(location.pathname, Path.CONSOLE_CONNECTED_SPACE_GROUP);
	openedGroups = openedGroups.filter(g => g !== activeGroup);

	const onGroupTabClicked = () => openGroupIfCan({ space, group: activeGroup });
	const onGroupOpenClicked = (group: ConsoleSpaceGroup) => openGroupIfCan({ space, group });
	const onGroupCloseClicked = (group: ConsoleSpaceGroup) => {
		closeGroupIfCan({ space, group });
		forceUpdate();
	};
	const asKey = (group: ConsoleSpaceGroup) => group.groupId;
	const asLabel = (group: ConsoleSpaceGroup) => group.name;

	const tab = { icon: faCube, label: activeGroup.name, onClicked: onGroupTabClicked };
	const dropdown = {
		items: openedGroups,
		onClicked: onGroupOpenClicked,
		onCloseClicked: onGroupCloseClicked,
		asKey,
		asLabel
	};

	return <DropdownTabWithData active={!!isGroupsActive} tab={tab} dropdown={dropdown}/>;
};

const asSubjectLabel = (data: { group?: ConsoleSpaceGroup, subject: ConsoleSpaceSubject }): string => {
	const { group, subject } = data;
	return group ? `${group.name} / ${subject.name}` : subject.name;
};

export const SubjectTab = (props: { space: ConnectedConsoleSpace }) => {
	const { space } = props;

	const location = useLocation();
	const { store: { activeSubjectId }, isSubjectOpened, openSubjectIfCan, closeSubjectIfCan } = useSpaceContext();
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	const { groups } = space;
	const allSubjects = [
		...space.subjects.map(s => ({
			group: void 0,
			subject: s
		})),
		...groups.map(g => g.subjects.map(s => ({
			group: g,
			subject: s
		}))).flat()
	];
	// eslint-disable-next-line
	let openedSubjects = allSubjects.filter(({ subject }) => isSubjectOpened(subject))
		.sort((s1, s2) => {
			switch (true) {
				case !s1.group && !s2.group:
					return s1.subject.name.toUpperCase().localeCompare(s2.subject.name.toUpperCase());
				case !s1.group && s2.group:
					return -1;
				case s1.group && !s2.group:
					return 1;
				case !!s1.group && !!s2.group:
				default:
					const groupCompare = s1.group!.name.toUpperCase().localeCompare(s2.group!.name.toUpperCase());
					if (groupCompare === 0) {
						return s1.subject.name.toUpperCase().localeCompare(s2.subject.name.toUpperCase());
					} else {
						return groupCompare;
					}
			}
		});
	// eslint-disable-next-line
	const activeSubject = openedSubjects.length !== 0 ? openedSubjects.find(s => s.subject.subjectId == activeSubjectId)! : null;

	if (!activeSubject) {
		return null;
	}

	const isSubjectsActive = matchPath<{ subjectId: string }>(location.pathname, Path.CONSOLE_CONNECTED_SPACE_SUBJECT);
	openedSubjects = openedSubjects.filter(s => s !== activeSubject);

	const onSubjectTabClicked = () => openSubjectIfCan({ space, ...activeSubject });
	const onSubjectOpenClicked = ({ subject, group }: SubjectItem) => {
		openSubjectIfCan({ space, group, subject });
	};
	const onSubjectCloseClicked = ({ subject, group }: SubjectItem) => {
		closeSubjectIfCan({ space, group, subject });
		forceUpdate();
	};
	const asKey = ({ subject }: SubjectItem) => subject.subjectId;
	const asLabel = ({ subject, group }: SubjectItem) => asSubjectLabel({ group, subject });

	const tab = { icon: faCube, label: asSubjectLabel(activeSubject), onClicked: onSubjectTabClicked };
	const dropdown = {
		items: openedSubjects,
		onClicked: onSubjectOpenClicked,
		onCloseClicked: onSubjectCloseClicked,
		asKey,
		asLabel
	};

	return <DropdownTabWithData active={!!isSubjectsActive} tab={tab} dropdown={dropdown}/>;
};