import { ButtonInteraction, ComponentType, Interaction, InteractionResponse } from "discord.js";

export function awaitComponent(
  response: InteractionResponse,
  filter: (i: Interaction) => boolean,
  onResponse: (i: ButtonInteraction) => Promise<void>
) {
  response
    .awaitMessageComponent({
      componentType: ComponentType.Button,
      filter,
      time: 120_000
    })
    .then(onResponse);
}
