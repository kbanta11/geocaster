import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Play!',
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/earth.png`,
    aspectRatio: '1:1',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/frame/start`,
});

export const metadata: Metadata = {
  title: 'Geocaster',
  description: 'Guess the Globe',
  openGraph: {
    title: 'Geocaster',
    description: 'Guess the Globe',
    images: [`${NEXT_PUBLIC_URL}/earth.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <div className='flex justify-center'>
        <div className='flex justify-between'>
          <h1>Geocaster</h1>
          <a>Admin</a>
        </div>
        <div>
          <h2>Leaderboard</h2>
        </div>
      </div>
    </>
  );
}
