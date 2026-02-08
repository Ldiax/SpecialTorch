import { world, system } from "@minecraft/server";
const TORCH_ID = "myaddon:tocha_especial";
const DETECTION_RADIUS = 10;
const PLAYER_ALERT_RADIUS = 20;
const CHECK_INTERVAL = 20; // 1 segundo
const ALERT_COOLDOWN = 60; // 3 segundos
const placedTorches = [];
const alertCooldowns = new Map();
// Registrar quando o jogador posiciona a tocha especial
world.afterEvents.playerPlaceBlock.subscribe((event) => {
    const block = event.block;
    if (block.typeId === TORCH_ID) {
        placedTorches.push({
            x: block.location.x,
            y: block.location.y,
            z: block.location.z,
            dimensionId: block.dimension.id,
        });
        event.player.sendMessage("\u00A7eTocha Especial posicionada! Ela alertara sobre mobs hostis proximos.");
    }
});
// Remover da lista quando o jogador quebra a tocha especial
world.afterEvents.playerBreakBlock.subscribe((event) => {
    if (event.brokenBlockPermutation.type.id === TORCH_ID) {
        const loc = event.block.location;
        const dimId = event.block.dimension.id;
        const idx = placedTorches.findIndex((t) => t.x === loc.x && t.y === loc.y && t.z === loc.z && t.dimensionId === dimId);
        if (idx !== -1) {
            placedTorches.splice(idx, 1);
        }
    }
});
// Loop principal: verificar mobs hostis perto de cada tocha
system.runInterval(() => {
    var _a;
    const currentTick = system.currentTick;
    for (let i = placedTorches.length - 1; i >= 0; i--) {
        const torch = placedTorches[i];
        let dimension;
        try {
            dimension = world.getDimension(torch.dimensionId);
        }
        catch (_b) {
            continue;
        }
        const center = {
            x: torch.x + 0.5,
            y: torch.y + 0.5,
            z: torch.z + 0.5,
        };
        // Validar se o bloco ainda existe
        try {
            const block = dimension.getBlock(torch);
            if (!block || block.typeId !== TORCH_ID) {
                placedTorches.splice(i, 1);
                continue;
            }
        }
        catch (_c) {
            continue; // chunk nao carregado
        }
        // Buscar mobs hostis no raio de deteccao
        let hostileMobs;
        try {
            hostileMobs = dimension.getEntities({
                location: center,
                maxDistance: DETECTION_RADIUS,
                families: ["monster"],
            });
        }
        catch (_d) {
            continue;
        }
        if (hostileMobs.length === 0)
            continue;
        // Soltar particulas de alerta na tocha
        try {
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
                dimension.spawnParticle("minecraft:basic_flame_particle", {
                    x: center.x + Math.cos(angle) * 0.3,
                    y: center.y + 0.5,
                    z: center.z + Math.sin(angle) * 0.3,
                });
            }
            dimension.spawnParticle("minecraft:basic_smoke_particle", {
                x: center.x,
                y: center.y + 0.8,
                z: center.z,
            });
        }
        catch (_e) {
            // sem jogadores por perto para ver particulas
        }
        // Alertar jogadores proximos
        let nearbyPlayers;
        try {
            nearbyPlayers = dimension.getPlayers({
                location: center,
                maxDistance: PLAYER_ALERT_RADIUS,
            });
        }
        catch (_f) {
            continue;
        }
        for (const player of nearbyPlayers) {
            const cooldownKey = `${player.name}_${torch.x}_${torch.y}_${torch.z}`;
            const lastAlert = (_a = alertCooldowns.get(cooldownKey)) !== null && _a !== void 0 ? _a : 0;
            if (currentTick - lastAlert < ALERT_COOLDOWN)
                continue;
            alertCooldowns.set(cooldownKey, currentTick);
            player.onScreenDisplay.setTitle("\u00A7c\u26A0 ALERTA \u26A0", {
                subtitle: `\u00A7e${hostileMobs.length} mob(s) hostil(is) detectado(s)!`,
                fadeInDuration: 5,
                stayDuration: 40,
                fadeOutDuration: 10,
            });
            player.playSound("note.pling", {
                location: center,
                volume: 1.0,
                pitch: 2.0,
            });
        }
    }
}, CHECK_INTERVAL);
//# sourceMappingURL=main.js.map