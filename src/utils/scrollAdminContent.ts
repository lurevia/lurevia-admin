export const scrollAdminContentToTop = (): void => {
  document
    .querySelector<HTMLElement>(".RaLayout-contentWithSidebar")
    ?.scrollTo({ top: 0, behavior: "smooth" });
};