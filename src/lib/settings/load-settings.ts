import storage from "../local-storage";

export default async function loadSettings() {
  const settings = await storage.load({
    key: "settings",
  });
  return settings;
}
