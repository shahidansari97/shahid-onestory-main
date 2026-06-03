import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { captureUTMParams } from "@/Utils/analytics";
export default function GoogleAnalyticsTracker() {
  const { url } = usePage(); // Inertia current URL

  useEffect(() => {
    captureUTMParams();
    if (typeof gtag === "function") {
      gtag("config", "G-E2K48VQ4SP", {
        page_path: url,
      });
    }
  }, [url]);

  return null;
}
