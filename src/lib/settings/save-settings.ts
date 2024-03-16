import Settings from "../../types/settings.type";
import storage from "../local-storage";

export default async function saveSettings(settings: Settings) {  
  await storage.save({
    key: "settings",
    data: settings,
  });
}
