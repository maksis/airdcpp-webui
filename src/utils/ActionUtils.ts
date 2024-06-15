import LoginStore from 'stores/LoginStore';
import invariant from 'invariant';

import * as UI from 'types/ui';

import { textToI18nKey, toArray, translate } from './TranslationUtils';
import NotificationActions from 'actions/NotificationActions';

export const actionFilter = <
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
>(
  action: UI.ActionDefinition<ItemDataT, EntityT>,
  itemData?: ItemDataT,
  entity?: EntityT,
) => {
  return (
    !itemData || !action.filter || action.filter({ itemData, entity: entity as EntityT })
  );
};

export const actionAccess = <ItemDataT extends UI.ActionDataValueType>(
  action: Pick<UI.ActionDefinition<ItemDataT>, 'access'>,
) => {
  //invariant(
  //  !action.hasOwnProperty('access') || action.access,
  //  `Invalid access supplied for an action ${action.displayName}`
  //);

  return !action.access || LoginStore.hasAccess(action.access);
};

export const showAction = <
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
>(
  action: UI.ActionDefinition<ItemDataT, EntityT>,
  itemData?: ItemDataT,
) => {
  return actionFilter(action, itemData) && actionAccess(action);
};

export const toActionI18nKey = (
  action: UI.ActionDefinition<any, any>,
  moduleId: string | string[],
) => {
  invariant(!!action.displayName, 'Invalid action');
  return textToI18nKey(action.displayName!, [
    ...toArray(moduleId),
    UI.SubNamespaces.ACTIONS,
  ]);
};

type SocketActionHandler = () => Promise<any>;

export const runBackgroundSocketAction = (
  handler: SocketActionHandler,
  t: UI.TranslateF,
): Promise<any> => {
  return handler().catch((e) => {
    NotificationActions.apiError(translate('Action failed', t, UI.Modules.COMMON), e);
  });
};
