import React from "react";
import { Accessibility } from "lucide-react";

// This file was used as a temporary Logo loader. Keeping a minimal fallback
// component here in case it's referenced elsewhere. The app now uses the
// `Accessibility` icon in header/sidebar per revert request.
const Logo: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => {
  return <Accessibility className={className} />;
};

export default Logo;
