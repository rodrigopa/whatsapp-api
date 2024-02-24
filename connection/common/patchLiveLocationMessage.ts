export default function patchStanzaLiveLocationMessage(stanza: any) {
  stanza.attrs.type = 'media';

  const participants = stanza.content[0];

  for (const participant of participants.content) {
    participant.content[0].attrs.duration = '3599';
    participant.content.push({
      tag: 'meta',
      attrs: {
        liveloc_mode: 'pn',
      },
    });
  }

  return stanza;
}
