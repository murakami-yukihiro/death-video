import { FiMic } from 'react-icons/fi';

type Props = {
  onStart: () => void;
  onClose: () => void;
};
export const RecordModal = (props: Props) => {
  const { onStart, onClose } = props;
  return (
    <>
      <div className="bg-lamp-black rounded-lg">
        <div className="w-96 border-t-8 border-carmine-red rounded-lg flex">
          <div className="w-1/3 pt-6 flex justify-center">
            <p className="w-16 h-16 rounded-full p-3 bg-carmine-red text-milky-white text-center">
              <FiMic className="inline text-4xl" />
            </p>
          </div>
          <div className="w-full pt-9 pr-4">
            <h3 className="font-bold font-kaisei text-carmine-red text-2xl">
              録音を開始します
            </h3>
            <p className="py-4 text-sm text-gray-400">
              初回はマイクの使用許可を求められます。
            </p>
          </div>
        </div>

        <div className="p-4 flex space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 px-4 py-3 text-center bg-gray-500 text-black opacity-50 hover:bg-gray-400 font-bold rounded-lg text-sm font-kaisei"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onStart}
            className="w-1/2 px-4 py-3 text-center text-milky-white bg-carmine-red opacity-90 rounded-lg hover:opacity-100 font-bold text-sm font-kaisei"
          >
            START
          </button>
        </div>
      </div>
    </>
  );
};
