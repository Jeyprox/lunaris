export const fetchUserByName = async (discordName) => {
  const queryName = discordName.slice(0, -5);
  const response = await fetch(
    `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/search?query=${queryName}`,
    {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    }
  );
  const data = await response.json();
  if (!data) return null;
  const match = data.find(({ user }) => {
    return `${user.username}#${user.discriminator}` === discordName;
  });
  if (match) return match;
  return null;
};

export const fetchMemberById = async (discordId) => {
  const response = await fetch(
    `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordId}`,
    {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    }
  );
  const userData = await response.json();
  return userData;
};
