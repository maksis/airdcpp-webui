import React from 'react';

import History from 'utils/History';
import Loader from 'components/semantic/Loader';

import TopMenuLayout from './TopMenuLayout';
import SideMenuLayout from './SideMenuLayout';

import '../sessions.css';

import SessionNewButton from './SessionNewButton';
import SessionMenuItem from './SessionMenuItem';


const SessionLayout = React.createClass({
	propTypes: {
		/**
		 * Unique ID of the section (used for storing and loading the previously open tab)
		 */
		baseUrl: React.PropTypes.string.isRequired,

		/**
		 * Location object
		 */
		location: React.PropTypes.object.isRequired,

		/**
		 * Item URL
		 */
		itemUrl: React.PropTypes.string.isRequired,

		/**
		 * Array of the items to list
		 */
		items: React.PropTypes.array.isRequired,

		/**
		 * Function receiving an item object that returns the display name
		 */
		itemNameGetter: React.PropTypes.func.isRequired,

		/**
		 * Function receiving an item object that returns header for the currently active item
		 */
		itemHeaderGetter: React.PropTypes.func.isRequired,

		/**
		 * Function receiving an item object that returns the description (subheader) of the item
		 */
		itemDescriptionGetter: React.PropTypes.func,

		/**
		 * Function receiving an item object that returns icon for a item
		 */
		itemIconGetter: React.PropTypes.func.isRequired,

		/**
		 * Function receiving label after the name (unread count etc.)
		 */
		itemLabelGetter: React.PropTypes.func.isRequired,

		/**
		 * Function receiving the circular color label in front of the item
		 */
		itemStatusGetter: React.PropTypes.func.isRequired,

		/**
		 * Function receiving an item object that is called when the close button is pressed
		 */
		itemCloseHandler: React.PropTypes.func.isRequired,

		/**
		 * Item ID that is currently active (if any)
		 */
		activeId: React.PropTypes.any,

		/**
		 * Label for button that opens a new session
		 */
		newButtonCaption: React.PropTypes.any.isRequired,

		/**
		 * Set to false if the side menu should never be shown (the session will use all width that is available)  
		 */
		disableSideMenu: React.PropTypes.bool,
	},

	contextTypes: {
		history: React.PropTypes.object.isRequired
	},
	
	getInitialProps() {
		return {
			sideMenu: true,
		};
	},

	getInitialState() {
		return {
			activeItem: null
		};
	},

	getUrl(id) {
		return '/' + this.props.itemUrl + '/' + id;
	},

	redirectTo(id) {
		History.replaceSidebar(this.props.location, this.getUrl(id));
	},

	findItem(items, id) {
		return items.find(item => item.id == id); // Ignore the type because of local storage
	},

	componentWillReceiveProps(nextProps) {
		if (!nextProps.activeId) {
			return;
		}

		if (this.checkActiveItem(nextProps)) {
			// We got an item
			return;
		}

		// The old tab was closed


		// Find the old position and use the item in that position (if possible)
		const oldItem = this.findItem(this.props.items, this.props.activeId);
		const oldPos = this.props.items.indexOf(oldItem);

		let newItemPos = oldPos;
		if (oldPos === this.props.items.length-1) {
			// The last item was removed
			newItemPos = oldPos-1;
		}

		this.redirectTo(nextProps.items[newItemPos].id);
	},

	// Common logic for selecting the item to display (after mounting or session updates)
	// Returns true active item selection was handled
	// Returns false if the active item couldn't be selected but there are valid items to choose from by the caller
	checkActiveItem(props) {
		// Did we just create this session?
		const { pending } = History.getSidebarData(props.location);

		// Update the active item
		const activeItem = this.findItem(props.items, props.activeId);
		if (activeItem) {
			if (pending) {
				// Disable pending state
				History.replaceSidebarData(props.location, {
					pending: false
				});

				return true;
			}

			this.setState({ activeItem: activeItem });
			localStorage.setItem(props.baseUrl + '_last_active', props.activeId);
			return true;
		} else if (pending) {
			// We'll just display a loading indicator in 'render', no item needed
			return true;
		} else if (props.location.action === 'POP' || props.items.length === 0) {
			// Browsing from history and item removed (or all items removed)... go to "new session" page
			History.replaceSidebar(props.location, this.getNewUrl());
			this.setState({ activeItem: null });
			return true;
		}

		return false;
	},

	getNewUrl() {
		return '/' + this.props.baseUrl + '/new';
	},

	componentWillMount() {
		// Opening an item directly? Or no items?
		if (this.checkActiveItem(this.props)) {
			return;
		}

		// See if we have something stored
		let lastId = localStorage.getItem(this.props.baseUrl + '_last_active');
		if (lastId && this.findItem(this.props.items, lastId)) {
			// Previous session exists
			this.redirectTo(lastId);
		} else if (this.props.items.length > 0) {
			// Load the first session
			this.redirectTo(this.props.items[0].id);
		}
	},

	getMenuItem(item) {
		return (
			<SessionMenuItem 
				key={ item.id } 
				url={this.getUrl(item.id)}
				location={this.props.location}
				nameGetter={this.props.itemNameGetter}
				labelGetter={this.props.itemLabelGetter}
				statusGetter={this.props.itemStatusGetter}
				item={item}
			/>
		);
	},

	render() {
		// Menu items
		const menuItems = this.props.items.map(this.getMenuItem);

		// Children
		let children = this.props.children;
		if (History.getSidebarData(this.props.location).pending) {
			children = <Loader text="Waiting for server response"/>;
		} else if (this.state.activeItem) {
			children = React.cloneElement(children, { 
				item: this.state.activeItem 
			});
		} else if (this.props.activeId) {
			children = <Loader/>;
		}

		/*const newItemProps = {
			key: 'new',
			title: this.props.newButtonLabel,
			//location: this.props.location,
			url: this.getNewUrl(),
			onClick: this.props.onClose,
			//buttonClass: buttonClass,
		};*/

		// New session button
		const newButton = (
			<SessionNewButton 
				key="new-button" 
				title={this.props.newButtonCaption} 
				location={this.props.location} 
				url={this.getNewUrl()} 
			/>
		);

		const Component = this.props.disableSideMenu || window.innerWidth < 500 ? TopMenuLayout : SideMenuLayout;
		return (
			<Component 
				itemIconGetter={ this.props.itemIconGetter }
				itemHeaderGetter={ this.props.itemHeaderGetter }
				itemDescriptionGetter={ this.props.itemDescriptionGetter }
				itemCloseHandler={ () => this.props.itemCloseHandler(this.state.activeItem) }
				activeItem={ this.state.activeItem }

				newButton={ newButton }
				menuItems={ menuItems }
				location={ this.props.location }
			>
				{ children }
			</Component>
		);
	}
});

export default SessionLayout;
