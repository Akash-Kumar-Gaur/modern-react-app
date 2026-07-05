import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { STORAGE_KEYS } from "../lib/benefit-data";

type RewardsRadarLayoutProps = {
  children: ReactNode;
};

export function RewardsRadarLayout({ children }: RewardsRadarLayoutProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem(STORAGE_KEYS.loaded);
  });

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (!glowRef.current) return;
      glowRef.current.style.opacity = "1";
      glowRef.current.style.left = e.clientX + "px";
      glowRef.current.style.top = e.clientY + "px";
    };
    window.addEventListener("mousemove", onMouse);
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  useEffect(() => {
    if (!showLoader || !loaderRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to("#loader", {
        opacity: 0,
        duration: 0.55,
        delay: 0.4,
        onComplete: () => {
          sessionStorage.setItem(STORAGE_KEYS.loaded, "1");
          setShowLoader(false);
        },
      });
    });

    return () => ctx.revert();
  }, [showLoader]);

  return (
    <>
      {showLoader && (
        <div id="loader" ref={loaderRef}>
          <div className="loader-ticket">
            <div className="loader-shine" />
          </div>
          <div className="loader-text">Rewards Radar</div>
        </div>
      )}
      <div id="cursor-glow" ref={glowRef} />
      {children}
    </>
  );
}
