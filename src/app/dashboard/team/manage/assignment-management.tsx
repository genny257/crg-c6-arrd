
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, User, Briefcase, Trash2 } from "lucide-react";
import type { Volunteer } from "@/types/volunteer";

type TeamRole = {
    id: string;
    name: string;
};

type TeamPool = {
    id: string;
    name: string;
    coordinators: { id: string }[];
};

export function AssignmentManagementTab() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [users, setUsers] = React.useState<Volunteer[]>([]);
    const [roles, setRoles] = React.useState<TeamRole[]>([]);
    const [pools, setPools] = React.useState<TeamPool[]>([]);
    const [loading, setLoading] = React.useState(true);
    
    const [selectedRoleUser, setSelectedRoleUser] = React.useState('');
    const [selectedRole, setSelectedRole] = React.useState('');
    
    const [selectedPoolUser, setSelectedPoolUser] = React.useState('');
    const [selectedPool, setSelectedPool] = React.useState('');

    const fetchData = React.useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [usersRes, rolesRes, poolsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/roles`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/pools`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            setUsers(await usersRes.json());
            setRoles(await rolesRes.json());
            setPools(await poolsRes.json());
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les données d'assignation.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [token, toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAssignRole = async () => {
        if (!selectedRoleUser || !selectedRole) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/assign-role`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ userId: selectedRoleUser, roleId: selectedRole })
            });
            if (!res.ok) throw new Error("L'assignation a échoué");
            toast({ title: "Succès", description: "Rôle assigné." });
            fetchData();
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        }
    }
    
    const handleAssignCoordinator = async () => {
        if (!selectedPoolUser || !selectedPool) return;
         try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/assign-coordinator`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ userId: selectedPoolUser, poolId: selectedPool })
            });
            if (!res.ok) throw new Error("L'assignation a échoué");
            toast({ title: "Succès", description: "Coordinateur assigné." });
            fetchData();
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        }
    }
    
    const handleRemoveCoordinator = async (poolId: string, userId: string) => {
         try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/remove-coordinator`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ userId: userId, poolId: poolId })
            });
            if (!res.ok) throw new Error("La suppression a échoué");
            toast({ title: "Succès", description: "Coordinateur retiré." });
            fetchData();
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        }
    }

    if (loading) {
        return <Skeleton className="h-64 w-full" />;
    }

    return (
        <div className="grid md:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User className="h-5 w-5"/>Assigner un Rôle</CardTitle>
                    <CardDescription>Attribuez un rôle fonctionnel à un utilisateur.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Select value={selectedRoleUser} onValueChange={setSelectedRoleUser}>
                        <SelectTrigger><SelectValue placeholder="Choisir un utilisateur..." /></SelectTrigger>
                        <SelectContent>{users.map(u => <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>)}</SelectContent>
                    </Select>
                     <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger><SelectValue placeholder="Choisir un rôle..." /></SelectTrigger>
                        <SelectContent>{roles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button onClick={handleAssignRole} disabled={!selectedRoleUser || !selectedRole}>Assigner le rôle</Button>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5"/>Assigner un Coordinateur de Pôle</CardTitle>
                    <CardDescription>Désignez un utilisateur pour coordonner un pôle.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Select value={selectedPoolUser} onValueChange={setSelectedPoolUser}>
                        <SelectTrigger><SelectValue placeholder="Choisir un utilisateur..." /></SelectTrigger>
                        <SelectContent>{users.map(u => <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>)}</SelectContent>
                    </Select>
                     <Select value={selectedPool} onValueChange={setSelectedPool}>
                        <SelectTrigger><SelectValue placeholder="Choisir un pôle..." /></SelectTrigger>
                        <SelectContent>{pools.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button onClick={handleAssignCoordinator} disabled={!selectedPoolUser || !selectedPool}>Assigner comme coordinateur</Button>
                     <div className="pt-4">
                        <h4 className="text-sm font-medium mb-2">Coordinateurs actuels</h4>
                        <Table>
                            <TableHeader><TableRow><TableHead>Pôle</TableHead><TableHead>Coordinateur</TableHead><TableHead></TableHead></TableRow></TableHeader>
                            <TableBody>
                                {pools.filter(p => p.coordinators.length > 0).map(pool => (
                                    pool.coordinators.map(coord => {
                                        const user = users.find(u => u.id === coord.id);
                                        return (
                                            <TableRow key={`${pool.id}-${coord.id}`}>
                                                <TableCell>{pool.name}</TableCell>
                                                <TableCell>{user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu'}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveCoordinator(pool.id, coord.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

