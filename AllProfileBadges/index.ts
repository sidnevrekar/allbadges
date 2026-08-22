/*
 * Vencord userplugin — drop this folder into Vencord's src/userplugins/ directory,
 * then build Vencord (see https://github.com/Vendicated/Vencord/blob/main/docs/1_INSTALLATION.md).
 *
 * Client-side only: only you (or everyone, if you enable it) see these badges in the UI.
 */

import { addProfileBadge, BadgePosition, BadgeUserArgs, ProfileBadge, removeProfileBadge } from "@api/Badges";
import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { UserStore } from "@webpack/common";

function badgeIcon(hash: string): string {
    return `https://cdn.discordapp.com/badge-icons/${hash}.png?size=64`;
}

/** Mirrors Vencord's validUser badge table (Discord asset hashes). */
const DISCORD_BADGES: Array<Pick<ProfileBadge, "description" | "iconSrc" | "key" | "id"> & { link?: string }> = [
    // Staff & Official Badges
    {
        id: "vc-all-staff",
        key: "vc-all-staff",
        description: "Discord Staff",
        iconSrc: badgeIcon("5e74e9b61934fc1f67c65515d1f7e60d"),
        link: "https://discord.com/company",
    },
    {
        id: "vc-all-partner",
        key: "vc-all-partner",
        description: "Partnered Server Owner",
        iconSrc: badgeIcon("3f9748e53446a137a052f3454e2de41e"),
        link: "https://discord.com/partners",
    },
    // HypeSquad Badges
    {
        id: "vc-all-hypesquad-events",
        key: "vc-all-hypesquad-events",
        description: "HypeSquad Events",
        iconSrc: badgeIcon("bf01d1073931f921909045f3a39fd264"),
        link: "https://discord.com/hypesquad",
    },
    {
        id: "vc-all-hypesquad-bravery",
        key: "vc-all-hypesquad-bravery",
        description: "HypeSquad Bravery",
        iconSrc: badgeIcon("8a88d63823d8a71cd5e390baa45efa02"),
        link: "https://discord.com/settings/hypesquad-online",
    },
    {
        id: "vc-all-hypesquad-brilliance",
        key: "vc-all-hypesquad-brilliance",
        description: "HypeSquad Brilliance",
        iconSrc: badgeIcon("011940fd013da3f7fb926e4a1cd2e618"),
        link: "https://discord.com/settings/hypesquad-online",
    },
    {
        id: "vc-all-hypesquad-balance",
        key: "vc-all-hypesquad-balance",
        description: "HypeSquad Balance",
        iconSrc: badgeIcon("3aa41de486fa12454c3761e8e223442e"),
        link: "https://discord.com/settings/hypesquad-online",
    },
    // Bug Hunter Badges
    {
        id: "vc-all-bughunter-1",
        key: "vc-all-bughunter-1",
        description: "Discord Bug Hunter",
        iconSrc: badgeIcon("2717692c7dca7289b35297368a940dd0"),
        link: "https://support.discord.com/hc/en-us/articles/360046057772-Discord-Bugs",
    },
    {
        id: "vc-all-bughunter-2",
        key: "vc-all-bughunter-2",
        description: "Discord Bug Hunter Level 2",
        iconSrc: badgeIcon("848f79194d4be5ff5f81505cbd0ce1e6"),
        link: "https://support.discord.com/hc/en-us/articles/360046057772-Discord-Bugs",
    },
    // Developer Badges
    {
        id: "vc-all-moderator-alumni",
        key: "vc-all-moderator-alumni",
        description: "Moderator Programs Alumni",
        iconSrc: badgeIcon("fee1624003e2fee35cb398e125dc479b"),
        link: "https://discord.com/safety",
    },
    {
        id: "vc-all-early-dev",
        key: "vc-all-early-dev",
        description: "Early Verified Bot Developer",
        iconSrc: badgeIcon("6df5892e0f35b051f8b61eace34f4967"),
    },
    {
        id: "vc-all-active-dev",
        key: "vc-all-active-dev",
        description: "Active Developer",
        iconSrc: badgeIcon("6bdc42827a38498929a4920da12695d9"),
        link: "https://support-dev.discord.com/hc/en-us/articles/10113997751447",
    },
    // Legacy Badges
    {
        id: "vc-all-early-supporter",
        key: "vc-all-early-supporter",
        description: "Early Supporter",
        iconSrc: badgeIcon("7060786766c9c840eb3019e725d2b358"),
        link: "https://discord.com/settings/premium",
    },
    // Nitro Badges
    {
        id: "vc-all-nitro",
        key: "vc-all-nitro",
        description: "Nitro Subscriber",
        iconSrc: badgeIcon("2ba85e8026a8614b640c2837bcdfe21b"),
        link: "https://discord.com/settings/premium",
    },
    {
        id: "vc-all-nitro-bronze",
        key: "vc-all-nitro-bronze",
        description: "Nitro Bronze (1 month)",
        iconSrc: badgeIcon("4f33c4a9c64ce221936bd256c356f91f"),
        link: "https://discord.com/settings/premium",
    },
    {
        id: "vc-all-nitro-silver",
        key: "vc-all-nitro-silver",
        description: "Nitro Silver (3 months)",
        iconSrc: badgeIcon("4514fab914bdbfb4ad2fa23df76121a6"),
        link: "https://discord.com/settings/premium",
    },
    {
        id: "vc-all-nitro-gold",
        key: "vc-all-nitro-gold",
        description: "Nitro Gold (6 months)",
        iconSrc: badgeIcon("2895086c18d5531d499862e41d1155a6"),
        link: "https://discord.com/settings/premium",
    },
    {
        id: "vc-all-nitro-platinum",
        key: "vc-all-nitro-platinum",
        description: "Nitro Platinum (1 year)",
        iconSrc: badgeIcon("0334688279c8359120922938dcb1d6f8"),
        link: "https://discord.com/settings/premium",
    },
    {
        id: "vc-all-nitro-diamond",
        key: "vc-all-nitro-diamond",
        description: "Nitro Diamond (2 years)",
        iconSrc: badgeIcon("0d61871f72bb9a33a7ae568c1fb4f20a"),
        link: "https://discord.com/settings/premium",
    },
    {
        id: "vc-all-nitro-emerald",
        key: "vc-all-nitro-emerald",
        description: "Nitro Emerald (3 years)",
        iconSrc: badgeIcon("11e2d339068b55d3a506cff34d3780f3"),
        link: "https://discord.com/settings/premium",
    },
    {
        id: "vc-all-nitro-ruby",
        key: "vc-all-nitro-ruby",
        description: "Nitro Ruby (5 years)",
        iconSrc: badgeIcon("cd5e2cfd9d7f27a8cdcd3e8a8d5dc9f4"),
        link: "https://discord.com/settings/premium",
    },
    {
        id: "vc-all-nitro-opal",
        key: "vc-all-nitro-opal",
        description: "Nitro Opal (6+ years)",
        iconSrc: badgeIcon("5b154df19c53dce2af92c9b61e6be5e2"),
        link: "https://discord.com/settings/premium",
    },
    // Special Event Badges
    {
        id: "vc-all-quest-completed",
        key: "vc-all-quest-completed",
        description: "Completed a Quest",
        iconSrc: badgeIcon("7d9ae358c8c5e118768335dbe68b4fb8"),
    },
    {
        id: "vc-all-orbs-apprentice",
        key: "vc-all-orbs-apprentice",
        description: "Orbs Apprentice",
        iconSrc: badgeIcon("83d8a1eb09a8d64e59233eec5d4d5c2d"),
    },
    {
        id: "vc-all-originally-known-as",
        key: "vc-all-originally-known-as",
        description: "Originally Known As",
        iconSrc: badgeIcon("6de6d34650760ba5551a79732e98ed60"),
    },
    // Boosting Badges
    {
        id: "vc-all-boosting-1m",
        key: "vc-all-boosting-1m",
        description: "Boosting (1 month)",
        iconSrc: badgeIcon("51040c70d4f20a921ad6674ff86fc95c"),
        link: "https://discord.com/settings/premium",
    },
    {
        id: "vc-all-boosting-2m",
        key: "vc-all-boosting-2m",
        description: "Boosting (2 months)",
        iconSrc: badgeIcon("0e4080d1d333bc7ad29ef6528b6f2fb7"),
        link: "https://discord.com/settings/premium",
    },
    {
        id: "vc-all-boosting-3m",
        key: "vc-all-boosting-3m",
        description: "Boosting (3 months)",
        iconSrc: badgeIcon("72bed924410c304dbe3d00a6e593ff59"),
        link: "https://discord.com/settings/premium",
    },
    {
        id: "vc-all-boosting-6m",
        key: "vc-all-boosting-6m",
        description: "Boosting (6 months)",
        iconSrc: badgeIcon("df199d2050d3ed4ebf84d64ae83989f8"),
        link: "https://discord.com/settings/premium",
    },
    {
        id: "vc-all-boosting-9m",
        key: "vc-all-boosting-9m",
        description: "Boosting (9 months)",
        iconSrc: badgeIcon("996b3e870e8a22ce519b3a50e6bdd52f"),
        link: "https://discord.com/settings/premium",
    },
    {
        id: "vc-all-boosting-12m",
        key: "vc-all-boosting-12m",
        description: "Boosting (1 year)",
        iconSrc: badgeIcon("991c9f39ee33d7537d9f408c3e53141e"),
        link: "https://discord.com/settings/premium",
    },
    {
        id: "vc-all-boosting-15m",
        key: "vc-all-boosting-15m",
        description: "Boosting (15 months)",
        iconSrc: badgeIcon("cb3ae83c15e970e8f3d410bc62cb8b99"),
        link: "https://discord.com/settings/premium",
    },
    {
        id: "vc-all-boosting-18m",
        key: "vc-all-boosting-18m",
        description: "Boosting (18 months)",
        iconSrc: badgeIcon("7142225d31238f6387d9f09efaa02759"),
        link: "https://discord.com/settings/premium",
    },
    {
        id: "vc-all-boosting-24m",
        key: "vc-all-boosting-24m",
        description: "Boosting (2 years)",
        iconSrc: badgeIcon("ec92202290b48d0879b7413d2dde3bab"),
        link: "https://discord.com/settings/premium",
    },
];

