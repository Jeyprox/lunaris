import fetchUserByName from "../../../lib/discord/fetchUserByName";
import { applicationRole } from "../../../lib/discord/guildIds";

const finishVerification = async ({ body }, res) => {
  const { discordName } = body;
  const match = await fetchUserByName(discordName);
  if (match?.user) {
    const response = await fetch(
      `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${match.user.id}`,
      {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
      }
    );
    const userData = await response.json();
    if (userData?.roles?.includes(applicationRole)) {
      res.json({ finished: true });
      return;
    }
  }
  res.json({ finished: false });
  return;
};

export default finishVerification;
