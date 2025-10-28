const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

// Criação do cliente com intents necessárias para detectar mensagens
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent // necessário para comandos de texto
  ] 
});

// Lista de inscritos
let inscritos = [];

// Personalize aqui
const titulo = "🏆 Campeonato de Clash Royale";
const premio = "R$10";
const taxa = "R$2";
const limite = 12;

client.on('ready', () => {
  console.log(`Bot online! Logado como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'inscrever') {
    if (inscritos.includes(interaction.user.id)) {
      return interaction.reply({ content: "Você já está inscrito!", ephemeral: true });
    }
    if (inscritos.length >= limite) {
      return interaction.reply({ content: "O limite de inscritos já foi atingido!", ephemeral: true });
    }
    inscritos.push(interaction.user.id);
    await interaction.reply({ content: `Inscrição confirmada! Você é o participante ${inscritos.length}/${limite}`, ephemeral: true });
    await interaction.user.send(`Lista de inscritos atual: ${inscritos.length}/${limite}\nIDs: ${inscritos.join(", ")}`);
  }
});

client.on('messageCreate', async message => {
  // Checa se a mensagem é o comando
  if (message.content === "!campeonato") {
    const embed = new EmbedBuilder()
      .setTitle(titulo)
      .addFields(
        { name: "💰 Prêmio", value: premio },
        { name: "💸 Taxa de inscrição", value: taxa },
        { name: "👥 Limite de participantes", value: `${inscritos.length}/${limite}` }
      )
      .setColor("Blue");

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('inscrever')
          .setLabel('Inscrever-se')
          .setStyle(ButtonStyle.Primary)
      );

    await message.channel.send({ embeds: [embed], components: [row] });
  }
});

// Login usando variável de ambiente
client.login(process.env.TOKEN);
