import React, { useEffect, useState } from 'react';
import BackgroundImage from '../../../../assets/console-inbox-background.png';
import { Mail } from '../../../../services/console/types';
import { useNotImplemented } from '../../../context/not-implemented';
import { useConsoleContext } from '../../context/console-context';
import { MessagesContainer } from '../common/container';
import { ItemList } from '../common/item';
import { Tabs } from '../common/tabs';
import { Title } from '../common/title';
import { ActiveTab, State } from '../common/types';
import { MailItem } from './mail-item';

export const Inbox = () => {
	const notImpl = useNotImplemented();
	const context = useConsoleContext();
	const [ state, setState ] = useState<State>({
		active: ActiveTab.UNREAD,
		readInitialized: false,
		unreadInitialized: false
	});
	// load data only when state change
	useEffect(() => {
		(async () => {
			if (state.active === ActiveTab.UNREAD && !state.unreadInitialized) {
				await context.mails.fetchUnread();
				setState({ ...state, unreadInitialized: true });
			} else if (state.active === ActiveTab.READ && !state.readInitialized) {
				await context.mails.fetchRead();
				setState({ ...state, readInitialized: true });
			}
		})();
		// eslint-disable-next-line
	}, [ state ]);

	const onTabClicked = (activeTab: ActiveTab) => () => {
		if (activeTab !== state.active) {
			setState({ ...state, active: activeTab });
		}
	};

	return <MessagesContainer background-image={BackgroundImage}>
		<Title title='Inbox' onSettingsClicked={notImpl.show}/>
		<Tabs state={state}
		      onUnreadClicked={onTabClicked(ActiveTab.UNREAD)} onReadClicked={onTabClicked(ActiveTab.READ)}
		      onClearClicked={context.mails.readAll}/>
		<ItemList data={context.mails.unread}
		          allLoaded={context.mails.allUnreadLoaded}
		          visible={state.active === ActiveTab.UNREAD}
		          noData='No mails.'>
			{context.mails.unread.map((item: Mail, index: number) => {
				return <MailItem data={item} readable={true} key={`${item.createDate}-${index}`}/>;
			})}
		</ItemList>
		<ItemList data={context.mails.read} allLoaded={context.mails.allReadLoaded}
		          visible={state.active === ActiveTab.READ}
		          noData='No mails.'>
			{context.mails.read.map((item: Mail, index: number) => {
				return <MailItem data={item} readable={false} key={`${item.createDate}-${index}`}/>;
			})}
		</ItemList>
	</MessagesContainer>;
};