import './App.css';
import { IoIosWarning } from 'react-icons/io';
import { Record } from './components/sections/Record';
import { MediaRecorderProvider } from './context/MediaRecorderProvider';
import { VoiceChanger } from './components/sections/VoiceChanger';
import { VideoCard } from './components/sections/VideoCard';
import { FfMpegProvider } from './context/FfMpegProvider';
import { VideoPlayer } from './components/sections/VideoPlayer';

export const App = () => (
  <div className="container h-screen mx-auto justify-center items-center">
    <header className="mt-4 w-1/2 mx-auto text-center">
      <h1>
        <img src="./death-video.png" alt="death video" />
      </h1>
      <p className="mt-4 text-milky-white font-kaisei">
        貴方の声を加工して動画にします。
      </p>
      <p className="text-milky-white font-kaisei text-sm">
        処理は全てブラウザで完結するため、第三者に特定される心配はございません。
      </p>
      <p className="mt-2 text-carmine-red font-bold">
        <IoIosWarning className="inline mr-1 text-lg" />
        PC版Chromeのみで動作します。
      </p>
    </header>
    <MediaRecorderProvider>
      <section className="mt-4 w-80 mx-auto text-left">
        <h2 className="font-kaisei text-pale-brown font-bold text-xl">
          ■ 1. Record Your Voice.
        </h2>
        <Record />
      </section>
      <section className="mt-4 w-80 mx-auto text-left">
        <h2 className="font-kaisei text-pale-brown font-bold text-xl">
          ■ 2. Select a Voice Changer.
        </h2>
        <VoiceChanger />
      </section>
      <FfMpegProvider>
        <section className="mt-4 w-80 mx-auto text-left">
          <h2 className="font-kaisei text-pale-brown font-bold text-xl">
            ■ 3. Select a Video Card.
          </h2>
          <VideoCard />
        </section>
        <section className="mt-4 w-80 mx-auto text-left">
          <h2 className="font-kaisei text-pale-brown font-bold text-xl">
            ■ 4. Result.
          </h2>
          <VideoPlayer />
        </section>
      </FfMpegProvider>
    </MediaRecorderProvider>
  </div>
);
