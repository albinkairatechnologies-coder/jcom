"use client";

import { useEffect } from "react";

export default function TeamModalHandler() {
  useEffect(() => {
    const handleModalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const card = target.closest(".team-card-premium") as HTMLElement | null;
      if (card && card.dataset.bsToggle === "modal") {
        const modalName = document.getElementById("modalName");
        const modalRole = document.getElementById("modalRole");
        const modalBio = document.getElementById("modalBio");
        const modalImg = document.getElementById("modalImg") as HTMLImageElement | null;

        if (modalName) modalName.innerText = card.dataset.name || "";
        if (modalRole) modalRole.innerText = card.dataset.role || "";
        if (modalBio) modalBio.innerText = card.dataset.bio || "";
        if (modalImg) modalImg.src = card.dataset.img || "https://placehold.co/400x400";
      }
    };

    document.addEventListener("click", handleModalClick);
    return () => {
      document.removeEventListener("click", handleModalClick);
    };
  }, []);

  return null;
}
