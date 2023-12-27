import { AnySelectMenuInteraction, ComponentType, Interaction, InteractionResponse } from "discord.js";

export function createCollector(
    response: InteractionResponse,
    filter: (i: Interaction) => boolean,
    componentType: ComponentType.RoleSelect | ComponentType.UserSelect,
    onCollect: (i: AnySelectMenuInteraction) => Promise<void>
) {
    const collector = response.createMessageComponentCollector({ componentType, filter, time: 120_000 });
    collector.on("collect", onCollect);
    const stop = () => collector.stop();
    return stop;
}
