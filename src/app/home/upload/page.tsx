"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import ISO6391 from "iso-639-1";
import reloadToken from "@/functions/reloadToken";





export default function Home() {
  
    useEffect(() => {
      console.log(languageOptions)
      
        const userId = localStorage.getItem("userId");
        if (!userId) {
            window.location.href = "/auth/";
        }
    }, []);

    const [logo, setLogo] = useState<File | null>(null);
    const [music, setMusic] = useState<File | null>(null);
    const [selectedLanguages, setSelectedLanguages] = useState<any[]>([]);
    const [preview, setPreview] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    
    
const languageOptions = ISO6391.getAllNames().map(lang => ({
    value: lang,
    label: lang,
}));



    const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const img = new Image();
                img.src = reader.result as string;

                img.onload = () => {
                    const size = Math.min(img.width, img.height);
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    canvas.width = size;
                    canvas.height = size;

                    ctx?.drawImage(
                        img,
                        (img.width - size) / 2,
                        (img.height - size) / 2,
                        size,
                        size,
                        0,
                        0,
                        size,
                        size
                    );

                    setPreview(canvas.toDataURL("image/png"));
                };
            };

            reader.readAsDataURL(file);
            setLogo(file);
        }
    };

    const handleMusicChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("Selected Music File:", file);

            if (file.size === 0) {
                alert("Invalid file! The selected file is empty.  | it show zero byte file selected |  or your file not supported for some reason");
                return;
            }
    
            const reader = new FileReader();
            reader.onload = () => console.log("File Loaded Successfully");
            reader.onerror = () => { 
                setMusic(null);
                alert("Error loading file! Please try again.");
                console.log("Error loading file!")
            };
    
            reader.readAsDataURL(file);
    
            setMusic(file);
        }
    };

    const upload = async (
        logo: File | null,
        music: File | null,
        name: string,
        description: string,
        languages: string
    ) => {
        if (!logo || !music) {
            alert("Please upload both a logo and a music file!");
            return;
        }

        if (logo.size > 5 * 1024 * 1024) {
            alert("Logo file size should not exceed 5 MB.");
            return;
        }

        if (music.size > 50 * 1024 * 1024) {
            alert("Music file size should not exceed 50 MB.");
            return;
        }

        const formData = new FormData();
        formData.append("logo", logo);
        formData.append("music", music);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("languages", languages);

        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("You are not authorized. Please log in.");
            return;
        }

        setIsUploading(true);
        setProgress(0);

        try {
            let token = localStorage.getItem("accessToken");
            if (!token) {
                await reloadToken();
                token = localStorage.getItem("accessToken");
            }

            const res = await axios.post("/home/upload/api", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    userId
                },
                onUploadProgress: progressEvent => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded / progressEvent.total) * 100
                        );
                        setProgress(percentCompleted);
                    }
                }
            });

            if (res.status === 200) {
                alert("Uploaded successfully!");
                setLogo(null);
                setMusic(null);
                setPreview("");
                setProgress(0);
            } else {
                alert("Upload failed.");
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                await reloadToken();
                upload(logo, music, name, description, languages);
            } else {
                alert("An error occurred during the upload.");
                console.error(error);
            }
        } finally {
            setIsUploading(false);
        }
    };


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isUploading) return;

        if (!logo || !music) {
            alert("Please upload both a logo and a music file!");
            return;
        }

        upload(
            logo,
            music,
            (e.currentTarget.elements.namedItem("name") as HTMLInputElement)
                .value,
            (
                e.currentTarget.elements.namedItem(
                    "description"
                ) as HTMLTextAreaElement
            ).value,
JSON.stringify(selectedLanguages.map((lang) => lang.value))
        );
    };
    const handleLanguageChange = (selectedOptions: any) => {
    setSelectedLanguages(selectedOptions || []);
  };

    return (
        <div className="flex items-center justify-center bg-gray-100 relative">
            {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
                    <div className="w-1/2 bg-white rounded-lg shadow-lg p-6">
                        <div className="text-center text-xl font-bold mb-4">
                            Uploading...
                        </div>
                        <div className="relative w-full h-4 bg-gray-200 rounded">
                            <div
                                className="absolute top-0 left-0 h-full bg-blue-600 rounded"
                                style={{
                                    width: `${progress}%`,
                                    transition: "width 0.3s ease"
                                }}
                            ></div>
                        </div>
                        <div className="text-center mt-2 text-gray-600">
                            {progress}%
                        </div>
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className={`bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-6 ${
                    isUploading ? "opacity-50 pointer-events-none" : ""
                }`}
            >
                <div className="flex flex-col items-center">
                    <div
                        className={`w-32 h-32 border rounded-lg flex items-center justify-center overflow-hidden bg-gray-100 ${
                            isUploading
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                        }`}
                        onClick={
                            !isUploading
                                ? () => document.getElementById("logo")?.click()
                                : undefined
                        }
                    >
                        {preview ? (
                            <img
                                src={preview}
                                alt="Logo Preview"
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <span className="text-gray-500 text-sm">
                                {isUploading
                                    ? "Uploading..."
                                    : "Click to Upload"}
                            </span>
                        )}
                    </div>
                    <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                        required
                        disabled={isUploading}
                    />
                </div>

                <div>
                    <label
                        htmlFor="music"
                        className="block text-gray-700 font-medium mb-2"
                    >
                        Upload Music File (.mp3 or .wav)
                    </label>
                    <input
                        type="file"
                        id="music"
                        accept=".mp3,.wav"
                        className="mt-2 w-full text-sm text-gray-600"
                        onChange={handleMusicChange}
                        required
                        disabled={isUploading}
                    />
                </div>

                <input
                    type="text"
                    id="name"
                    name="name"
                    maxLength={50}
                    className="mt-2 w-full border rounded-lg p-2"
                    placeholder="Name (max 50 characters)"
                    required
                    disabled={isUploading}
                />

                <textarea
                    id="description"
                    name="description"
                    maxLength={1000}
                    className="mt-2 w-full border rounded-lg p-2"
                    rows={4}
                    placeholder="Description (max 1000 characters)"
                    required
                    disabled={isUploading}
                ></textarea>

                <Select
                    isMulti
                    options={languageOptions}
                    value={selectedLanguages}
                    onChange={handleLanguageChange}
                    isDisabled={isUploading}
                />

                <button
                    type="submit"
                    className={`w-full py-2 rounded-lg ${
                        isUploading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                    disabled={isUploading}
                >
                    {isUploading ? "Uploading..." : "Upload"}
                </button>
            </form>
        </div>
    );
}
