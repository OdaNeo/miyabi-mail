import { splitByPrompts, PROMPT } from '@src/utils/tts';
import { useState } from 'react';

export function Reply({ replyOrigin }: { replyOrigin: string }) {
  const { origin, reply, result } = splitByPrompts(replyOrigin);
  const [showOrigin] = useState(true);

  return (
    <>
      <div className="mt-4 border p-2 rounded text-sm whitespace-pre-wrap">
        <div>{PROMPT.ORIGIN}</div>
        <div>{origin}</div>
      </div>
      <div className="mt-4 border p-2 rounded text-sm whitespace-pre-wrap">
        <div>{PROMPT.REPLY}</div>
        <div>{reply}</div>
      </div>
      <div className="mt-4 border p-2 rounded text-sm whitespace-pre-wrap">
        <div>{PROMPT.RESULT}</div>
        <div>{result}</div>
      </div>
      {showOrigin && (
        <div className="mt-4 border p-2 rounded text-sm whitespace-pre-wrap">
          <div>AI返回原文</div>
          <div>{replyOrigin}</div>
        </div>
      )}
    </>
  );
}
