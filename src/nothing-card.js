/**
 * Nothing Cards for Home Assistant — point d'entrée du paquet.
 *
 * Chaque carte s'enregistre elle-même à l'import ; il suffit donc d'ajouter
 * un import ci-dessous pour livrer une carte de plus dans le même fichier.
 *
 * Ressource à déclarer dans Home Assistant :
 *   /local/nothing-card.js   —   type : Module JavaScript
 */

import "./cards/battery/index.js";
import "./cards/button/index.js";
import "./cards/cover/index.js";
import "./cards/info/index.js";
import "./cards/light/index.js";
import "./cards/media/index.js";
import "./cards/slider/index.js";
import "./cards/stats/index.js";
import "./cards/stats/variants.js";
import "./cards/text/index.js";

export {NothingBatteryCard} from "./cards/battery/index.js";
export {NothingButtonCard} from "./cards/button/index.js";
export {NothingCoverCard} from "./cards/cover/index.js";
export {NothingInfoCard} from "./cards/info/index.js";
export {NothingLightCard} from "./cards/light/index.js";
export {NothingMediaCard} from "./cards/media/index.js";
export {NothingSliderCard} from "./cards/slider/index.js";
export {NothingStatsCard} from "./cards/stats/index.js";
export {NothingStatsBarsCard, NothingStatsLineCard} from "./cards/stats/variants.js";
export {NothingTextCard} from "./cards/text/index.js";
export {VERSION} from "./var/version.js";
