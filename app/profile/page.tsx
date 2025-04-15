"use client"

import { DeveloperProfile } from "@/components/developer-profile"

export default function ProfilePage() {
  return (
    <div className="simple-bg min-h-screen py-8">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="text-2xl font-bold mb-6">Developer Information</h1>
        <p className="text-gray-600 mb-6">
          Please provide some information about your background to help us contextualize the survey results. This
          information will be kept anonymous and used only for research purposes.
        </p>
        <DeveloperProfile />
      </div>
    </div>
  )
}
