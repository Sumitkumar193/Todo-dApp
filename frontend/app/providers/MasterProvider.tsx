'use client';
import { ReactNode, useEffect } from "react";
import { RecoilRoot } from "recoil";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

export default function MasterProvider({ children }: { children: ReactNode }) {
    const queryClient = new QueryClient();

    return (
        <RecoilRoot>
            <QueryClientProvider client={queryClient}>
                <Toaster position="top-right" />
                {children}
            </QueryClientProvider>
        </RecoilRoot>
    )
}