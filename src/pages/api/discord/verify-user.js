import {
  Client,
  Intents,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import fetchUserByName from "../../../lib/discord/fetchUserByName";

const applicationChannel = "924137050100338708";
const applicationRole = "924370022414053436";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

client.once("ready", () => {
  console.log("Bot Online");

  let commands = client.guilds.cache.get(process.env.DISCORD_GUILD_ID).commands;

  commands.create({
    name: "verify",
    description: "Verify your Discord name for the application process",
  });

  client.on("userApplied", ({ user }) => {
    const channel = client.channels.cache.get(applicationChannel);
    channel.send(
      `<@${user.id}> please verify your discord name for the application with **/verify**`
    );
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, user } = interaction;

  if (commandName === "verify") {
    const verifyButton = new MessageButton()
      .setCustomId("verify")
      .setLabel("Verify")
      .setStyle("PRIMARY");
    const verificationRow = new MessageActionRow().addComponents(verifyButton);
    const verificationEmbed = new MessageEmbed()
      .setColor("#0c5fb0")
      .setTitle("Discord Verification")
      .setAuthor(
        `${user.username}#${user.discriminator}`,
        `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      )
      .setDescription(
        "Please verify your discord name for the application process"
      )
      .setFooter("Remember to click the verify button on the website again")
      .setTimestamp();
    await interaction.reply({
      ephemeral: true,
      components: [verificationRow],
      embeds: [verificationEmbed],
    });

    const filter = (buttonInteraction) => {
      return interaction.user.id === buttonInteraction.user.id;
    };

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: "BUTTON",
      filter,
      max: 1,
      time: 1000 * 15,
    });

    collector.on("end", async (collection) => {
      if (collection.first()?.customId === "verify") {
        const i = collection.first();
        i?.member.roles.add(i?.guild.roles.cache.get(applicationRole));
        i?.reply({
          content:
            "You successfully verified your discord name for the application\nPlease return to the website and click on the validate button once more",
          ephemeral: true,
        });
      }
      await interaction.editReply({
        content:
          "The application time has run out\nIf you need, restart the process on the website",
        components: [],
      });
    });
  }
});

const VerifyUser = async ({ body }, res) => {
  const { discordName } = body;
  const match = await fetchUserByName(discordName);
  if (match) {
    await client.login(process.env.DISCORD_BOT_TOKEN);
    setTimeout(() => client.emit("userApplied", match), 500);
    res.json({ hasJoined: 2 });
    return;
  }
  res.json({ hasJoined: 1 });
};

export default VerifyUser;
