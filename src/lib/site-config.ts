// Everything Lenip is likely to want to change without touching components.

export const siteConfig = {
  brand: "Made by Lenip",
  contactEmail: "hello@madebylenip.com", // TODO: swap for the real inbox
  instagramHandle: "@madebylenip",
  instagramUrl: "", // TODO: add once the account is public

  // Etsy already handles payments, buyer protection and taxes for you, so it's
  // the safest place to actually take money while on-site payments are being
  // built. Flip `etsyEnabled` to true once there are real listings in the shop
  // — until then the site shouldn't send anyone to an empty storefront.
  // TODO: confirm this resolves to the real shop before enabling.
  etsyEnabled: false,
  etsyShopUrl: "https://www.etsy.com/shop/madebylenip",

  // Turnaround quoted on the site. Keep this honest.
  turnaround: "1–2 weeks",
} as const;
