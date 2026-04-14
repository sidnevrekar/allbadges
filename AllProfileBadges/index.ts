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
const DISCORD_BADGES: Array<Pick<ProfileBadge, "description" | "iconSrc" | "link" | "key">> = [
    {
        key: "vc-all-staff",
        description: "Discord Staff",
        iconSrc: badgeIcon("5e74e9b61934fc1f67c65515d1f7e60d"),
        link: "https://discord.com/company",
    },
    {
        key: "vc-all-partner",
        description: "Partnered Server Owner",
        iconSrc: badgeIcon("3f9748e53446a137a052f3454e2de41e"),
        link: "https://discord.com/partners",
    },
    {
        key: "vc-all-hypesquad-events",
        description: "HypeSquad Events",
        iconSrc: badgeIcon("bf01d1073931f921909045f3a39fd264"),
        link: "https://discord.com/hypesquad",
    },
    {
        key: "vc-all-hypesquad-bravery",
        description: "HypeSquad Bravery",
        iconSrc: badgeIcon("8a88d63823d8a71cd5e390baa45efa02"),
        link: "https://discord.com/settings/hypesquad-online",
    },
    {
        key: "vc-all-hypesquad-brilliance",
        description: "HypeSquad Brilliance",
        iconSrc: badgeIcon("011940fd013da3f7fb926e4a1cd2e618"),
        link: "https://discord.com/settings/hypesquad-online",
    },
    {
        key: "vc-all-hypesquad-balance",
        description: "HypeSquad Balance",
        iconSrc: badgeIcon("3aa41de486fa12454c3761e8e223442e"),
        link: "https://discord.com/settings/hypesquad-online",
    },
    {
        key: "vc-all-bughunter-1",
        description: "Discord Bug Hunter",
        iconSrc: badgeIcon("2717692c7dca7289b35297368a940dd0"),
        link: "https://support.discord.com/hc/en-us/articles/360046057772-Discord-Bugs",
    },
    {
        key: "vc-all-bughunter-2",
        description: "Discord Bug Hunter",
        iconSrc: badgeIcon("848f79194d4be5ff5f81505cbd0ce1e6"),
        link: "https://support.discord.com/hc/en-us/articles/360046057772-Discord-Bugs",
    },
    {
        key: "vc-all-moderator-alumni",
        description: "Moderator Programs Alumni",
        iconSrc: badgeIcon("fee1624003e2fee35cb398e125dc479b"),
        link: "https://discord.com/safety",
    },
    {
        key: "vc-all-early-dev",
        description: "Early Verified Bot Developer",
        iconSrc: badgeIcon("6df5892e0f35b051f8b61eace34f4967"),
    },
    {
        key: "vc-all-active-dev",
        description: "Active Developer",
        iconSrc: badgeIcon("6bdc42827a38498929a4920da12695d9"),
        link: "https://support-dev.discord.com/hc/en-us/articles/10113997751447",
    },
    {
        key: "vc-all-early-supporter",
        description: "Early Supporter",
        iconSrc: badgeIcon("7060786766c9c840eb3019e725d2b358"),
        link: "https://discord.com/settings/premium",
    },
    {
        key: "vc-all-nitro",
        description: "Subscriber",
        iconSrc: badgeIcon("2ba85e8026a8614b640c2837bcdfe21b"),
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
});

function shouldInject({ userId }: BadgeUserArgs): boolean {
    if (!settings.store.enabled) return false;
    const me = UserStore.getCurrentUser()?.id;
    if (!me) return false;
    if (settings.store.onlyOnOwnProfile) return userId === me;
    return true;
}

const profileBadge: ProfileBadge = {
    position: BadgePosition.START,
    shouldShow: args => shouldInject(args),
    getBadges: () =>
        DISCORD_BADGES.map(b => ({
            ...b,
            position: BadgePosition.START,
        })),
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
