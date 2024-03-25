import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../../config';
import { getCurrentGame } from '../../../helpers/getCurrentGame';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let imgUrl = `${NEXT_PUBLIC_URL}/earth.png`
  let postUrl = `${NEXT_PUBLIC_URL}/api/frame/0`

  const currentGame = await getCurrentGame();

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  if (message?.button === 1) {
    imgUrl = `https://nmpawygvrvljzwkubune.supabase.co/storage/v1/object/public/screenshots/${currentGame.latitude}_${currentGame.longitude}/270.png`
    postUrl = `${NEXT_PUBLIC_URL}/api/frame/270`
  }

  if (message?.button === 2) {
    imgUrl = `https://nmpawygvrvljzwkubune.supabase.co/storage/v1/object/public/screenshots/${currentGame.latitude}_${currentGame.longitude}/90.png`
    postUrl = `${NEXT_PUBLIC_URL}/api/frame/90`
  }

  if (message?.button === 3) {
    // process submission
    const isCorrect = await checkSubmissionCorrect(message?.input, currentGame);
    const { points } = await saveSubmissionResult(accountAddress, )
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: '⬅️',
        },
        {
          label: '➡️',
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
