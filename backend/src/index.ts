import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import byteSize from 'byte-size';
import csvtojson from 'csvtojson';
import { Readable, Transform, Writable } from 'node:stream';
import { TransformStream } from 'node:stream/web';

const PORT = 3000;
const FILENAME = './data/posts.csv';

createServer(async (req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    return;
  }

  const { size } = await stat(FILENAME);
  console.log('File size:', byteSize(size));
  try {
    res.writeHead(200, headers);

    const abortController = new AbortController();

    req.once('close', () => {
      abortController.abort();
    });

    await Readable.toWeb(createReadStream(FILENAME))
      .pipeThrough(Transform.toWeb(csvtojson()))
      .pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            const post = JSON.parse(Buffer.from(chunk).toString());
            console.log('Post:', post);
            controller.enqueue(JSON.stringify(post).concat('\n'));
          },
        }),
      )
      .pipeTo(Writable.toWeb(res), {
        signal: abortController.signal,
      });
  } catch (error) {
    if (error instanceof Error && error.message.includes('abort')) return;
    console.error('Error processing stream:', error);
  }
})
  .listen(PORT)
  .on('listening', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  })
  .on('error', err => {
    console.error('Error starting server:', err);
  });
