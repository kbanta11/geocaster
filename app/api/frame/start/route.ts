import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../../config';
import { getCurrentGame } from '../../../helpers/getCurrentGame';
import { getUserCanPlay } from '../../../helpers/getUserCanPlay';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let imgUrl = 'https://nmpawygvrvljzwkubune.supabase.co/storage/v1/object/public/screenshots/37.86926_-122.254811/0.png'
  let postUrl = `${NEXT_PUBLIC_URL}/api/frame/0`
  let accountAddress: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  // pull current game from supabase
  const currentGame = await getCurrentGame();
  console.log(`current game: ${JSON.stringify(currentGame)}`);

  // check if user address has played more than 3 times
  const canPlay = await getUserCanPlay(currentGame, accountAddress);
  
  if (!canPlay) {
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            action: 'link',
            label: 'Leaderboard',
            target: 'https://geocaster.xyz'
          },
        ],
        image: {
          src: imgUrl,
          aspectRatio: '1:1',
        },
        input: {
          text: 'Guess the Country',
        },
        postUrl: postUrl,
      }),
    )
  }

  imgUrl = `https://nmpawygvrvljzwkubune.supabase.co/storage/v1/object/public/screenshots/${currentGame?.latitude}_${currentGame?.longitude}/0.png`

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: '⬅️ West',
        },
        {
          label: 'East ➡️',
        },
        {
          label: 'Guess',
        },
        {
          action: 'link',
          label: 'Leaderboard',
          target: 'https://geocaster.xyz'
        },
      ],
      image: {
        src: imgUrl,
        aspectRatio: '1:1',
      },
      input: {
        text: 'Guess the Country',
      },
      postUrl: postUrl,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
