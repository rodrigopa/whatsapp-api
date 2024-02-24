export default function patchStanzaChargeUpdateMessage(stanza: any) {
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
              name: 'order_status',
            },
            content: [],
          },
        ],
      },
    ],
  });
  return stanza;
}
