import { GraphQLClient } from "graphql-request";
import { Client, MessageEmbed } from "discord.js";
import { applicationChannel, guildColor } from "../../lib/discord/guildIds";
import { fetchUserByName } from "../../lib/discord/discordFetch";

const client = new Client();

const sendApplication = async ({ body }, res) => {
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_PROJECT_API, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${process.env.GRAPHCMS_AUTH_TOKEN}`,
    },
  });
  const { info, nations, professions } = body;
  const joinDate = [info.time_days, info.time_weeks, info.time_months];
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
        cityName: info.city,
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
      await client.login(process.env.DISCORD_BOT_TOKEN);
      client.once("ready", async () => {
        const channel = client.channels.cache.get(applicationChannel);
        const applicationEmbed = new MessageEmbed()
          .setTitle("Citizenship Application")
          .setColor(guildColor)
          .setAuthor(
            info.discordtag,
            `https://cdn.discordapp.com/avatars/${match.user.id}/${match.user.avatar}.png`
          )
          .setDescription(`An application for the city of ${info.city}`)
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
        const applicationMessage = await channel.send(applicationEmbed);
        await applicationMessage.react("✅");
        await applicationMessage.react("❌");
        client.destroy();
        return;
      });
      return res.json({ id: response.createApplication.id });
    }
  } catch (err) {
    if (err?.response?.errors)
      res.json({ error: err.response.errors[0].message });
    else res.json({ error: err.message });
  }
};

export default sendApplication;
