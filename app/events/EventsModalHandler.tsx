"use client";

import { useEffect } from "react";

export default function EventsModalHandler() {
  useEffect(() => {
    const handleGalleryClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest(".highlight-btn") as HTMLElement | null;
      if (btn && btn.dataset.bsToggle === "modal") {
        const modalLabel = document.getElementById("galleryModalLabel");
        const modalImg = document.getElementById("galleryModalImg") as HTMLImageElement | null;
        const modalDesc = document.getElementById("galleryModalDesc");

        if (modalLabel) modalLabel.innerText = btn.dataset.title || "";
        if (modalImg) modalImg.src = btn.dataset.img || "";
        if (modalDesc) modalDesc.innerText = btn.dataset.desc || "";
      }
    };

    document.addEventListener("click", handleGalleryClick);
    return () => {
      document.removeEventListener("click", handleGalleryClick);
    };
  }, []);

  return null;
}
