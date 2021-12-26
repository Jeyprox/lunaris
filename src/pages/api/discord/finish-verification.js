import { Client, Intents } from "discord.js";
import fetchUserByName from "../../../lib/discord/fetchUserByName";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

const applicationRole = "924370022414053436";

const finishVerification = async ({ body }, res) => {
  const { discordName } = body;
  const match = await fetchUserByName(discordName);
  if (match) {
    await client.login(process.env.DISCORD_BOT_TOKEN);
    setTimeout(() => {
      const isApplying = client.guilds.cache
        .get(process.env.DISCORD_GUILD_ID)
        .members.cache.get(match.user.id)
        .roles.cache.has(applicationRole);
      if (isApplying) res.json({ finished: true });
    }, 1000);
  } else {
    res.json({ finished: false });
  }
};

export default finishVerification;
