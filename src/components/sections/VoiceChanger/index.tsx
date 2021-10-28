import { useCallback, useMemo, useState } from 'react';
import { BiLoader } from 'react-icons/bi';
import {
  Transformer,
  useMicrophone,
} from '../../../context/MediaRecorderProvider';
import { cuteRobot } from '../../../transformers/cuteRobot';
import { troll } from '../../../transformers/troll';

type VoiceState = 'Monster' | 'Robot';
export const VoiceChanger = () => {
  const { result, transform } = useMicrophone();
  const [voiceState, setVoiceState] = useState<VoiceState>('Monster');

  const voiceChanger: { [key in VoiceState]: Transformer } = useMemo(
    () => ({
      Monster: troll,
      Robot: cuteRobot,
    }),
    []
  );

  const selectVoice = useCallback(
    (voice: VoiceState) => {
      setVoiceState(voice);
      transform(voiceChanger[voice]).catch((e) => console.log(e));
    },
    [transform, voiceChanger]
  );

  return (
    <div className="w-full h-48 p-2 rounded-t-sm rounded-b-md bg-pale-brown">
      <div className="h-24 grid grid-cols-2 gap-5">
        <button
          type="button"
          className={`rounded overflow-hidden shadow-lg bg-tyrian-purple ${
            voiceState !== 'Monster' && 'opacity-40'
          }`}
          onClick={() => selectVoice('Monster')}
        >
          <p className="my-2 font-bold text-xl text-center font-kaisei">
            Monster
          </p>
        </button>

        <button
          type="button"
          className={`rounded overflow-hidden shadow-lg bg-tyrian-purple ${
            voiceState !== 'Robot' && 'opacity-40'
          }`}
          onClick={() => selectVoice('Robot')}
        >
          <p className="my-2 font-bold text-xl text-center font-kaisei">
            Robot
          </p>
        </button>
      </div>
      <div className="h-24 py-4 mx-auto align-middle text-center flex  justify-center items-center">
        {result ? (
          <figure className="inline-flex">
            <audio controls src={result || ''}>
              <track kind="captions" />
              Your browser does not support the
              <code>audio</code> element.
            </audio>
          </figure>
        ) : (
          <BiLoader className="animate-spin-slow inline-flex text-4xl" />
        )}
      </div>
    </div>
  );
};
