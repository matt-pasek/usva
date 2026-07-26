export const SPLASH_MS = 1700;

export const splashScript = `(function(){try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;var e=performance.getEntriesByType("navigation")[0];var t=e?e.type:(performance.navigation&&performance.navigation.type!==0?"reload":"navigate");if(t!=="navigate")return;document.documentElement.setAttribute("data-splash","1");}catch(e){}})();`;
