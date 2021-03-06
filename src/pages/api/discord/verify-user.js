import { Client } from "discord.js";
import { fetchUserByName } from "../../../lib/discord/discordFetch";
import { applicationChannel } from "../../../lib/discord/guildIds";

const client = new Client();

const VerifyUser = async ({ body }, res) => {
  const { discordName } = body;
  const match = await fetchUserByName(discordName);
  if (match) {
    await client.login(process.env.DISCORD_BOT_TOKEN);
    client.once("ready", async () => {
      const channel = client.channels.cache.get(applicationChannel);
      if (!channel || channel.type !== "text")
        return res.json({ hasJoined: 1 });
      await channel.send(
        `<@${match.user.id}> please verify your discord name for the application with **/verify**`
      );
      client.destroy();
      return;
    });
    return res.json({ hasJoined: 2 });
  } else {
    res.json({ hasJoined: 1 });
  }
};

export default VerifyUser;
