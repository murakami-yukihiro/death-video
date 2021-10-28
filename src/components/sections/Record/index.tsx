import { ReactNode, useCallback, useState } from 'react';
import { useModal } from 'react-hooks-use-modal';
import { BsRecordCircle, BsFillStopCircleFill } from 'react-icons/bs';
import { useMicrophone } from '../../../context/MediaRecorderProvider';
import { RecordModal } from './RecordModal';

type RecordState = 'init' | 'started' | 'stopped';
export const Record = () => {
  const [Modal, open, close] = useModal('root', {
    preventScroll: false,
  });
  const { ask, start, stop, result } = useMicrophone();
  const [recordState, setRecordState] = useState<RecordState>('init');

  const onStart = useCallback(() => {
    close();
    ask()
      .then(() => {
        setRecordState('started');
        start();
      })
      .catch((e) => {
        // eslint-disable-next-line no-alert
        alert('マイクが使えません。');
        // eslint-disable-next-line no-console
        console.log(e);
      });
  }, [ask, close, start]);

  const onStop = useCallback(() => {
    setRecordState('stopped');
    stop();
  }, [stop]);

  const RecordButton: { [key in RecordState]: ReactNode } = {
    init: (
      <>
        <BsRecordCircle className="absolute inline-flex text-9xl motion-safe:animate-ping text-carmine-red opacity-25" />
        <BsRecordCircle
          className="relative inline-flex text-9xl text-carmine-red cursor-pointer"
          onClick={open}
        />
      </>
    ),
    started: (
      <BsFillStopCircleFill
        className="relative inline-flex text-9xl text-lamp-black bg-carmine-red rounded-full cursor-pointer"
        onClick={onStop}
      />
    ),
    stopped: (
      <>
        <figure>
          <audio controls src={result}>
            <track kind="captions" />
            Your browser does not support the
            <code>audio</code> element.
          </audio>
        </figure>
        <button
          type="button"
          className="mt-2 py-1 px-2 inline-flex text-sm bg-tyrian-purple font-kaisei text-milky-white rounded-md"
          onClick={open}
        >
          撮り直す
        </button>
      </>
    ),
  };

  return (
    <>
      <div className="p-2 w-full h-48 relative flex flex-col justify-center items-center rounded-t-sm rounded-b-md bg-pale-brown overflow-hidden">
        {RecordButton[recordState]}
      </div>
      <Modal>
        <RecordModal onClose={close} onStart={onStart} />
      </Modal>
    </>
  );
};
