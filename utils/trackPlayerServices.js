import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    RepeatMode,
    Event
  } from 'react-native-track-player';
  
  export async function setupPlayer() {
    let isSetup = false;
    try {
      await TrackPlayer.getCurrentTrack();
      isSetup = true;
    }
    catch {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
        ],
        progressUpdateEventInterval: 2,
      });
  
      isSetup = true;
    }
    finally {
      return isSetup;
    }
  }
  
  export async function addTracks(file) {
    await TrackPlayer.add([
      {
        id: file.id,
        url: file.filePath,
        title: file.name,
        artist: file.category ? file.category : "Unknown artist",
        duration: 60,
        artwork: file.imagePath ? file.imagePath : "https://placeholder.com/68x68"
      }
    ]);
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
  }
  
  export async function playbackService() {
    // TODO: Attach remote event handlers
    TrackPlayer.addEventListener(Event.RemotePause, () => {
        console.log('Event.RemotePause');
        TrackPlayer.pause();
      });
    
      TrackPlayer.addEventListener(Event.RemotePlay, () => {
        console.log('Event.RemotePlay');
        TrackPlayer.play();
      });
    
      TrackPlayer.addEventListener(Event.RemoteNext, () => {
        console.log('Event.RemoteNext');
        TrackPlayer.skipToNext();
      });
    
      TrackPlayer.addEventListener(Event.RemotePrevious, () => {
        console.log('Event.RemotePrevious');
        TrackPlayer.skipToPrevious();
      });
  }