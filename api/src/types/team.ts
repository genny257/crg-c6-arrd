import type { LucideIcon } from 'lucide-react';

export interface TeamMember {
    name: string;
    role: string;
    avatar: string;
    hint: string;
};

export interface Pool {
    name: string;
    mission: string;
    coordinators: TeamMember[];
    iconKey: string;
};

export interface TeamStructure {
    president: TeamMember;
    vicePresident: TeamMember;
    focalPoints: TeamMember[];
    coordinators: TeamMember[];
    operationalPools: Pool[];
    supportPools: Pool[];
}
