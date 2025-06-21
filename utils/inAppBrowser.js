import InAppBrowser from 'react-native-inappbrowser-reborn';

const handleOpenInAppBrowser = async (url) => {
    if (InAppBrowser) {
        const isAvailable = await InAppBrowser.isAvailable;
        // await InAppBrowser.close();
          const result = await InAppBrowser.open(url, {
            // iOS-specific options
            dismissButtonStyle: 'close',
            preferredBarTintColor: '#000',
            preferredControlTintColor: 'white',
            readerMode: false,
            animated: true,
            modalPresentationStyle: 'fullScreen',
            modalTransitionStyle: 'coverVertical',
            modalEnabled: true,
            enableBarCollapsing: false,
        // Android-specific options
                showTitle: true,
                enableUrlBarHiding: true,
                enableDefaultShare: true,
                forceCloseOnRedirection: false,
                headers: {
                  'my-custom-header': 'my-custom-header-value'
                },
          });
          console.log(result);
          } else {
      console.error('InAppBrowser is null');
    }
  };

  export default handleOpenInAppBrowser;