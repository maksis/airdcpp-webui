'use strict';
import React from 'react';

import ListBrowser from './ListBrowser';
import FilelistFooter from './FilelistFooter';

import { LocationContext } from 'mixins/RouterMixin';

import Loader from 'components/semantic/Loader';
import Message from 'components/semantic/Message';


const FilelistSession = React.createClass({
	mixins: [ LocationContext ],
	render() {
		const { user, location, state } = this.props.item;

		if (user.flags.indexOf('offline') !== -1 && user.flags.indexOf('me') === -1) {
			return (
				<Message 
					title="User offline"
					description="You will be able to continue browsing when the user comes back online"
				/>
			);
		}

		if ((state.id !== 'loaded' && state.id !== 'download_failed') || !location) {
			return <Loader text={ state.str }/>;
		}

		return (
			<div className="filelist-session">
				<ListBrowser
					{ ...this.props }
				/>

				<FilelistFooter
					item={ this.props.item }
				/>
			</div>
		);
	},
});

export default FilelistSession;
