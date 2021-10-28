import {
  createContext,
  ReactNode,
  useContext,
  useRef,
  useCallback,
  useState,
  SetStateAction,
  Dispatch,
  useEffect,
} from 'react';
import { bufferToWave, downloadUrl } from '../helpers/bufferToWave';

type AudioBufferState = [AudioBuffer | undefined, Blob | undefined];
type AudioBufferDispatch = Dispatch<
  SetStateAction<AudioBufferState | undefined>
>;
export type Transformer = (
  audioBuffer: AudioBuffer
) => Promise<AudioBuffer | undefined> | AudioBuffer;
type MediaRecorderUtils = {
  ask: (mimeType?: string) => Promise<void>;
  result?: string;
  transform: (trans: Transformer) => Promise<void>;
  start: () => void;
  stop: () => void;
};
const AudioBufferStateContext = createContext<AudioBufferState | null>(null);
const AudioBufferDispatchContext = createContext<AudioBufferDispatch | null>(
  null
);
const MediaRecorderUtilsContext = createContext<MediaRecorderUtils | null>(
  null
);

const MediaRecorderProvider = ({ children }: { children: ReactNode }) => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Array<Blob> | null>(null);
  const [originAudioBuffer, setOriginAudioBuffer] = useState<
    AudioBuffer | undefined
  >();
  const [[audioBuffer, blob] = [], setAudioBuffer] =
    useState<AudioBufferState>();
  const [result, setResult] = useState<string>();

  /**
   * マイクの使用許可を得る
   */
  const ask = useCallback(async (mimeType?: string) => {
    chunks.current = [];
    setResult(undefined);
    setAudioBuffer(undefined);
    const stream = await navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .catch((e: Error) => {
        throw e;
      });
    mediaRecorder.current = new MediaRecorder(stream, {
      mimeType: mimeType || 'audio/webm',
    });
    mediaRecorder.current.ondataavailable = (e) => {
      chunks.current?.push(e.data);
    };
    mediaRecorder.current.onerror = (e) => {
      // eslint-disable-next-line no-console
      console.log(e);
    };
  }, []);

  /**
   * 録音を開始する
   */
  const start = useCallback(() => {
    if (!mediaRecorder?.current) return;
    mediaRecorder.current.onstart = () => {
      // eslint-disable-next-line no-console
      console.log(`Started, state:  ${mediaRecorder?.current?.state}`);
    };
    mediaRecorder.current.start();
  }, []);

  const transform = useCallback(
    async (trans: Transformer) => {
      if (!originAudioBuffer) return;
      setResult(undefined);
      const transformedBuffer = await trans(originAudioBuffer);
      setAudioBuffer([transformedBuffer, blob]);
    },
    [blob, originAudioBuffer]
  );

  /**
   * audioBufferをwavに変換してresultにセットする
   */
  const getWavUrl = useCallback(
    async (ab: AudioBuffer) => {
      const reader = new FileReader();
      const currentBlob = new Blob(chunks.current || undefined, {
        type: mediaRecorder?.current?.mimeType,
      });
      // Process Audio
      const offlineAudioCtx = new OfflineAudioContext({
        length: 44100 * ab.duration,
        numberOfChannels: 2,
        sampleRate: 44100,
      });
      const soundSource = offlineAudioCtx.createBufferSource();
      soundSource.buffer = ab;
      soundSource.connect(offlineAudioCtx.destination);

      const wav: [string, Blob] = await new Promise((resolve, reject) => {
        reader.onload = async () => {
          const renderedBuffer = await offlineAudioCtx
            .startRendering()
            .catch((e: Error) => {
              reject(e);
              throw e;
            });
          const url = downloadUrl(renderedBuffer, offlineAudioCtx.length);
          const wavBlob = bufferToWave(renderedBuffer, offlineAudioCtx.length);
          resolve([url, wavBlob]);
        };
        reader.readAsArrayBuffer(currentBlob);
        soundSource.start(0);
      });
      setResult(wav[0]);
      setAudioBuffer([audioBuffer, wav[1]]);
    },
    [audioBuffer]
  );

  useEffect(() => {
    (async () => {
      if (originAudioBuffer) await getWavUrl(originAudioBuffer);
      if (audioBuffer) await getWavUrl(audioBuffer);
    })().catch((e: Error) => {
      throw e;
    });
  }, [audioBuffer, getWavUrl, originAudioBuffer]);
  /**
   * 録音を停止する
   */
  const stop = useCallback(() => {
    if (!mediaRecorder?.current) return;
    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(chunks.current || undefined, {
        type: mediaRecorder?.current?.mimeType,
      });
      const audioURL = window.URL.createObjectURL(audioBlob);
      const arrayBuffer = await (await fetch(audioURL)).arrayBuffer();
      const decoded = await new AudioContext().decodeAudioData(arrayBuffer);
      setOriginAudioBuffer(decoded);
    };
    mediaRecorder.current.stop();
  }, []);

  return (
    <AudioBufferStateContext.Provider value={[audioBuffer, blob]}>
      <AudioBufferDispatchContext.Provider value={setAudioBuffer}>
        <MediaRecorderUtilsContext.Provider
          value={{
            ask,
            result,
            transform,
            start,
            stop,
          }}
        >
          {children}
        </MediaRecorderUtilsContext.Provider>
      </AudioBufferDispatchContext.Provider>
    </AudioBufferStateContext.Provider>
  );
};

const useAudioBuffer = (): [AudioBufferState, AudioBufferDispatch] => {
  const audioBuffer = useContext(AudioBufferStateContext);
  const setAudioBuffer = useContext(AudioBufferDispatchContext);
  if (audioBuffer === null || setAudioBuffer === null) {
    throw new Error(
      'No context provided: useAudioBuffer() can only be used within a MediaRecorderProvider'
    );
  }
  return [audioBuffer, setAudioBuffer];
};

const useMicrophone = () => {
  const utils = useContext(MediaRecorderUtilsContext);
  if (utils === null) {
    throw new Error(
      'No context provided: useMicrophone() can only be used within a MediaRecorderProvider'
    );
  }
  return utils;
};

export { MediaRecorderProvider, useMicrophone, useAudioBuffer };
