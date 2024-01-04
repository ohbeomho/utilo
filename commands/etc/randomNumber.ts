import { SlashCommandBuilder } from "discord.js";
import { Command } from "..";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("random-number")
    .setDescription("무작위 숫자를 생성합니다. (기본 범위: 1-100)")
    .addStringOption((option) =>
      option.setName("range").setDescription("무작위 숫자 범위. {범위시작}-{범위끝} 형식으로 입력 (ex. 1-100)")
    ),
  async execute(interaction) {
    const range = interaction.options.getString("range");
    let min = 1,
      max = 100;
    const error = (content: string) => interaction.reply({ content, ephemeral: true });

    if (range) {
      const regex = /^[1-9][0-9]{0,}-[1-9][0-9]{0,}/;
      if (!regex.test(range)) {
        await error(`${range}는 올바른 범위가 아닙니다. **{범위시작}-{범위끝}** 형식으로 입력해 주세요. (ex. 1-100)`);
      } else if (range.match(regex)![0].length !== range.length) {
        await error(`${range}는 올바른 범위가 아닙니다.`);
      }

      const nums = range.split("-").map(Number);
      if (nums[0] > nums[1]) {
        await error(`${range}는 올바른 범위가 아닙니다. 범위의 시작이 범위의 끝보다 클 수 없습니다.`);
      }

      if (interaction.replied) {
        return;
      }

      min = nums[0];
      max = nums[1];
    }

    await interaction.reply(String(Math.round(Math.random() * (max - min) + min)));
  }
};
