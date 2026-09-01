const { loadImage } = require('canvas');

async function fetchBedrockSkin(gamertag) {
    try {
        const response = await fetch(`https://api.mccompanion.net/api/lookup/bedrock/${encodeURIComponent(gamertag)}`, { mode: 'cors' });
        if (!response.ok) {
            custom.error('Not found', 404);
            return null;
        }
        const b = await response.json();
        if (!b) {
            return null;
        }
        let skinUrl = b.skinUrl || null;
        if (!skinUrl && b.xuid) {
            try {
                const geyser = await fetch(`https://api.geysermc.org/v2/skin/${b.xuid}`, { mode: 'cors' });
                if (geyser.ok) {
                    const gj = await geyser.json();
                    if (gj && gj.texture_id) {
                        skinUrl = `https://textures.minecraft.net/texture/${gj.texture_id}`;
                    }
                }
            } catch (error) {
                custom.error(error);
            }
        }
        if (!skinUrl) {
            return null;
        }
        skinUrl = skinUrl.replace(/^http:\/\//, 'https://');
        const img = await loadImage(skinUrl);

        return { img, dataURL: skinUrl, textureURL: `https://mc-heads.net/body/${skinUrl.split('/').pop()}` };
    } catch (error) {
        custom.error(error);
        return null;
    }
}

module.exports = {
    fetchBedrockSkin
}