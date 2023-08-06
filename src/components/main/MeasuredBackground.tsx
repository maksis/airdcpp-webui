import React from 'react';
import Measure from 'react-measure';

import { LocalSettings } from 'constants/SettingConstants';
import { LayoutWidthContext } from 'context/LayoutWidthContext';
import LocalSettingStore from 'stores/LocalSettingStore';
import { useMobileLayout } from 'utils/BrowserUtils';

import Background1500px from '../../../resources/images/background_winter_1500px.jpg';
import Background3840px from '../../../resources/images/background_winter_3840px.jpg';

const getBackgroundImage = () => {
  const url = LocalSettingStore.getValue(LocalSettings.BACKGROUND_IMAGE_URL);
  if (url) {
    return url;
  }

  if (useMobileLayout()) {
    return null;
  }

  return window.innerWidth < 1440 ? Background1500px : Background3840px;
};

const getBackgroundImageStyle = () => {
  const url = getBackgroundImage();
  return url ? `url(${url})` : undefined;
};

export const MeasuredBackground: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Measure bounds={true}>
      {({ measureRef, contentRect }) => (
        <LayoutWidthContext.Provider
          value={!!contentRect.bounds ? contentRect.bounds.width : null}
        >
          <div
            ref={measureRef}
            id="background-wrapper"
            style={{
              backgroundImage: getBackgroundImageStyle(),
              height: '100%',
            }}
          >
            {children}
          </div>
        </LayoutWidthContext.Provider>
      )}
    </Measure>
  );
};
