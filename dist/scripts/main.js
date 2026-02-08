// scripts/main.ts
import { world, system } from "@minecraft/server";
var TORCH_ID = "myaddon:tocha_especial";
var DETECTION_RADIUS = 10;
var PLAYER_ALERT_RADIUS = 20;
var CHECK_INTERVAL = 20;
var ALERT_COOLDOWN = 60;
var placedTorches = [];
var alertCooldowns = /* @__PURE__ */ new Map();
world.afterEvents.playerPlaceBlock.subscribe((event) => {
  const block = event.block;
  if (block.typeId === TORCH_ID) {
    placedTorches.push({
      x: block.location.x,
      y: block.location.y,
      z: block.location.z,
      dimensionId: block.dimension.id
    });
    event.player.sendMessage(
      "\xA7eTocha Especial posicionada! Ela alertara sobre mobs hostis proximos."
    );
  }
});
world.afterEvents.playerBreakBlock.subscribe((event) => {
  if (event.brokenBlockPermutation.type.id === TORCH_ID) {
    const loc = event.block.location;
    const dimId = event.block.dimension.id;
    const idx = placedTorches.findIndex(
      (t) => t.x === loc.x && t.y === loc.y && t.z === loc.z && t.dimensionId === dimId
    );
    if (idx !== -1) {
      placedTorches.splice(idx, 1);
    }
  }
});
system.runInterval(() => {
  const currentTick = system.currentTick;
  for (let i = placedTorches.length - 1; i >= 0; i--) {
    const torch = placedTorches[i];
    let dimension;
    try {
      dimension = world.getDimension(torch.dimensionId);
    } catch {
      continue;
    }
    const center = {
      x: torch.x + 0.5,
      y: torch.y + 0.5,
      z: torch.z + 0.5
    };
    try {
      const block = dimension.getBlock(torch);
      if (!block || block.typeId !== TORCH_ID) {
        placedTorches.splice(i, 1);
        continue;
      }
    } catch {
      continue;
    }
    let hostileMobs;
    try {
      hostileMobs = dimension.getEntities({
        location: center,
        maxDistance: DETECTION_RADIUS,
        families: ["monster"]
      });
    } catch {
      continue;
    }
    if (hostileMobs.length === 0) continue;
    try {
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
        dimension.spawnParticle("minecraft:basic_flame_particle", {
          x: center.x + Math.cos(angle) * 0.3,
          y: center.y + 0.5,
          z: center.z + Math.sin(angle) * 0.3
        });
      }
      dimension.spawnParticle("minecraft:basic_smoke_particle", {
        x: center.x,
        y: center.y + 0.8,
        z: center.z
      });
    } catch {
    }
    let nearbyPlayers;
    try {
      nearbyPlayers = dimension.getPlayers({
        location: center,
        maxDistance: PLAYER_ALERT_RADIUS
      });
    } catch {
      continue;
    }
    for (const player of nearbyPlayers) {
      const cooldownKey = `${player.name}_${torch.x}_${torch.y}_${torch.z}`;
      const lastAlert = alertCooldowns.get(cooldownKey) ?? 0;
      if (currentTick - lastAlert < ALERT_COOLDOWN) continue;
      alertCooldowns.set(cooldownKey, currentTick);
      player.onScreenDisplay.setTitle("\xA7c\u26A0 ALERTA \u26A0", {
        subtitle: `\xA7e${hostileMobs.length} mob(s) hostil(is) detectado(s)!`,
        fadeInDuration: 5,
        stayDuration: 40,
        fadeOutDuration: 10
      });
      player.playSound("note.pling", {
        location: center,
        volume: 1,
        pitch: 2
      });
    }
  }
}, CHECK_INTERVAL);

//# sourceMappingURL=../debug/main.js.map
