import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  if (message?.input) {
    text = message.input;
  }

  if (message?.button === 3) {
    return NextResponse.redirect(
      'https://www.google.com/search?q=cute+dog+pictures&tbm=isch&source=lnms',
      { status: 302 },
    );
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Story time!',
        },
        {
          action: 'link',
          label: 'Link to Google',
          target: 'https://www.google.com',
        },
        {
          label: 'Redirect to pictures',
          action: 'post_redirect',
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/park-3.png`,
        aspectRatio: '1:1',
      },
      input: {
        text: 'Tell me a boat story',
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame/start`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
