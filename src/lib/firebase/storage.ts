// src/lib/firebase/storage.ts
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./client";

export const uploadFile = (file: File, path: string, onProgress: (progress: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!storage) {
            reject(new Error("Firebase Storage is not initialized."));
            return;
        }

        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress(progress);
            },
            (error) => {
                console.error("Upload failed", error);
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
};
