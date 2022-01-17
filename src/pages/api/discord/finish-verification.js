import {
  fetchMemberById,
  fetchUserByName,
} from "../../../lib/discord/discordFetch";
import { applicationRole } from "../../../lib/discord/guildIds";

const finishVerification = async ({ body }, res) => {
  const { discordName } = body;
  const match = await fetchUserByName(discordName);
  if (match?.user) {
    const userData = await fetchMemberById(match.user.id);
    if (userData?.roles?.includes(applicationRole)) {
      res.json({ finished: true });
      return;
    }
  }
  res.json({ finished: false });
  return;
};

export default finishVerification;