const settings = definePluginSettings({
    enabled: {
        type: OptionType.BOOLEAN,
        description: "Show the extra badges",
        default: true,
        restartNeeded: false,
    },
    onlyOnOwnProfile: {
        type: OptionType.BOOLEAN,
        description: "Only inject on your account (recommended). If off, every user's profile shows these badges on your client only.",
        default: true,
        restartNeeded: false,
    },
    staff: { type: OptionType.BOOLEAN, description: "Discord Staff", default: true, restartNeeded: false },
    partner: { type: OptionType.BOOLEAN, description: "Partnered Server Owner", default: true, restartNeeded: false },
    hypesquadEvents: { type: OptionType.BOOLEAN, description: "HypeSquad Events", default: true, restartNeeded: false },
    hypesquadBravery: { type: OptionType.BOOLEAN, description: "HypeSquad Bravery", default: true, restartNeeded: false },
    hypesquadBrilliance: { type: OptionType.BOOLEAN, description: "HypeSquad Brilliance", default: true, restartNeeded: false },
    hypesquadBalance: { type: OptionType.BOOLEAN, description: "HypeSquad Balance", default: true, restartNeeded: false },
    bugHunter1: { type: OptionType.BOOLEAN, description: "Bug Hunter", default: true, restartNeeded: false },
    bugHunter2: { type: OptionType.BOOLEAN, description: "Bug Hunter Level 2", default: true, restartNeeded: false },
    moderatorAlumni: { type: OptionType.BOOLEAN, description: "Moderator Programs Alumni", default: true, restartNeeded: false },
    earlyDev: { type: OptionType.BOOLEAN, description: "Early Verified Bot Developer", default: true, restartNeeded: false },
    activeDev: { type: OptionType.BOOLEAN, description: "Active Developer", default: true, restartNeeded: false },
    earlySupporter: { type: OptionType.BOOLEAN, description: "Early Supporter", default: true, restartNeeded: false },
    nitro: { type: OptionType.BOOLEAN, description: "Nitro Subscriber", default: true, restartNeeded: false },
    nitroBronze: { type: OptionType.BOOLEAN, description: "Nitro Bronze (1 month)", default: true, restartNeeded: false },
    nitroSilver: { type: OptionType.BOOLEAN, description: "Nitro Silver (3 months)", default: true, restartNeeded: false },
    nitroGold: { type: OptionType.BOOLEAN, description: "Nitro Gold (6 months)", default: true, restartNeeded: false },
    nitroPlatinum: { type: OptionType.BOOLEAN, description: "Nitro Platinum (1 year)", default: true, restartNeeded: false },
    nitroDiamond: { type: OptionType.BOOLEAN, description: "Nitro Diamond (2 years)", default: true, restartNeeded: false },
    nitroEmerald: { type: OptionType.BOOLEAN, description: "Nitro Emerald (3 years)", default: true, restartNeeded: false },
    nitroRuby: { type: OptionType.BOOLEAN, description: "Nitro Ruby (5 years)", default: true, restartNeeded: false },
    nitroOpal: { type: OptionType.BOOLEAN, description: "Nitro Opal (6+ years)", default: true, restartNeeded: false },
    questCompleted: { type: OptionType.BOOLEAN, description: "Completed a Quest", default: true, restartNeeded: false },
    orbsApprentice: { type: OptionType.BOOLEAN, description: "Orbs Apprentice", default: true, restartNeeded: false },
    originallyKnownAs: { type: OptionType.BOOLEAN, description: "Originally Known As", default: true, restartNeeded: false },
    boosting1m: { type: OptionType.BOOLEAN, description: "Boosting (1 month)", default: true, restartNeeded: false },
    boosting2m: { type: OptionType.BOOLEAN, description: "Boosting (2 months)", default: true, restartNeeded: false },
    boosting3m: { type: OptionType.BOOLEAN, description: "Boosting (3 months)", default: true, restartNeeded: false },
    boosting6m: { type: OptionType.BOOLEAN, description: "Boosting (6 months)", default: true, restartNeeded: false },
    boosting9m: { type: OptionType.BOOLEAN, description: "Boosting (9 months)", default: true, restartNeeded: false },
    boosting12m: { type: OptionType.BOOLEAN, description: "Boosting (1 year)", default: true, restartNeeded: false },
    boosting15m: { type: OptionType.BOOLEAN, description: "Boosting (15 months)", default: true, restartNeeded: false },
    boosting18m: { type: OptionType.BOOLEAN, description: "Boosting (18 months)", default: true, restartNeeded: false },
    boosting24m: { type: OptionType.BOOLEAN, description: "Boosting (2 years)", default: true, restartNeeded: false },
});

