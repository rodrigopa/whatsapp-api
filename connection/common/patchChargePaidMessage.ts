export default function patchStanzaChargePaidMessage(stanza: any) {
  stanza.content.push({
    tag: 'biz',
    attrs: {},
    content: [
      {
        tag: 'interactive',
        attrs: {
          v: '1',
          type: 'native_flow',
        },
        content: [
          {
            tag: 'native_flow',
            attrs: {
              name: 'payment_status',
            },
            content: [],
          },
        ],
      },
    ],
  });
  return stanza;
}
