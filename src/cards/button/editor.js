/** Éditeur graphique (formulaire `ha-form`) et configuration d'exemple. */

export const configForm = () => ({
  schema: [
    { name: "entity", required: true, selector: { entity: {} } },
    { name: "name", selector: { text: {} } },
    { name: "icon", selector: { icon: {} } },
    { name: "shape", selector: { select: { mode: "dropdown", options: ["pill", "square", "circle"] } } },
    { name: "variant", selector: { select: { mode: "dropdown", options: ["dark", "light"] } } },
    { name: "accent", selector: { color_rgb: {} } },
    {
      type: "grid",
      name: "",
      schema: [
        { name: "dots", selector: { boolean: {} } },
        { name: "show_state", selector: { boolean: {} } },
        { name: "show_icon", selector: { boolean: {} } },
        { name: "led", selector: { boolean: {} } },
      ],
    },
  ],
});

/** Config proposée à l'ajout depuis le sélecteur de cartes. */
export const stubConfig = (hass, entities) => {
  const candidate =
    (entities || []).find((e) => e.startsWith("light.")) ||
    (entities || []).find((e) => e.startsWith("switch.")) ||
    "light.example";
  return { entity: candidate, shape: "pill", variant: "dark" };
};
