export async function streamResponseText(args: {
  response: Response;
  onChunk: (chunk: string) => void;
  onDone?: () => void;
  onError?: (error: unknown) => void;
}) {
  try {
    if (!args.response.body) {
      const text = await args.response.text();
      if (text) args.onChunk(text);
      args.onDone?.();
      return;
    }

    const reader = args.response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;
      args.onChunk(decoder.decode(value, { stream: true }));
    }

    args.onDone?.();
  } catch (err) {
    args.onError?.(err);
  }
}

