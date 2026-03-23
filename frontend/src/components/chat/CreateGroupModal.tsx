import { useCreateGroup } from "@/hooks/useCreateGroup";
import useDebounce from "@/hooks/useDebounce";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, X, Users } from "lucide-react";

interface Props { onClose: () => void; }

export function CreateGroupModal({ onClose }: Props) {
    const {
        groupName, setGroupName, phone, setPhone, foundUsers, searchError,
        searching, participants, loading, searchByPhone, addParticipant,
        removeParticipant, createGroup, resetAll,
    } = useCreateGroup();

    const debouncedPhone = useDebounce(phone, 500);
    useEffect(() => { if (debouncedPhone.trim()) searchByPhone(); }, [debouncedPhone]);

    const handleClose = () => { resetAll(); onClose(); };
    const handleCreate = async () => { await createGroup(); handleClose(); };

    return (
        <Dialog open onOpenChange={handleClose}>
            <DialogContent className="w-[420px] p-0 shadow-2xl ring-2 ring-accent/20 max-h-[90vh] overflow-hidden card rounded-3xl">
                <div className="p-8 pb-0 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/95 ring-4 ring-background/40 shadow-2xl rounded-2xl flex items-center justify-center shrink-0 elevated-hover">
                            <Users className="w-7 h-7 text-primary-foreground drop-shadow-lg" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black text-card-foreground leading-tight tracking-tight">Create Group</DialogTitle>
                            <p className="text-lg text-muted-foreground/90 font-semibold mt-1">Add members by phone number</p>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-card-foreground font-bold text-sm uppercase tracking-wider">Group Name</Label>
                        <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Enter group name" className="h-14 shadow-lg ring-1 ring-border/50 bg-card/80 backdrop-blur-sm font-semibold text-lg pl-5" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-card-foreground font-bold text-sm uppercase tracking-wider">Add Members by Phone</Label>
                        <div className="relative">
                            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" className="pr-12 h-14 shadow-lg ring-2 ring-border/30 bg-card/80 backdrop-blur-sm font-semibold pl-5" />
                            {searching && (
                                <div className="absolute inset-y-0 right-4 flex items-center">
                                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground drop-shadow-sm" />
                                </div>
                            )}
                        </div>
                        {searchError && <p className="text-destructive text-sm font-medium pl-2">{searchError}</p>}
                    </div>
                </div>

                {foundUsers && foundUsers.length > 0 && (
                    <div className="px-8 pb-2 space-y-2">
                        {foundUsers.map((element) => (
                            <div key={element._id} onClick={() => addParticipant(element)}
                                className="group flex items-center gap-4 p-4 bg-card/70 backdrop-blur-sm rounded-2xl border border-border/50 cursor-pointer hover:border-accent hover:bg-card hover:shadow-xl transition-all duration-300 shadow-sm elevated-hover">
                                <div className="w-12 h-12 bg-primary/95 ring-3 ring-background/60 shadow-xl rounded-xl flex items-center justify-center text-primary-foreground text-lg font-black shrink-0 group-hover:ring-accent/50">
                                    {element.name?.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-lg font-bold text-card-foreground truncate leading-tight">{element.name}</p>
                                    <p className="text-base text-muted-foreground font-semibold">{element.phone}</p>
                                </div>
                                <span className="text-base font-bold text-accent bg-accent/10 px-4 py-2 rounded-full shadow-lg ring-2 ring-accent/30">+ Add</span>
                            </div>
                        ))}
                    </div>
                )}

                {participants.length > 0 && (
                    <ScrollArea className="px-8 pb-6 pt-4 max-h-40">
                        <div className="space-y-2 pr-3">
                            {participants.map((p) => (
                                <div key={p._id} className="group flex items-center gap-3 p-4 bg-muted/80 backdrop-blur-sm rounded-2xl shadow-md ring-1 ring-border/40 hover:shadow-xl transition-all">
                                    <div className="w-10 h-10 bg-primary/95 ring-3 ring-background/60 shadow-xl rounded-xl flex items-center justify-center text-primary-foreground text-lg font-black shrink-0">
                                        {p.name?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="text-lg font-bold text-card-foreground flex-1 truncate leading-tight">{p.name}</span>
                                    <Button variant="ghost" size="icon" onClick={() => removeParticipant(String(p._id))}
                                        className="w-10 h-10 shadow-lg hover:shadow-xl text-muted-foreground hover:text-destructive hover:bg-destructive/20 rounded-xl ring-2 ring-border/50 group-hover:ring-destructive/40 transition-all">
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}

                <div className="px-8 pb-8 pt-4">
                    {participants.length < 2 && (
                        <div className="text-center py-6 text-muted-foreground/80 text-lg font-medium mb-6 bg-muted/50 backdrop-blur-sm rounded-2xl border border-border/30 p-6 shadow-md">
                            Add at least <span className="text-accent font-black text-xl">2 people</span> to create a group
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleClose} className="flex-1 h-14 text-lg font-bold shadow-xl hover:shadow-2xl ring-2 ring-border/40 border-border/50 bg-card/80 backdrop-blur-sm hover:bg-muted/80 hover:scale-105">Cancel</Button>
                        <Button onClick={handleCreate} disabled={!groupName.trim() || participants.length < 2 || loading} className="flex-1 h-14 text-lg font-bold shadow-2xl hover:shadow-3xl hover:scale-[1.02] ring-2 ring-accent/40 bg-gradient-to-r from-primary to-accent text-primary-foreground">
                            {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-3" />Creating...</> : "Create Group"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CreateGroupModal;