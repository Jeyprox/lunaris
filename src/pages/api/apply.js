import { GraphQLClient } from "graphql-request";
import { Client, Intents, MessageEmbed } from "discord.js";
import { applicationChannel, guildColor } from "../../lib/discord/guildIds";
import fetchUserByName from "../../lib/discord/fetchUserByName";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const sendApplication = async ({ body }, res) => {
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_PROJECT_API, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${process.env.GRAPHCMS_AUTH_TOKEN}`,
    },
  });
  await client.login(process.env.DISCORD_BOT_TOKEN);
  const { cityName, info, joinDate, nations, professions } = body;
  try {
    const response = await graphcms.request(
      `
        mutation sendApplication($cityName: String!, $discordName: String!, $ingameName: String!, $joinDate: Json!, $joinReason: String!, $timeZone: Int!, $ingameProfessions: Json!, $recentCitizenships: Json!) {
          createApplication(
            data: {city: {connect: {cityName: $cityName}}, discordName: $discordName, ingameName: $ingameName, joinDate: $joinDate, joinReason: $joinReason, timeZone: $timeZone, ingameProfessions: $ingameProfessions, recentCitizenships: $recentCitizenships}
          ) {
            id
          }
        }
      `,
      {
        cityName,
        discordName: info.discordtag,
        ingameName: info.username,
        joinDate,
        joinReason: info.joinreason,
        timeZone: info.timezone,
        ingameProfessions: professions,
        recentCitizenships: nations,
      }
    );
    const formattedDate = `${joinDate[0]} Days | ${joinDate[1]} Weeks | ${joinDate[2]} Months`;
    const match = await fetchUserByName(info.discordtag);
    if (match?.user) {
      const channel = client.channels.cache.get(applicationChannel);
      const applicationEmbed = new MessageEmbed()
        .setTitle("Citizenship Application")
        .setColor(guildColor)
        .setAuthor(
          info.discordtag,
          `https://cdn.discordapp.com/avatars/${match.user.id}/${match.user.avatar}.png`
        )
        .setDescription(`An application for the city of ${cityName}`)
        .addFields(
          { name: "Ingame Name", value: info.username },
          { name: "Join Date", value: formattedDate },
          { name: "Timezone", value: `GMT ${info.timezone}` },
          {
            name: "Previous Nations",
            value: nations.length ? nations.toString() : "/",
          },
          { name: "Professions", value: professions.toString() },
          { name: "Reason for joining Lunaris", value: info.joinreason }
        )
        .setFooter("The application will be reviewed shortly by our staff");
      const applicationMessage = await channel.send({
        embeds: [applicationEmbed],
      });
      applicationMessage.react("✅");
      applicationMessage.react("❌");
      res.status(200).json({ id: response.createApplication.id });
      return;
    }
  } catch (err) {
    if (err.message) res.status(400).json({ error: err.message });
    else res.status(400).json({ error: err.response.errors[0].message });
  }
};

export default sendApplication;
