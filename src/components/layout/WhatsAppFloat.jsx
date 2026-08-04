import { MessageCircle } from "lucide-react";
import { whatsappNumber } from "../../data/stores";

export default function WhatsAppFloat() {
  const href = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=Hey%2C%20I%20have%20a%20query%20about%20Madhu%20jewellery.`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] text-white
        px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline text-sm font-medium">Chat with us</span>
    </a>
  );
}