import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

export type CardSrc = './kira-min.png' | './L.png';
type FfMpegUtils = {
  run: (blob: Blob, card: CardSrc) => Promise<void>;
};
const FfMpegResultStateContext = createContext<string | null>(null);
const FfMpegResultUtilsContext = createContext<FfMpegUtils | null>(null);

const FfMpegProvider = ({ children }: { children: ReactNode }) => {
  const [result, setResult] = useState<string>('');
  const [message, setMessage] = useState('standby to transcode');
  console.log(message);

  const run = useCallback(async (blob: Blob, card: CardSrc) => {
    const ffmpeg = createFFmpeg({
      log: true,
    });
    const image = await fetchFile(card);
    console.log('image', image);
    const sound = await fetchFile(blob);
    setMessage('Loading ffmpeg-core.js');
    await ffmpeg.load();
    setMessage('Start transcoding');
    ffmpeg.FS('writeFile', 'card.png', image);
    ffmpeg.FS('writeFile', 'voice.wav', sound);
    await ffmpeg.run(
      '-loop',
      '1',
      '-i',
      'card.png',
      '-i',
      'voice.wav',
      '-pix_fmt',
      'yuv420p',
      '-shortest',
      'death.mp4'
    );
    setMessage('Complete transcoding');
    const data = ffmpeg.FS('readFile', 'death.mp4');
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'video/mp4' })
    );
    console.log(url);
    setResult(url);
  }, []);

  return (
    <FfMpegResultStateContext.Provider value={result}>
      <FfMpegResultUtilsContext.Provider value={{ run }}>
        {children}
      </FfMpegResultUtilsContext.Provider>
    </FfMpegResultStateContext.Provider>
  );
};

const useFfMpeg = (): [string, FfMpegUtils] => {
  const result = useContext(FfMpegResultStateContext);
  const utils = useContext(FfMpegResultUtilsContext);

  if (result === null || utils === null) {
    throw new Error(
      'No context provided: useFfMpeg() can only be used within a FfMpegProvider'
    );
  }
  return [result, utils];
};

export { FfMpegProvider, useFfMpeg };
