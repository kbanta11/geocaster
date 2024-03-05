import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: '<-',
        },
        {
          label: '->',
        },
        {
          label: 'Submit',
          action: 'post_redirect',
        },
        {
          action: 'link',
          label: 'Leaderboard',
          target: 'geocaster.xyz/leaderboard'
        }
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/earth.png`,
        aspectRatio: '1:1',
      },
      input: {
        text: 'Guess the country',
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame/start`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
