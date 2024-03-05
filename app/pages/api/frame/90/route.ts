import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let imgUrl = 'https://nmpawygvrvljzwkubune.supabase.co/storage/v1/object/public/screenshots/37.86926_-122.254811/90.png'
  let postUrl = `${NEXT_PUBLIC_URL}/api/frame/90`

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  if (message?.button === 1) {
    imgUrl = 'https://nmpawygvrvljzwkubune.supabase.co/storage/v1/object/public/screenshots/37.86926_-122.254811/0.png'
    postUrl = `${NEXT_PUBLIC_URL}/api/frame/0`
  }

  if (message?.button === 2) {
    imgUrl = 'https://nmpawygvrvljzwkubune.supabase.co/storage/v1/object/public/screenshots/37.86926_-122.254811/180.png'
    postUrl = `${NEXT_PUBLIC_URL}/api/frame/180`
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
          target: 'geocaster.xyz'
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
