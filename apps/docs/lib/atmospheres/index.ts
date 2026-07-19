import { hehkuStudio } from "./hehku.studio";
import { kajastusStudio } from "./kajastus.studio";
import { kuultoStudio } from "./kuulto.studio";
import { kynnosStudio } from "./kynnos.studio";
import { loimuStudio } from "./loimu.studio";
import { routaStudio } from "./routa.studio";
import type { ErasedStudio } from "./types";
import { utuStudio } from "./utu.studio";
import { vareStudio } from "./vare.studio";

export type { AtmosphereStudio, ErasedStudio } from "./types";

export const studios: ErasedStudio[] = [
  hehkuStudio,
  loimuStudio,
  vareStudio,
  kynnosStudio,
  kajastusStudio,
  kuultoStudio,
  routaStudio,
  utuStudio,
];

export const studioByName: Record<string, ErasedStudio> = Object.fromEntries(
  studios.map((studio) => [studio.name, studio]),
);