function shouldInject(args: BadgeUserArgs): boolean {
    if (!args) return false;
    const { userId } = args;
    if (!settings.store.enabled) return false;
    const me = UserStore.getCurrentUser()?.id;
    if (!me) return false;
    if (settings.store.onlyOnOwnProfile) return userId === me;
    return true;
}

const profileBadge: ProfileBadge = {
    position: BadgePosition.START,
    shouldShow: args => shouldInject(args),
    getBadges: (args) => {
        const s = settings.store;
        return DISCORD_BADGES.filter(badge => {
            let key = badge.key.replace("vc-all-", "");
            // Handle camelCase conversion for settings keys
            key = key.replace(/-([a-z0-9])/g, (_: string, c: string) => c.toUpperCase());
            // Fix specific case for bug hunter keys
            if (key.startsWith("bughunter")) {
                key = key.replace("bughunter", "bugHunter");
            }
            return s[key as keyof typeof s] as boolean;
        }).map(b => ({
            ...b,
            position: BadgePosition.START,
        }));
    },
};

export default definePlugin({
    name: "AllProfileBadges",
    description:
        "Adds every standard Discord profile badge (staff, partner, Nitro, HypeSquad houses, bug hunter, etc.) for you locally via BadgeAPI. Only affects your client.",
    authors: [{ name: "allbadges", id: 0n }],
    dependencies: ["BadgeAPI"],
    settings,

    start() {
        addProfileBadge(profileBadge);
    },

    stop() {
        removeProfileBadge(profileBadge);
    },
});
