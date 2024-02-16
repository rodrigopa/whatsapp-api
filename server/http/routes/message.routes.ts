import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ConnectionController } from '../controllers/connection.controller';
import {
  EnsureConnectionIdValidation,
  EnsureConnectionIdValidationQuerystring,
} from '../validations/connection/ensure-connection-id.validation';
import { MessageController } from '../controllers/message.controller';
import {
  TextMessageValidation,
  TextMessageValidationBody,
} from '../validations/message/text-message.validation';
import multer from 'fastify-multer';
import {
  ImageMessageValidation,
  ImageMessageValidationBody,
} from '../validations/message/image-message.validation';
import { respondJSend } from '../../common/jsend';
import { File } from 'fastify-multer/lib/interfaces';
import {
  VideoMessageValidation,
  VideoMessageValidationBody,
} from '../validations/message/video-message.validation';
import {
  AudioMessageValidation,
  AudioMessageValidationBody,
} from '../validations/message/audio-message.validation';
import {
  MediaFromURLMessageValidation,
  MediaFromURLMessageValidationBody,
} from '../validations/message/media-from-url-message.validation';
import {
  ReactMessageValidation,
  ReactMessageValidationBody,
} from '../validations/message/react-message.validation';
import {
  DeleteMessageValidation,
  DeleteMessageValidationBody,
} from '../validations/message/delete-message.validation';
import {
  UpdateMessageValidation,
  UpdateMessageValidationBody,
} from '../validations/message/update-message.validation';

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 10 } });

const messageRoutes: FastifyPluginAsync = async (server) => {
  const controller = container.resolve(MessageController);

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: TextMessageValidationBody;
  }>(
    '/message/sendText',
    { schema: { ...EnsureConnectionIdValidation, ...TextMessageValidation } },
    (request, reply) => controller.sendText(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: ImageMessageValidationBody;
  }>(
    '/message/sendImage',
    {
      preValidation: upload.single('image'),
      preHandler: (request, reply, done) => {
        const typedRequest = request as typeof request & { file: File };
        if (!typedRequest.file || !typedRequest.file.buffer) {
          return reply.status(400).send(respondJSend('fail', 'The image is required'));
        }
        return done();
      },
      schema: { ...EnsureConnectionIdValidation, ...ImageMessageValidation },
    },
    (request, reply) => controller.sendImage(request as typeof request & { file: File }, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: VideoMessageValidationBody;
  }>(
    '/message/sendVideo',
    {
      preValidation: upload.single('video'),
      preHandler: (request, reply, done) => {
        const typedRequest = request as typeof request & { file: File };
        if (!typedRequest.file || !typedRequest.file.buffer) {
          return reply.status(400).send(respondJSend('fail', 'The video is required'));
        }
        return done();
      },
      schema: { ...EnsureConnectionIdValidation, ...VideoMessageValidation },
    },
    (request, reply) => controller.sendVideo(request as typeof request & { file: File }, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: AudioMessageValidationBody;
  }>(
    '/message/sendAudio',
    {
      preValidation: upload.single('audio'),
      preHandler: (request, reply, done) => {
        const typedRequest = request as typeof request & { file: File };
        if (!typedRequest.file || !typedRequest.file.buffer) {
          return reply.status(400).send(respondJSend('fail', 'The audio is required'));
        }
        return done();
      },
      schema: { ...EnsureConnectionIdValidation, ...AudioMessageValidation },
    },
    (request, reply) => controller.sendAudio(request as typeof request & { file: File }, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: MediaFromURLMessageValidationBody;
  }>(
    '/message/sendMediaFromURL',
    {
      schema: { ...EnsureConnectionIdValidation, ...MediaFromURLMessageValidation },
    },
    (request, reply) => controller.sendMediaFromURL(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: ReactMessageValidationBody;
  }>(
    '/message/reactMessage',
    {
      schema: { ...EnsureConnectionIdValidation, ...ReactMessageValidation },
    },
    (request, reply) => controller.reactMessage(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: DeleteMessageValidationBody;
  }>(
    '/message/deleteMessage',
    {
      schema: { ...EnsureConnectionIdValidation, ...DeleteMessageValidation },
    },
    (request, reply) => controller.deleteMessage(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: UpdateMessageValidationBody;
  }>(
    '/message/updateMessage',
    {
      schema: { ...EnsureConnectionIdValidation, ...UpdateMessageValidation },
    },
    (request, reply) => controller.updateMessage(request, reply),
  );
};

export default messageRoutes;
