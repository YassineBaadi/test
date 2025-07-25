import { HelpCircle } from "lucide-react";

export default function Rules({ right, top, size }) {
  return (
    <>
      <div
        className={`absolute cursor-help right-${right} top-${top} text-yellow-300 flex items-center justify-center`}>
        <span>Règles du Jeu</span>
        <HelpCircle size={size} />
      </div>
    </>
  );
}
