"use client";
import { Avatar } from "@matt-pasek/usva";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#7c6fd6"/><circle cx="40" cy="32" r="16" fill="#f4f1ff"/><path d="M12 76c4-20 20-28 28-28s24 8 28 28" fill="#f4f1ff"/></svg>',
  );

export function AvatarDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar src={PLACEHOLDER} alt="Jane Doe" fallback="JD" size="sm" />
        <Avatar src={PLACEHOLDER} alt="Jane Doe" fallback="JD" size="md" />
        <Avatar src={PLACEHOLDER} alt="Jane Doe" fallback="JD" size="lg" />
      </div>
      <div className="flex items-center gap-4">
        <Avatar alt="Ada Lovelace" fallback="AL" size="sm" />
        <Avatar alt="Grace Hopper" fallback="GH" size="md" />
        <Avatar alt="Katherine Johnson" fallback="KJ" size="lg" />
      </div>
      <div className="flex">
        <Avatar
          alt="Ada Lovelace"
          fallback="AL"
          className="ring-2 ring-surface"
        />
        <Avatar
          alt="Grace Hopper"
          fallback="GH"
          className="-ml-3 ring-2 ring-surface"
        />
        <Avatar
          alt="Katherine Johnson"
          fallback="KJ"
          className="-ml-3 ring-2 ring-surface"
        />
      </div>
    </div>
  );
}
