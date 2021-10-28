import { BiLoader } from 'react-icons/bi';
import { useFfMpeg } from '../../../context/FfMpegProvider';

export const VideoPlayer = () => {
  const [result] = useFfMpeg();
  return (
    <div className="w-full h-48 p-2 rounded-t-sm rounded-b-md bg-pale-brown flex justify-center items-center">
      {result ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video controls src={result} />
      ) : (
        <BiLoader className="animate-spin-slow inline-flex text-4xl" />
      )}
    </div>
  );
};
