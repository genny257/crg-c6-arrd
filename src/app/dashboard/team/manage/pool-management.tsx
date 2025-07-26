
"use client";
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Trash2, Edit, Save, X, Network } from "lucide-react";
import { allPoolIcons } from "@/lib/icons";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type TeamPool = {
    id: string;
    name: string;
    description?: string | null;
    iconKey?: string | null;
    type: 'OPERATIONAL' | 'SUPPORT';
}

export function PoolManagementTab() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [pools, setPools] = React.useState<TeamPool[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isCreating, setIsCreating] = React.useState(false);
    const [editingPool, setEditingPool] = React.useState<TeamPool | null>(null);

    const fetchPools = React.useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/pools`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error("Failed to fetch pools");
            setPools(await res.json());
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les pôles.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [token, toast]);

    React.useEffect(() => {
        fetchPools();
    }, [fetchPools]);

    const handleSave = async (pool: TeamPool) => {
        const isNew = !pool.id;
        const url = isNew ? `${process.env.NEXT_PUBLIC_API_URL}/team/pools` : `${process.env.NEXT_PUBLIC_API_URL}/team/pools/${pool.id}`;
        const method = isNew ? 'POST' : 'PUT';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(pool)
            });
            if (!res.ok) throw new Error(isNew ? "La création a échoué" : "La mise à jour a échoué");
            toast({ title: "Succès", description: `Pôle ${isNew ? 'créé' : 'mis à jour'}.` });
            setIsCreating(false);
            setEditingPool(null);
            fetchPools();
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        }
    }

    const handleDelete = async (id: string) => {
         try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/pools/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("La suppression a échoué");
            toast({ title: "Succès", description: "Pôle supprimé." });
            fetchPools();
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        }
    }
    
    const PoolForm = ({ pool, onSave, onCancel }: { pool: TeamPool | Omit<TeamPool, 'id'>, onSave: (p: TeamPool) => void, onCancel: () => void }) => {
        const [formData, setFormData] = React.useState(pool);
        const Icon = allPoolIcons[formData.iconKey || ''] || Network;
        
        return (
             <div className="flex flex-col sm:flex-row gap-4 items-start p-4 border rounded-lg bg-muted/50 my-2">
                <div className="flex-1 space-y-2">
                    <Input placeholder="Nom du pôle" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <Textarea placeholder="Description / Mission du pôle" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    <Select value={formData.iconKey || ''} onValueChange={value => setFormData({...formData, iconKey: value})}>
                        <SelectTrigger><SelectValue placeholder="Choisir une icône" /></SelectTrigger>
                        <SelectContent>
                            {Object.keys(allPoolIcons).map(key => (
                                <SelectItem key={key} value={key}>{key}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <RadioGroup defaultValue={formData.type} onValueChange={value => setFormData({...formData, type: value as TeamPool['type']})} className="flex pt-2">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="OPERATIONAL" id="op"/><Label htmlFor="op">Opérationnel</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="SUPPORT" id="sup"/><Label htmlFor="sup">Support</Label></div>
                    </RadioGroup>
                </div>
                 <div className="flex-shrink-0 flex items-center gap-2">
                    <Button size="icon" onClick={() => onSave(formData as TeamPool)}><Save className="h-4 w-4" /></Button>
                    <Button size="icon" variant="outline" onClick={onCancel}><X className="h-4 w-4" /></Button>
                </div>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gestion des Pôles</CardTitle>
                <CardDescription>Créez et organisez les pôles opérationnels et de support de votre comité.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                     {loading ? <Skeleton className="h-24 w-full" /> : pools.map(pool => (
                        editingPool?.id === pool.id ? (
                            <PoolForm key={pool.id} pool={editingPool} onSave={handleSave} onCancel={() => setEditingPool(null)} />
                        ) : (
                            <div key={pool.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    {(allPoolIcons[pool.iconKey || ''] || Network)({ className: "h-5 w-5 text-muted-foreground" })}
                                    <div>
                                        <p className="font-medium">{pool.name} <Badge variant="outline">{pool.type}</Badge></p>
                                        <p className="text-sm text-muted-foreground">{pool.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="icon" variant="ghost" onClick={() => setEditingPool(pool)}><Edit className="h-4 w-4" /></Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleDelete(pool.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </div>
                            </div>
                        )
                    ))}
                    {isCreating && (
                        <PoolForm pool={{name: '', description: '', type: 'OPERATIONAL'}} onSave={handleSave} onCancel={() => setIsCreating(false)}/>
                    )}
                </div>
                 <Button className="mt-4" variant="outline" onClick={() => setIsCreating(true)} disabled={isCreating}>
                    <PlusCircle className="mr-2 h-4 w-4"/> Ajouter un pôle
                </Button>
            </CardContent>
        </Card>
    )
}
