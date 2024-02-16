export default function onCredsUpdate(saveCreds: () => Promise<void>) {
  return function () {
    saveCreds();
  };
}
