import { useState } from "react";
import RequestsModal from "@/components/chat/requestModel";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function RequestButton() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="secondary" size="lg" onClick={() => setOpen(true)} className="gap-2 shadow-lg hover:shadow-xl hover:scale-105 ring-2 ring-border/30 font-bold h-12 px-6 text-base bg-card/80 backdrop-blur-sm hover:bg-accent/50 hover:text-accent-foreground hover:border-accent/40 transition-all duration-200">
                <Mail className="w-5 h-5 shrink-0" />
                Requests
            </Button>
            <RequestsModal open={open} setOpen={setOpen} />
        </>
    );
}

export default RequestButton;
