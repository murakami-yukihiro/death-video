import { useState } from 'react';
import { CardSrc, useFfMpeg } from '../../../context/FfMpegProvider';
import { useAudioBuffer } from '../../../context/MediaRecorderProvider';

type VideoCardState = 'Kira' | 'L';

export const VideoCard = () => {
  const [videoCardState, setVideoCardState] = useState<VideoCardState>('Kira');
  const [[, blob]] = useAudioBuffer();
  const [, { run }] = useFfMpeg();
  const videoCardSrcMap: { [key in VideoCardState]: CardSrc } = {
    Kira: './kira-min.png',
    L: './L.png',
  };

  return (
    <div className="w-full h-48 p-2 rounded-t-sm rounded-b-md bg-pale-brown">
      <div className="h-24 grid grid-cols-2 gap-5">
        <button
          type="button"
          className={`p-1 rounded overflow-hidden shadow-lg bg-tyrian-purple ${
            videoCardState !== 'Kira' && 'opacity-40'
          }`}
          onClick={() => setVideoCardState('Kira')}
        >
          <img
            className="my-2 font-bold text-xl text-center object-contain"
            src="./kira-min.png"
            alt="Kira"
          />
        </button>

        <button
          type="button"
          className={`p-1 rounded overflow-hidden shadow-lg bg-tyrian-purple ${
            videoCardState !== 'L' && 'opacity-40'
          }`}
          onClick={() => setVideoCardState('L')}
        >
          <img
            className="my-2 font-bold text-xl text-center object-contain"
            src="./L.png"
            alt="L"
          />
        </button>
      </div>
      <div className="h-24 py-4 mx-auto align-middle text-center flex  justify-center items-center">
        <button
          type="button"
          className="py-2 px-6 bg-red-800 rounded-md font-kaisei font-bold"
          onClick={() => blob && run(blob, videoCardSrcMap[videoCardState])}
        >
          実行
        </button>
      </div>
    </div>
  );
};
