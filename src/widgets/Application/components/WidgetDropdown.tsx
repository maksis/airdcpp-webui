import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import MenuItemLink from 'components/semantic/MenuItemLink';

import WidgetActions from 'actions/ui/WidgetActions';
import WidgetStore from 'stores/WidgetStore';

import * as UI from 'types/ui';
import { TFunction } from 'i18next';
import { translateWidgetName } from 'utils/WidgetUtils';
import { ActionHandlerDecorator, ActionClickHandler } from 'decorators/ActionHandlerDecorator';


const getWidgetItem = (
  widgetInfo: UI.Widget,
  t: TFunction, 
  onClickAction: ActionClickHandler<UI.Widget>
) => {
  return (
    <MenuItemLink 
      key={ widgetInfo.typeId }
      onClick={ () => onClickAction({
        actionId: 'create',
        action: WidgetActions.create.actions.create!,
        itemData: widgetInfo,
        moduleId: WidgetActions.create.moduleId
      }) }
      icon={ widgetInfo.icon }
    >
      { translateWidgetName(widgetInfo, t) }
    </MenuItemLink>
  );
};

export type WidgetDropdownProps = Pick<UI.WidgetProps, 'componentId' | 'widgetT'>;

const WidgetDropdown: React.FC<WidgetDropdownProps> = (
  { componentId, widgetT }
) => (
  <Dropdown 
    caption={ widgetT.translate('Add widget...') }
    className="create-widget"
    button={ true }
    contextElement={ `.${componentId}` }
  >
    <ActionHandlerDecorator>
      { ({ onClickAction }) => {
        return WidgetStore.widgets
          .filter(widgetInfo => !widgetInfo.alwaysShow)
          .map(widgetInfo => getWidgetItem(widgetInfo, widgetT.plainT, onClickAction)); 
      } }
    </ActionHandlerDecorator>
  </Dropdown>
);

export default WidgetDropdown;