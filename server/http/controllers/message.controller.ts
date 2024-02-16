import { inject, injectable } from 'tsyringe';
import RedisService from '../../services/redis.service';
import ProcessManagerService from '../../services/process-manager.service';
import { FastifyRequest } from 'fastify';
import { EnsureConnectionIdValidationQuerystring } from '../validations/connection/ensure-connection-id.validation';
import { TextMessageValidationBody } from '../validations/message/text-message.validation';
import { ImageMessageValidationBody } from '../validations/message/image-message.validation';
import { File } from 'fastify-multer/lib/interfaces';
import { VideoMessageValidationBody } from '../validations/message/video-message.validation';
import { AudioMessageValidationBody } from '../validations/message/audio-message.validation';
import { MediaFromURLMessageValidationBody } from '../validations/message/media-from-url-message.validation';
import { generateMessageID } from '@whiskeysockets/baileys';
import BeeQueue from 'bee-queue';
import { respondJSend } from '../../common/jsend';
import { ReactMessageValidationBody } from '../validations/message/react-message.validation';
import { DeleteMessageValidationBody } from '../validations/message/delete-message.validation';
import { UpdateMessageValidationBody } from '../validations/message/update-message.validation';

@injectable()
export class MessageController {
  constructor(
    @inject(RedisService) public redisService: RedisService,
    @inject(ProcessManagerService) public processManagerService: ProcessManagerService,
  ) {}

  public async sendText(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: TextMessageValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'sendTextMessage',
      {
        destination: request.body.destination,
        text: request.body.text,
        forward: request.body.forward,
      },
    );
  }

  public async sendImage(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: ImageMessageValidationBody;
    }> & { file: File },
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'sendImageMessage',
      {
        destination: request.body.destination,
        text: request.body.text,
        image: request.file.buffer!.toString('base64'),
        forward: request.body.forward,
      },
    );
  }

  public async sendVideo(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: VideoMessageValidationBody;
    }> & { file: File },
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'sendVideoMessage',
      {
        destination: request.body.destination,
        text: request.body.text,
        video: request.file.buffer!.toString('base64'),
      },
    );
  }

  public async sendAudio(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: AudioMessageValidationBody;
    }> & { file: File },
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'sendAudioMessage',
      {
        destination: request.body.destination,
        audio: request.file.buffer!.toString('base64'),
        ptt: request.body.ptt,
      },
    );
  }

  public async sendMediaFromURL(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: MediaFromURLMessageValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'sendMediaFromURLMessage',
      {
        destination: request.body.destination,
        type: request.body.type,
        text: request.body.text,
        mimeType: request.body.mimeType,
        url: request.body.url,
      },
    );
  }

  public async reactMessage(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: ReactMessageValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(request.query.connectionId, 'reactMessage', {
      destination: request.body.destination,
      text: request.body.text,
      key: request.body.messageKey,
      fromMe: request.body.messageFromMe,
    });
  }

  public async deleteMessage(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: DeleteMessageValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'deleteMessage',
      {
        destination: request.body.destination,
        key: request.body.messageKey,
      },
    );
  }

  public async updateMessage(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: UpdateMessageValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'updateMessage',
      {
        destination: request.body.destination,
        key: request.body.messageKey,
        text: request.body.text,
      },
    );
  }
}
