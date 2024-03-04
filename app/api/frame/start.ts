import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getStartResponse(req: NextRequest): Promise<NextResponse> {
    const body: FrameRequest = await req.json();
    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });
  
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