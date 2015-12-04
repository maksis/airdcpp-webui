import React from 'react';

import TypeConvert from 'utils/TypeConvert';
import { UserMenu } from 'components/Menu';
import { UserIconFormatter } from 'utils/IconFormat';

export default (ItemHandler, itemMenuIds) => {
	const UserItemHandlerDecorator = {
		itemNameGetter(session) {
			return session.user.nicks;
		},

		itemStatusGetter(session) {
			const { flags } = session.user;
			return TypeConvert.userOnlineStatusToColor(flags);
		},

		itemDescriptionGetter(session) {
			return session.user.hub_names;
		},

		itemIconGetter(session) {
			return <UserIconFormatter size="large" flags={session.user.flags} />;
		},

		itemHeaderGetter(session, location) {
			const { user } = session;
			return (
				<UserMenu 
					location={ location }
					user={ user } 
					ids={ itemMenuIds }
				/>
			);
		},
	};

	return Object.assign(ItemHandler, UserItemHandlerDecorator);
};