import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { getMessageSeenByApi } from "@/api/mesaagesApi";
import type { SeenByDetail } from "@/interfaces/messageInterfaces";
import { socket } from "@/sockets/socketConn";

interface MessageInfoModalProps {
    messageId: string | null;
    onClose: () => void;
}

export function MessageInfoModal({ messageId, onClose }: MessageInfoModalProps) {
    const [loading, setLoading] = useState(false);
    const [seenBy, setSeenBy] = useState<SeenByDetail[]>([]);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (!messageId) return;

        let cancelled = false;

        const fetchSeenBy = async () => {
            setLoading(true);
            try {
                const res = await getMessageSeenByApi(messageId);
                if (!cancelled) setSeenBy(res.data.seenBy ?? []);
            } catch {
                if (!cancelled) setError("Failed to load seen info. Please try again.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchSeenBy();

        const handleStatusUpdate = (data: any) => {
            if (data.status === "seen") fetchSeenBy();
        };
        socket.on("message_status_updated", handleStatusUpdate);

        return () => {
            cancelled = true;
            socket.off("message_status_updated", handleStatusUpdate);
            setLoading(false);
            setSeenBy([]);
            setError(null);
        };
    }, [messageId]);

    return (
        <Dialog open={!!messageId} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="w-80 p-6 space-y-4">

                <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <DialogTitle className="text-card-foreground font-semibold text-base">
                        Message Info
                    </DialogTitle>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                )}

                {error && !loading && (
                    <p className="text-destructive text-sm text-center py-6">{error}</p>
                )}

                {!loading && !error && seenBy.length === 0 && (
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
                            <EyeOff className="w-5 h-5 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm text-muted-foreground">No one has seen this message yet.</p>
                    </div>
                )}

                {!loading && !error && seenBy.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            Read by {seenBy.length} {seenBy.length === 1 ? "person" : "people"}
                        </p>
                        <div className="space-y-1.5 max-h-64 overflow-y-auto">
                            {seenBy.map((entry) => (
                                <div
                                    key={entry.user._id}
                                    className="flex items-center gap-3 p-2.5 bg-muted/40 rounded-xl border border-border/30"
                                >
                                    <div className="w-8 h-8 bg-primary/90 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <span className="text-xs font-bold text-primary-foreground">
                                            {entry.user.name?.[0]?.toUpperCase() ?? "?"}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-card-foreground truncate">{entry.user.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(entry.seenAt).toLocaleString([], {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <Eye className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </DialogContent>
        </Dialog>
    );
}