"use client";

import React, { useEffect, useState } from "react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext"; // assumes you're using a custom AuthContext
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";

const MouSignPage = () => {
    const { updateData, fetchData, userProfile } = useData();
    const [mous, setMous] = useState([]);
    const [loading, setLoading] = useState(false);
    const [signing, setSigning] = useState({});
    useEffect(() => {
        if (!userProfile?.uid) return;

        const fetchMous = async () => {
            setLoading(true);

            try {
                const { data: mous } = await fetchData({ path: "mous" });

                const userMous = mous.filter((mou) =>
                    mou.parties?.includes(userProfile.uid) &&
                    !mou.signedBy?.includes(userProfile.uid)
                );

                setMous(userMous);
                console.log("MOUs awaiting signature:", userMous);
            } catch (error) {
                console.error("Failed to fetch MOUs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMous();
    }, [userProfile]);


    const handleSign = async (mouId) => {
        setSigning((prev) => ({ ...prev, [mouId]: true }));

        try {
            await updateData("mous", mouId, {
                signedBy: [...(mous.find((mou) => mou.id === mouId).signedBy || []), userProfile.uid],
                updatedAt: new Date().toISOString(),
            });

            toast.success("MOU signed successfully");

            setMous((prev) => prev.filter((mou) => mou.id !== mouId));
        } catch (err) {
            console.error(err);
            toast.error("Failed to sign MOU");
        } finally {
            setSigning((prev) => ({ ...prev, [mouId]: false }));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Pending MOUs for Your Signature</h1>

            {loading ? (
                <p>Loading...</p>
            ) : mous.length === 0 ? (
                <p className="text-muted-foreground">You have no pending MOUs to sign.</p>
            ) : (
                <ul className="space-y-4">
                    {mous.map((mou) => (
                        <li key={mou.id} className="border bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-950 p-6 rounded-sm dark:text-gray-300 text-gray-800 duration-300 shadow-lg shadow-slate-900/10 dark:shadow-black/40">
                            <h2 className="text-lg font-semibold">{mou.title}</h2>
                            <p className="text-sm text-muted-foreground px-5">{mou.description}</p>
                            {mou.documentUrl && (
                                <a href={mou.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-4 flex items-center gap-2 mt-2">
                                    <svg className="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4" />
                                    </svg>
                                    Document
                                </a>
                            )}
                            <div className="mt-4 flex items-center gap-2">
                                <Checkbox
                                    id={`sign-${mou.id}`}
                                    disabled={signing[mou.id]}
                                    onCheckedChange={(checked) => {
                                        if (checked) handleSign(mou.id);
                                    }}
                                />
                                <label htmlFor={`sign-${mou.id}`} className="text-sm">
                                    I accept and agree to the terms of this MOU
                                </label>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MouSignPage;
