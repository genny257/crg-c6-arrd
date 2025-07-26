
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Trash2, Edit, Save, X } from "lucide-react";

type TeamRole = {
    id: string;
    name: string;
    description?: string | null;
}

export function RoleManagementTab() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [roles, setRoles] = React.useState<TeamRole[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isCreating, setIsCreating] = React.useState(false);
    const [editingRole, setEditingRole] = React.useState<TeamRole | null>(null);

    const fetchRoles = React.useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/roles`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error("Failed to fetch roles");
            setRoles(await res.json());
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les rôles.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [token, toast]);

    React.useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);
    
    const handleSave = async (role: TeamRole) => {
        const isNew = !role.id;
        const url = isNew ? `${process.env.NEXT_PUBLIC_API_URL}/team/roles` : `${process.env.NEXT_PUBLIC_API_URL}/team/roles/${role.id}`;
        const method = isNew ? 'POST' : 'PUT';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(role)
            });
            if (!res.ok) throw new Error(isNew ? "La création a échoué" : "La mise à jour a échoué");
            toast({ title: "Succès", description: `Rôle ${isNew ? 'créé' : 'mis à jour'}.` });
            setIsCreating(false);
            setEditingRole(null);
            fetchRoles();
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        }
    }

    const handleDelete = async (id: string) => {
         try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/roles/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("La suppression a échoué");
            toast({ title: "Succès", description: "Rôle supprimé." });
            fetchRoles();
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        }
    }

    const RoleForm = ({ role, onSave, onCancel }: { role: TeamRole | Omit<TeamRole, 'id'>, onSave: (r: TeamRole) => void, onCancel: () => void }) => {
        const [formData, setFormData] = React.useState(role);
        return (
            <div className="flex flex-col sm:flex-row gap-2 items-center p-4 border rounded-lg bg-muted/50 my-2">
                <Input className="flex-1" placeholder="Nom du rôle" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <Input className="flex-1" placeholder="Description (optionnel)" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                <div className="flex-shrink-0 flex items-center gap-2">
                    <Button size="icon" onClick={() => onSave(formData as TeamRole)}><Save className="h-4 w-4" /></Button>
                    <Button size="icon" variant="outline" onClick={onCancel}><X className="h-4 w-4" /></Button>
                </div>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gestion des Rôles</CardTitle>
                <CardDescription>Définissez les différents rôles au sein de votre équipe (ex: Président, Point Focal, Coordinateur).</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {loading ? <Skeleton className="h-16 w-full" /> : roles.map(role => (
                        editingRole?.id === role.id ? (
                            <RoleForm key={role.id} role={editingRole} onSave={handleSave} onCancel={() => setEditingRole(null)} />
                        ) : (
                            <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <p className="font-medium">{role.name}</p>
                                    <p className="text-sm text-muted-foreground">{role.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="icon" variant="ghost" onClick={() => setEditingRole(role)}><Edit className="h-4 w-4" /></Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleDelete(role.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </div>
                            </div>
                        )
                    ))}
                    {isCreating && (
                        <RoleForm role={{name: '', description: ''}} onSave={handleSave} onCancel={() => setIsCreating(false)}/>
                    )}
                </div>
                <Button className="mt-4" variant="outline" onClick={() => setIsCreating(true)} disabled={isCreating}>
                    <PlusCircle className="mr-2 h-4 w-4"/> Ajouter un rôle
                </Button>
            </CardContent>
        </Card>
    )
}
