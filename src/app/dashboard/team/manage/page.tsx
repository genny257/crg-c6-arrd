
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, User, Briefcase, PlusCircle, Trash2, Edit, Save, X, Network } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { PoolManagementTab } from "./pool-management";
import { RoleManagementTab } from "./role-management";
import { AssignmentManagementTab } from "./assignment-management";


export default function TeamManagementPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    
    if (authLoading) {
        return <div>Chargement...</div>;
    }

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        router.push('/dashboard');
        return null;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon">
                    <Link href="/dashboard/team">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-headline font-bold">Administration de l'Équipe</h1>
            </div>

            <Tabs defaultValue="pools">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pools"><Briefcase className="mr-2 h-4 w-4"/>Pôles</TabsTrigger>
                    <TabsTrigger value="roles"><User className="mr-2 h-4 w-4"/>Rôles</TabsTrigger>
                    <TabsTrigger value="assignments"><Network className="mr-2 h-4 w-4"/>Assignations</TabsTrigger>
                </TabsList>
                <TabsContent value="pools" className="mt-4">
                    <PoolManagementTab />
                </TabsContent>
                <TabsContent value="roles" className="mt-4">
                    <RoleManagementTab />
                </TabsContent>
                 <TabsContent value="assignments" className="mt-4">
                    <AssignmentManagementTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}
