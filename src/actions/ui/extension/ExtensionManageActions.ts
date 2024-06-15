import SocketService from 'services/SocketService';

import ExtensionConstants from 'constants/ExtensionConstants';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { MENU_DIVIDER } from 'constants/ActionConstants';

type Filter = UI.ActionFilter<API.Extension>;
const isManaged: Filter = ({ itemData: extension }) => extension.managed;
const isRunning: Filter = ({ itemData: extension }) => extension.running;
const hasSettings: Filter = ({ itemData: extension }) => extension.has_settings;

const canStart: Filter = (data) => isManaged(data) && !isRunning(data);
const canStop: Filter = (data) => isManaged(data) && isRunning(data);

const handleConfigure: UI.ActionHandler<API.Extension> = ({
  itemData: extension,
  navigate,
}) => {
  navigate(`extensions/${extension.id}`);
};

const handleStart: UI.ActionHandler<API.Extension> = ({ itemData: extension }) => {
  return SocketService.post(
    `${ExtensionConstants.EXTENSIONS_URL}/${extension.name}/start`,
  );
};

const handleStop: UI.ActionHandler<API.Extension> = ({ itemData: extension }) => {
  return SocketService.post(
    `${ExtensionConstants.EXTENSIONS_URL}/${extension.name}/stop`,
  );
};

const handleRemove: UI.ActionHandler<API.Extension> = ({ itemData }) => {
  return SocketService.delete(ExtensionConstants.EXTENSIONS_URL + '/' + itemData.name);
};

export const ExtensionStartAction = {
  id: 'start',
  displayName: 'Start',
  icon: IconConstants.PLAY,
  filter: canStart,
  access: API.AccessEnum.ADMIN,
  handler: handleStart,
};

export const ExtensionStopAction = {
  id: 'stop',
  displayName: 'Stop',
  icon: IconConstants.STOP,
  filter: canStop,
  access: API.AccessEnum.ADMIN,
  handler: handleStop,
};

export const ExtensionConfigureAction = {
  id: 'configure',
  displayName: 'Configure',
  icon: IconConstants.EDIT,
  filter: hasSettings,
  access: API.AccessEnum.SETTINGS_EDIT,
  handler: handleConfigure,
};

export const ExtensionRemoveAction = {
  id: 'remove',
  displayName: 'Uninstall',
  icon: IconConstants.REMOVE,
  filter: isManaged,
  access: API.AccessEnum.ADMIN,
  confirmation: {
    content:
      // eslint-disable-next-line max-len
      'Are you sure that you want to remove the extension {{item.name}}? This will also remove possible extension-specific settings.',
    approveCaption: 'Remove extension',
    rejectCaption: `Don't remove`,
  },
  handler: handleRemove,
};

const ExtensionManageActions: UI.ActionListType<API.Extension> = {
  start: ExtensionStartAction,
  stop: ExtensionStopAction,
  configure: ExtensionConfigureAction,
  divider: MENU_DIVIDER,
  remove: ExtensionRemoveAction,
};

export const ExtensionManageActionModule = {
  moduleId: UI.Modules.EXTENSIONS,
};

export const ExtensionManageActionsMenu = {
  moduleData: ExtensionManageActionModule,
  actions: ExtensionManageActions,
};
